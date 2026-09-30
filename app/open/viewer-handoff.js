'use client';

import { useEffect, useState } from 'react';
import { legacyViewerUrl, parseHandoffHash } from './viewer-link';

// Message shapes, protocol version, and bounds mirror the extension repo's
// extension/src/shared/viewer_handoff.ts (bridge content script +
// service-worker navigation). Keep the two files in sync: the extension
// validates every field again on its side and silently ignores anything that
// does not match, so a drifted shape here means the handshake never completes
// and every visitor falls back to the legacy redirect.
const PROTOCOL_VERSION = 1;
const TYPE_DISCOVER = 'llmnesia-viewer:discover';
const TYPE_DISCOVERED = 'llmnesia-viewer:discovered';
const TYPE_OPEN = 'llmnesia-viewer:open';
const TYPE_OPENING = 'llmnesia-viewer:opening';
const TYPE_OPEN_FAILED = 'llmnesia-viewer:open-failed';

const EXTENSION_ID_RE = /^[a-p]{32}$/;
const MAX_REASON_LENGTH = 120;
// The bridge content script injects at document idle and dynamic-imports its
// module, so it normally answers within a few hundred milliseconds. Extension
// releases older than the bridge never answer; they get the legacy redirect
// once this window closes, which is the behaviour /open has always had.
const DISCOVERY_WINDOW_MS = 2000;
const DISCOVERY_INTERVAL_MS = 250;
const OPEN_CONFIRMATION_TIMEOUT_MS = 3000;

function newRequestId() {
  // Matches the extension's requestId pattern: [A-Za-z0-9_-]{8,128}.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `llm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const styles = {
  main: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '32px 20px',
    background: '#fffef8',
    color: '#243342'
  },
  card: {
    width: 'min(560px, 100%)',
    padding: '32px',
    border: '1px solid #dbe2cf',
    borderRadius: '18px',
    background: '#ffffff',
    boxShadow: '0 18px 50px rgba(36, 51, 66, 0.1)',
    textAlign: 'center'
  },
  eyebrow: {
    margin: '0 0 10px',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#526771'
  },
  title: {
    margin: '0',
    fontSize: 'clamp(28px, 6vw, 42px)',
    lineHeight: 1.08,
    letterSpacing: '-0.03em'
  },
  body: {
    margin: '16px auto 0',
    maxWidth: '430px',
    lineHeight: 1.6,
    color: '#52616f'
  },
  found: {
    margin: '10px auto 0',
    maxWidth: '430px',
    fontSize: '13px',
    lineHeight: 1.5,
    color: '#70808d'
  },
  actions: {
    marginTop: '24px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  button: {
    display: 'inline-block',
    marginTop: '24px',
    padding: '12px 18px',
    borderRadius: '10px',
    background: '#2b6588',
    color: '#ffffff',
    fontWeight: 700,
    textDecoration: 'none'
  },
  actionButton: {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '10px',
    border: 'none',
    background: '#2b6588',
    color: '#ffffff',
    fontWeight: 700,
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '16px'
  },
  actionGhost: {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '10px',
    border: '1px solid #b9c7d2',
    background: '#ffffff',
    color: '#2b6588',
    fontWeight: 700,
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '16px'
  },
  privacy: {
    margin: '22px 0 0',
    fontSize: '13px',
    lineHeight: 1.5,
    color: '#70808d'
  }
};

