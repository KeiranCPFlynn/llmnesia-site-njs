// Viewer hand-off discovery controller: the decision half of the /open page,
// kept free of React so behavioral tests can drive it directly in node.
//
// Message shapes, protocol version, and bounds mirror the extension repo's
// extension/src/shared/viewer_handoff.ts (bridge content script +
// service-worker navigation). Keep the two in sync: the extension validates
// every field again on its side and silently ignores anything that does not
// match, so a drifted shape here means the handshake never completes.
//
// Policy implemented here (the original brief's requirements):
//   • A link's extensionId is a PREFERENCE only. A responding build that
//     matches it wins immediately; otherwise a sole responder is used; several
//     responders with no match produce an explicit choice. Installations are
//     never raced.
//   • Discovery runs in a bounded window with retry pings, so a content script
//     that injects after the page mounts cannot be missed.
//   • Nothing here navigates to a chrome-extension:// URL. The selected
//     extension opens its own Viewer; when no compatible build answers,
//     resolveUnavailableState decides between the pre-bridge legacy redirect
//     and the on-page guidance.

import { legacyViewerUrl } from './viewer-link.js';

export const PROTOCOL_VERSION = 1;
export const TYPE_DISCOVER = 'llmnesia-viewer:discover';
export const TYPE_DISCOVERED = 'llmnesia-viewer:discovered';
export const TYPE_OPEN = 'llmnesia-viewer:open';
export const TYPE_OPENING = 'llmnesia-viewer:opening';
export const TYPE_OPEN_FAILED = 'llmnesia-viewer:open-failed';

export const EXTENSION_ID_RE = /^[a-p]{32}$/;
const REQUEST_ID_RE = /^[A-Za-z0-9_-]{8,128}$/;
const MAX_LABEL_LENGTH = 120;
const MAX_REASON_LENGTH = 120;

// The bridge content script injects at document idle and dynamic-imports its
// module, so it normally answers within a few hundred milliseconds.
export const DEFAULT_DISCOVERY_WINDOW_MS = 2500;
export const DEFAULT_DISCOVERY_INTERVAL_MS = 250;
export const DEFAULT_OPEN_ACK_TIMEOUT_MS = 3000;

const GENERIC_OPEN_FAILURE = 'The extension could not open this source.';

function defaultNewRequestId() {
  // Matches the extension's requestId pattern: [A-Za-z0-9_-]{8,128}.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `llm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function abbreviatedExtensionId(extensionId) {
  return EXTENSION_ID_RE.test(extensionId) ? `${extensionId.slice(0, 6)}…` : '';
}

// What the page does when the discovery window closes with no responder.
// Extensions released before the handshake (it shipped in extension 0.4.10)
// cannot answer discovery and can only be opened through the direct
// chrome-extension:// redirect the link itself carries, and until those
// installs auto-update they are the common case — so a valid hint falls back
// to its legacy URL. Without a hint there is nothing trustworthy to redirect
// to, and the page stays with guidance. The hint is the link's own build, not
// a guess: wrong only when the link traveled to a browser without that build.
// Revisit once pre-bridge installs have aged out of the update population.
export function resolveUnavailableState(preferredExtensionId, docId) {
  return EXTENSION_ID_RE.test(preferredExtensionId)
    ? { phase: 'legacy', legacyUrl: legacyViewerUrl(preferredExtensionId, docId) }
    : { phase: 'unavailable' };
}

function boundedText(value, maxLength, fallback) {
  return typeof value === 'string' && value.length > 0
    ? value.slice(0, maxLength)
    : fallback;
}

/**
 * States emitted through onState, one object per transition:
 *   { phase: 'searching' }
 *   { phase: 'choice', responders: [{ extensionId, label }] }
 *   { phase: 'opening', responder: { extensionId, label } }
 *   { phase: 'failed', reason }
 *   { phase: 'unavailable' }
 */