export default function ViewerHandoff() {
  // starting: discovering installed builds. opening: a build accepted the open
  // request (the tab usually navigates before any confirmation arrives).
  // legacy: nobody answered, falling back to the link's own extension ID.
  // failed / no-extension: terminal states with a retry.
  const [phase, setPhase] = useState('starting');
  const [invalid, setInvalid] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  const [responderLabel, setResponderLabel] = useState('');
  const [legacyUrl, setLegacyUrl] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const parsed = parseHandoffHash(window.location.hash);
    if (!parsed) {
      setInvalid(true);
      return undefined;
    }

    const hint = EXTENSION_ID_RE.test(parsed.extensionId) ? parsed.extensionId : '';
    if (hint) {
      setLegacyUrl(legacyViewerUrl(hint, parsed.docId));
    }

    let cancelled = false;
    let discoverTimer = null;
    let openTimer = null;
    let opened = false;
    const responders = new Map();

    const chooseTarget = () => {
      if (hint && responders.has(hint)) return hint;
      const first = responders.keys().next();
      return first.done ? null : first.value;
    };

    const stopDiscovery = () => {
      if (discoverTimer) {
        clearInterval(discoverTimer);
        discoverTimer = null;
      }
    };

    const sendOpen = (targetExtensionId) => {
      if (opened || cancelled) return;
      opened = true;
      stopDiscovery();
      setPhase('opening');
      window.postMessage(
        {
          v: PROTOCOL_VERSION,
          type: TYPE_OPEN,
          requestId,
          targetExtensionId,
          docId: parsed.docId
        },
        window.location.origin
      );
      // Success navigates this tab from the extension's side, so silence is
      // normal. Only treat a still-living page with no answer at all as a
      // failure once the confirmation window has lapsed.
      openTimer = setTimeout(() => {
        if (cancelled) return;
        setPhase('failed');
        setFailureReason('The extension did not confirm the hand-off.');
      }, OPEN_CONFIRMATION_TIMEOUT_MS);
    };

    const onMessage = (event) => {
      if (event.source !== window || event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.v !== PROTOCOL_VERSION || data.requestId !== requestId) return;
      if (data.type === TYPE_DISCOVERED && EXTENSION_ID_RE.test(data.extensionId)) {
        if (!responders.has(data.extensionId)) {
          responders.set(
            data.extensionId,
            typeof data.label === 'string' ? data.label.slice(0, MAX_REASON_LENGTH) : ''
          );
          const target = chooseTarget();
          if (target) {
            setResponderLabel(responders.get(target));
            sendOpen(target);
          }
        }
        return;
      }
      if (data.type === TYPE_OPENING) {
        if (openTimer) {
          clearTimeout(openTimer);
          openTimer = null;
        }
        return;
      }
      if (data.type === TYPE_OPEN_FAILED) {
        if (openTimer) {
          clearTimeout(openTimer);
          openTimer = null;
        }
        setPhase('failed');
        setFailureReason(
          typeof data.reason === 'string'
            ? data.reason.slice(0, MAX_REASON_LENGTH)
            : 'The extension refused the hand-off.'
        );
      }
    };

    // One requestId spans this attempt; the extension deduplicates open
    // requests by it, and replies echo it back.
    const requestId = newRequestId();
    const discoverDeadline = Date.now() + DISCOVERY_WINDOW_MS;
    const discoverOnce = () => {
      if (opened || cancelled) return;
      window.postMessage(
        { v: PROTOCOL_VERSION, type: TYPE_DISCOVER, requestId },
        window.location.origin
      );
      if (Date.now() >= discoverDeadline) {
        stopDiscovery();
        // No bridge answered. Extensions released before the handshake only
        // understand the direct redirect, which works whenever the link's ID
        // matches the installation that generated it (the common case).
        if (hint) {
          window.location.replace(legacyViewerUrl(hint, parsed.docId));
          setPhase('legacy');
        } else {
          setPhase('no-extension');
        }
      }
    };

    window.addEventListener('message', onMessage);
    discoverOnce();
    discoverTimer = setInterval(discoverOnce, DISCOVERY_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.removeEventListener('message', onMessage);
      stopDiscovery();
      if (openTimer) {
        clearTimeout(openTimer);
      }
    };
  }, [attempt]);

  const retry = () => {
    setFailureReason('');
    setResponderLabel('');
    setPhase('starting');
    setAttempt((n) => n + 1);
  };

  const invalidHandled = invalid;
  const showLegacyAnchor = Boolean(legacyUrl) && (phase === 'failed' || phase === 'legacy');

  return (
    <main style={styles.main}>
      <section style={styles.card} aria-live="polite">
        <p style={styles.eyebrow}>LLMnesia source</p>
        <h1 style={styles.title}>
          {invalidHandled
            ? 'This source link is incomplete'
            : phase === 'failed'
              ? 'The hand-off did not complete'
              : phase === 'no-extension'
                ? 'No LLMnesia extension responded'
                : 'Opening your saved conversation'}
        </h1>
        <p style={styles.body}>
          {invalidHandled
            ? 'Return to your desktop AI answer and open the source again.'
            : phase === 'starting'
              ? 'LLMnesia is handing this source to the private Viewer in your browser extension.'
              : phase === 'opening'
                ? 'Your extension accepted the hand-off. Opening the saved conversation in its private Viewer.'
                : phase === 'legacy'
                  ? 'No extension answered the handshake, so this link is opening with the extension ID saved in it.'
                  : phase === 'failed'
                    ? failureReason || 'The extension could not open this source.'
                    : 'Make sure the LLMnesia extension is installed and enabled in this browser, then retry.'}
        </p>
        {phase === 'opening' && responderLabel ? (
          <p style={styles.found}>Responding build: {responderLabel}</p>
        ) : null}
        {phase === 'starting' || phase === 'opening' ? (
          <a
            href={legacyUrl || '#'}
            style={{ ...styles.button, visibility: legacyUrl ? 'visible' : 'hidden' }}
            aria-hidden={!legacyUrl}
            tabIndex={legacyUrl ? 0 : -1}
          >
            Open LLMnesia Viewer
          </a>
        ) : null}
        {phase === 'failed' || phase === 'no-extension' ? (
          <div style={styles.actions}>
            <button type="button" style={styles.actionButton} onClick={retry}>
              Try again
            </button>
            {showLegacyAnchor ? (
              <a href={legacyUrl} style={styles.actionGhost}>
                Open with the link&rsquo;s saved extension
              </a>
            ) : null}
          </div>
        ) : null}
        <p style={styles.privacy}>
          The conversation identifier stays after the # in this address. Browsers do not send that fragment to this website.
        </p>
      </section>
    </main>
  );
}