export function createViewerHandoffController({
  docId,
  preferredExtensionId = '',
  postMessage,
  addMessageListener,
  expectedSource,
  expectedOrigin,
  newRequestId = defaultNewRequestId,
  setTimer = (fn, ms) => setTimeout(fn, ms),
  clearTimer = (timer) => clearTimeout(timer),
  startInterval = (fn, ms) => setInterval(fn, ms),
  stopInterval = (timer) => clearInterval(timer),
  discoveryWindowMs = DEFAULT_DISCOVERY_WINDOW_MS,
  discoveryIntervalMs = DEFAULT_DISCOVERY_INTERVAL_MS,
  openAckTimeoutMs = DEFAULT_OPEN_ACK_TIMEOUT_MS,
  onState
}) {
  const responders = new Map();
  let unsubscribed = false;
  let stopped = false;
  let unsubscribe = null;
  let discoveryTimer = null;
  let discoveryPing = null;
  let openAckTimer = null;
  let requestId = newRequestId();
  let openTargetId = null;
  let decided = false;

  function emit(state) {
    if (!stopped && typeof onState === 'function') {
      onState(state);
    }
  }

  function stopTimers() {
    if (discoveryTimer !== null) {
      clearTimer(discoveryTimer);
      discoveryTimer = null;
    }
    if (discoveryPing !== null) {
      stopInterval(discoveryPing);
      discoveryPing = null;
    }
    if (openAckTimer !== null) {
      clearTimer(openAckTimer);
      openAckTimer = null;
    }
  }

  function sortedResponders() {
    return Array.from(responders.entries())
      .map(([extensionId, responder]) => ({ extensionId, label: responder.label }))
      .sort((a, b) => a.label.localeCompare(b.label) || (a.extensionId < b.extensionId ? -1 : 1));
  }

  function postDiscover() {
    if (stopped || openTargetId !== null) return;
    postMessage({ v: PROTOCOL_VERSION, type: TYPE_DISCOVER, requestId });
  }

  function sendOpen(targetExtensionId) {
    if (stopped || openTargetId !== null || !responders.has(targetExtensionId)) return;
    openTargetId = targetExtensionId;
    stopTimers();
    // Every open attempt carries a fresh request id: the extension deduplicates
    // opens by id, and a failover after an ack timeout is a new attempt with
    // its own dedupe key and its own ack binding.
    requestId = newRequestId();
    emit({ phase: 'opening', responder: { extensionId: targetExtensionId, label: responders.get(targetExtensionId).label } });
    postMessage({
      v: PROTOCOL_VERSION,
      type: TYPE_OPEN,
      requestId,
      targetExtensionId,
      docId
    });
    // Success navigates this tab from the extension's side, so silence is
    // normal. A still-living page with no acknowledgement gets a bounded
    // failover: the unresponsive build is dropped and the remaining
    // responders are reconsidered instead of waiting forever.
    openAckTimer = setTimer(() => {
      openAckTimer = null;
      if (stopped || openTargetId === null) return;
      responders.delete(openTargetId);
      openTargetId = null;
      decide();
    }, openAckTimeoutMs);
  }

  function decide() {
    if (stopped || openTargetId !== null || decided) return;
    if (preferredExtensionId && responders.has(preferredExtensionId)) {
      sendOpen(preferredExtensionId);
      return;
    }
    if (responders.size === 0) {
      if (discoveryTimer === null) {
        // Discovery window closed with nobody home. Never guess at a
        // chrome-extension URL from the link: stay here with guidance.
        decided = true;
        stopTimers();
        emit({ phase: 'unavailable' });
      }
      return;
    }
    if (responders.size === 1) {
      sendOpen(responders.keys().next().value);
      return;
    }
    decided = true;
    stopTimers();
    emit({ phase: 'choice', responders: sortedResponders() });
  }

  function finishDiscovery() {
    discoveryTimer = null;
    if (discoveryPing !== null) {
      stopInterval(discoveryPing);
      discoveryPing = null;
    }
    decide();
  }

  function handleEvent(event) {
    if (stopped) return;
    // Page messages are untrusted commands even on this origin: bind the
    // source, the origin, the protocol version, and this attempt's request id
    // before trusting any field.
    if (event.source !== expectedSource) return;
    if (event.origin !== expectedOrigin) return;
    const data = event.data;
    if (!data || typeof data !== 'object' || data.v !== PROTOCOL_VERSION) return;
    if (!REQUEST_ID_RE.test(data.requestId) || data.requestId !== requestId) return;

    if (data.type === TYPE_DISCOVERED) {
      const extensionId = data.extensionId;
      if (!EXTENSION_ID_RE.test(extensionId)) return;
      if (!responders.has(extensionId)) {
        responders.set(extensionId, { label: boundedText(data.label, MAX_LABEL_LENGTH, '') });
        if (preferredExtensionId && extensionId === preferredExtensionId) {
          // The link's own build answered: it wins over any other responder
          // (and over a choice already on screen) without waiting out the
          // window.
          stopTimers();
          sendOpen(extensionId);
        }
      }
      return;
    }
    if (data.type === TYPE_OPENING) {
      if (openAckTimer !== null) {
        clearTimer(openAckTimer);
        openAckTimer = null;
      }
      return;
    }
    if (data.type === TYPE_OPEN_FAILED) {
      if (openTargetId === null) return;
      openTargetId = null;
      stopTimers();
      emit({ phase: 'failed', reason: boundedText(data.reason, MAX_REASON_LENGTH, GENERIC_OPEN_FAILURE) });
    }
  }

  return {
    start() {
      if (stopped || unsubscribe) return;
      unsubscribe = addMessageListener(handleEvent);
      emit({ phase: 'searching' });
      postDiscover();
      discoveryPing = startInterval(postDiscover, discoveryIntervalMs);
      discoveryTimer = setTimer(finishDiscovery, discoveryWindowMs);
    },
    /** User picks one of the builds offered in the choice state. */
    choose(targetExtensionId) {
      if (stopped || !decided || openTargetId !== null) return;
      if (!responders.has(targetExtensionId)) return;
      decided = false;
      sendOpen(targetExtensionId);
    },
    stop() {
      stopped = true;
      stopTimers();
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    }
  };
}
