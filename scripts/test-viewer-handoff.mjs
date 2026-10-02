// Behavioral tests for the /open viewer hand-off: the link parser plus the
// discovery controller in app/open/viewer-bridge.js, driven through a fake
// page with a manual clock. These cover the acceptance matrix: stale hint with
// a sole responder, matching hint arriving after another build, multiple
// responders with an explicit choice, no responder with and without an old
// hint, retry/cleanup, malformed or unrelated messages, and open-ack timeout.
// Run: node scripts/test-viewer-handoff.mjs

import assert from 'node:assert/strict';
import {
  EXTENSION_ID_RE,
  PROTOCOL_VERSION,
  TYPE_DISCOVER,
  TYPE_DISCOVERED,
  TYPE_OPEN,
  TYPE_OPENING,
  TYPE_OPEN_FAILED,
  abbreviatedExtensionId,
  createViewerHandoffController,
  resolveUnavailableState
} from '../app/open/viewer-bridge.js';
import { legacyViewerUrl, parseHandoffHash } from '../app/open/viewer-link.js';

const STORE_ID = 'leekfgbdojiaabifbjbbgiiclannjdkf';
const LOCAL_ID = 'bmpnhnhpcfchlepacelfcommjhaneeni';
const OTHER_ID = 'aaaabbbbccccddddaaaabbbbccccdddd';
const ORIGIN = 'https://llmnesia.com';

// --- parser (unchanged contract; extensionId is a preference, not a target) ---

assert.deepEqual(
  parseHandoffHash(`#docId=claude_code%3Aabc-123&extensionId=${STORE_ID}`),
  { docId: 'claude_code:abc-123', extensionId: STORE_ID }
);
assert.deepEqual(parseHandoffHash('#docId=claude%3Aabc'), { docId: 'claude:abc', extensionId: '' });
assert.deepEqual(parseHandoffHash('#docId=%20claude%3Aabc%20'), { docId: 'claude:abc', extensionId: '' });
assert.equal(parseHandoffHash('#docId=claude%3Aabc&extensionId=not-an-extension').extensionId, '');
assert.equal(parseHandoffHash(`#docId=${'a'.repeat(513)}&extensionId=${STORE_ID}`), null);
assert.equal(parseHandoffHash('#docId=claude%3Aabc%0Adef'), null);
assert.equal(parseHandoffHash(''), null);
assert.equal(parseHandoffHash('#extensionId=leekfgbdojiaabifbjbbgiiclannjdkf'), null);

// Abbreviated IDs are display-only.
assert.equal(abbreviatedExtensionId(STORE_ID), `${STORE_ID.slice(0, 6)}…`);
assert.equal(abbreviatedExtensionId('nope'), '');

// --- no-responder fallback policy (the page applies this to 'unavailable') ---

// Legacy redirect used when no bridge answers discovery but the link names its
// own build — the only path pre-handshake extensions (before 0.4.10) open via.
assert.equal(
  legacyViewerUrl(STORE_ID, 'claude_code:abc-123'),
  `chrome-extension://${STORE_ID}/viewer.html?docId=claude_code%3Aabc-123`
);
assert.deepEqual(resolveUnavailableState(STORE_ID, 'claude_code:abc-123'), {
  phase: 'legacy',
  legacyUrl: `chrome-extension://${STORE_ID}/viewer.html?docId=claude_code%3Aabc-123`
});
// No usable hint: nothing trustworthy to redirect to, so stay on the page.
assert.deepEqual(resolveUnavailableState('', 'claude_code:abc-123'), { phase: 'unavailable' });
assert.deepEqual(resolveUnavailableState('not-an-extension', 'claude_code:abc-123'), {
  phase: 'unavailable'
});

// --- harness: a fake page plus a manual clock driving the real controller ---

class ManualClock {
  constructor() {
    this.nowMs = 0;
    this.nextId = 1;
    this.jobs = new Map();
  }

  setTimer(fn, ms) {
    const id = this.nextId++;
    this.jobs.set(id, { id, at: this.nowMs + ms, fn, interval: null });
    return id;
  }

  clearTimer(id) {
    this.jobs.delete(id);
  }

  startInterval(fn, ms) {
    const id = this.nextId++;
    this.jobs.set(id, { id, at: this.nowMs + ms, fn, interval: ms });
    return id;
  }

  stopInterval(id) {
    this.jobs.delete(id);
  }

  advance(ms) {
    const end = this.nowMs + ms;
    for (;;) {
      let due = null;
      for (const job of this.jobs.values()) {
        if (job.at <= end && (due === null || job.at < due.at)) due = job;
      }
      if (!due) break;
      this.nowMs = due.at;
      if (due.interval === null) {
        this.jobs.delete(due.id);
      } else {
        due.at = this.nowMs + due.interval;
      }
      due.fn();
    }
    this.nowMs = end;
  }
}

function makePage({ hint = '', docId = 'claude_code:viewer-only' } = {}) {
  const clock = new ManualClock();
  const posted = [];
  const states = [];
  let handler = null;
  let requestCounter = 0;
  // One stable identity for the page's own window: the controller checks
  // event.source by reference, exactly like a real browser would.
  const pageSource = { fake: 'window' };

  const controller = createViewerHandoffController({
    docId,
    preferredExtensionId: hint,
    postMessage: (message) => posted.push({ at: clock.nowMs, message }),
    addMessageListener: (newHandler) => {
      handler = newHandler;
      return () => {
        handler = null;
      };
    },
    expectedSource: pageSource,
    expectedOrigin: ORIGIN,
    // Valid per the protocol's own bound: [A-Za-z0-9_-]{8,128}.
    newRequestId: () => `handoff-request-${requestCounter++}`,
    setTimer: (fn, ms) => clock.setTimer(fn, ms),
    clearTimer: (id) => clock.clearTimer(id),
    startInterval: (fn, ms) => clock.startInterval(fn, ms),
    stopInterval: (id) => clock.stopInterval(id),
    discoveryWindowMs: 2000,
    discoveryIntervalMs: 250,
    openAckTimeoutMs: 1000,
    onState: (state) => states.push({ at: clock.nowMs, ...state })
  });

  const page = {
    controller,
    clock,
    posted,
    states,
    get handler() {
      return handler;
    },
    // Deliver a message as the page's own window would.
    receive(data, overrides = {}) {
      if (!handler) throw new Error('no message handler registered');
      handler({
        source: overrides.source ?? pageSource,
        origin: overrides.origin ?? ORIGIN,
        data
      });
    },
    // A bridge content script answering discovery.
    discover(extensionId, label = `LLMnesia ${extensionId.slice(0, 4)}`, overrides = {}) {
      page.receive(
        { v: PROTOCOL_VERSION, type: TYPE_DISCOVERED, requestId: overrides.requestId ?? currentDiscoverRequestId(), extensionId, label },
        overrides
      );
    },
    opens() {
      return posted.filter((entry) => entry.message.type === TYPE_OPEN);
    },
    lastState() {
      return states[states.length - 1];
    }
  };

  let discoverRound = -1;
  const currentDiscoverRequestId = () => {
    // The controller reuses one request id per hand-off attempt; the tests
    // read it back from the discover messages it posted.
    const discover = posted.filter((entry) => entry.message.type === TYPE_DISCOVER);
    if (discover.length > 0) {
      const latest = discover[discover.length - 1].message.requestId;
      if (latest !== discoverRound) discoverRound = latest;
    }
    return discoverRound;
  };

  return page;
}

// --- discovery policy ---

{
  const page = makePage({ hint: STORE_ID });
  page.controller.start();
  assert.equal(page.lastState().phase, 'searching');
  assert.equal(page.posted[0].message.type, TYPE_DISCOVER);

  // A stale hint: the store build the link names never answers, but the local
  // unpacked build does. The sole responder must win once the window closes.
  page.clock.advance(500);
  page.discover(LOCAL_ID, 'LLMnesia 0.4.9 (unpacked/dev build)');
  assert.equal(page.lastState().phase, "searching", "no premature open before the window closes");
  page.clock.advance(1500);
  assert.equal(page.lastState().phase, 'opening');
  assert.equal(page.lastState().responder.extensionId, LOCAL_ID);
  const open = page.opens()[0];
  assert.equal(open.message.targetExtensionId, LOCAL_ID);
  assert.equal(open.message.docId, 'claude_code:viewer-only');
  // The docId stays in local messages; nothing here addresses the website.
  assert.ok(!JSON.stringify(page.posted).includes('https://llmnesia.com'), 'no website-bound traffic');
}

{
  // Matching hint arrives AFTER another build: the preference wins without
  // waiting out the window, and the first responder is not raced.
  const page = makePage({ hint: STORE_ID });
  page.controller.start();
  page.clock.advance(300);
  page.discover(LOCAL_ID);
  assert.equal(page.lastState().phase, 'searching');
  page.discover(STORE_ID);
  assert.equal(page.lastState().phase, 'opening');
  assert.equal(page.lastState().responder.extensionId, STORE_ID);
  assert.equal(page.opens().length, 1);
  assert.equal(page.opens()[0].message.targetExtensionId, STORE_ID);
}

{
  // Multiple responders, no matching preference: explicit choice, user picks,
  // exactly one open goes out with a fresh request id.
  const page = makePage({});
  page.controller.start();
  page.clock.advance(1500);
  page.discover(LOCAL_ID);
  page.discover(OTHER_ID);
  page.clock.advance(700); // window closes with two responders
  const choice = page.lastState();
  assert.equal(choice.phase, 'choice');
  assert.deepEqual(choice.responders.map((responder) => responder.extensionId).sort(), [LOCAL_ID, OTHER_ID].sort());

  page.controller.choose(OTHER_ID);
  assert.equal(page.lastState().phase, 'opening');
  assert.equal(page.lastState().responder.extensionId, OTHER_ID);
  const opens = page.opens();
  assert.equal(opens.length, 1);
  assert.equal(opens[0].message.targetExtensionId, OTHER_ID);
  assert.notEqual(opens[0].message.requestId, 'handoff-request-0', 'a chosen hand-off carries a fresh request id');

  // A duplicate choose() must not post a second open.
  page.controller.choose(LOCAL_ID);
  assert.equal(page.opens().length, 1);
}

{
  // No responder at all, no hint: the page stays put with guidance.
  const page = makePage({});
  page.controller.start();
  page.clock.advance(2500);
  assert.equal(page.lastState().phase, 'unavailable');
  assert.equal(page.opens().length, 0);
  assert.ok(!page.posted.some((entry) => String(entry.message).includes('chrome-extension')));
}

{
  // No responder, legacy hint present: the controller itself stays neutral
  // (it never navigates); the page component applies resolveUnavailableState
  // above to fall back to the link's own chrome-extension URL, which covers
  // pre-handshake installs and is wrong only for a stale hint.
  const page = makePage({ hint: STORE_ID });
  page.controller.start();
  page.clock.advance(2500);
  assert.equal(page.lastState().phase, 'unavailable');
  assert.equal(page.opens().length, 0);
}

{
  // Open-ack timeout: an unresponsive build is dropped and the remaining
  // responder takes over with a fresh request id.
  const page = makePage({});
  page.controller.start();
  page.clock.advance(1500);
  page.discover(LOCAL_ID);
  page.discover(OTHER_ID);
  page.clock.advance(700); // window closes with two responders
  assert.equal(page.lastState().phase, 'choice');
  page.controller.choose(LOCAL_ID);
  const firstOpen = page.opens()[0];
  page.clock.advance(1000); // ack window lapses with no OPENING
  assert.equal(page.lastState().phase, 'opening');
  assert.equal(page.lastState().responder.extensionId, OTHER_ID);
  const opens = page.opens();
  assert.equal(opens.length, 2);
  assert.equal(opens[1].message.targetExtensionId, OTHER_ID);
  assert.notEqual(opens[1].message.requestId, firstOpen.message.requestId);
}

{
  // An OPENING acknowledgement cancels the failure timer: the page holds the
  // opening state while the extension navigates the tab.
  const page = makePage({});
  page.controller.start();
  page.clock.advance(500);
  page.discover(LOCAL_ID);
  page.clock.advance(1700); // window closes with a sole responder
  assert.equal(page.lastState().phase, 'opening');
  const open = page.opens()[0];
  page.receive({ v: PROTOCOL_VERSION, type: TYPE_OPENING, requestId: open.message.requestId });
  page.clock.advance(5000);
  assert.equal(page.lastState().phase, 'opening', 'ack stops the failover timer');
  assert.equal(page.opens().length, 1);
}

{
  // An explicit OPEN_FAILED surfaces the bounded reason and stays on the page.
  const page = makePage({});
  page.controller.start();
  page.clock.advance(500);
  page.discover(LOCAL_ID);
  page.clock.advance(1700);
  assert.equal(page.lastState().phase, 'opening');
  const open = page.opens()[0];
  page.receive({
    v: PROTOCOL_VERSION,
    type: TYPE_OPEN_FAILED,
    requestId: open.message.requestId,
    reason: 'Viewer hand-off document id is invalid'
  });
  assert.equal(page.lastState().phase, 'failed');
  assert.equal(page.lastState().reason, 'Viewer hand-off document id is invalid');
  assert.equal(page.opens().length, 1);
}

// --- malformed and unrelated messages are ignored ---

{
  const page = makePage({ hint: STORE_ID });
  page.controller.start();
  const requestId = page.posted[0].message.requestId;
  const noise = [
    { v: 2, type: TYPE_DISCOVERED, requestId, extensionId: LOCAL_ID, label: 'wrong version' },
    { v: PROTOCOL_VERSION, type: TYPE_DISCOVERED, requestId: 'short', extensionId: LOCAL_ID, label: 'bad request id' },
    { v: PROTOCOL_VERSION, type: TYPE_DISCOVERED, requestId: 'aaaaaaaaaaaaaaaa', extensionId: LOCAL_ID, label: 'unknown request id' },
    { v: PROTOCOL_VERSION, type: TYPE_DISCOVERED, requestId, extensionId: 'NOT-AN-ID', label: 'bad extension id' },
    { v: PROTOCOL_VERSION, type: 'totally:unrelated', requestId },
    { v: PROTOCOL_VERSION, type: TYPE_DISCOVERED, requestId, extensionId: LOCAL_ID, label: 'x'.repeat(500) },
    null
  ];
  for (const data of noise) {
    page.receive(data);
  }
  // Cross-origin and foreign-source messages are dropped before parsing.
  page.receive(
    { v: PROTOCOL_VERSION, type: TYPE_DISCOVERED, requestId, extensionId: LOCAL_ID, label: 'evil' },
    { origin: 'https://evil.example' }
  );
  page.receive(
    { v: PROTOCOL_VERSION, type: TYPE_DISCOVERED, requestId, extensionId: LOCAL_ID, label: 'evil' },
    { source: { fake: 'iframe' } }
  );

  assert.equal(page.lastState().phase, 'searching', 'noise never decides the hand-off');
  assert.equal(page.opens().length, 0);

  // A well-formed reply from the real bridge still works after the noise.
  page.discover(STORE_ID, 'LLMnesia 0.4.9');
  assert.equal(page.lastState().phase, 'opening');
  // The overlong label was bounded, not trusted.
  assert.equal(page.opens().length, 1);
}

{
  // Duplicate discovery replies collapse to one responder.
  const page = makePage({});
  page.controller.start();
  page.clock.advance(500);
  page.discover(LOCAL_ID, 'LLMnesia 0.4.9');
  page.discover(LOCAL_ID, 'LLMnesia 0.4.9 (again)');
  page.clock.advance(1700);
  assert.equal(page.lastState().phase, 'opening');
  assert.equal(page.lastState().responder.label, 'LLMnesia 0.4.9');
}

// --- timeout and cleanup ---

{
  const page = makePage({});
  page.controller.start();
  assert.ok(page.handler, 'listener registered on start');
  page.controller.stop();
  assert.equal(page.handler, null, 'listener removed on stop');
  const postedCount = page.posted.length;
  page.clock.advance(10000);
  assert.equal(page.posted.length, postedCount, 'no pings after stop');
  assert.equal(page.opens().length, 0);
  assert.ok(page.states.every((state) => state.phase !== 'unavailable'), 'stopped controller emits nothing');
}

{
  // Discovery pings retry through the window so late content scripts answer.
  const page = makePage({});
  page.controller.start();
  page.clock.advance(1500);
  const pings = page.posted.filter((entry) => entry.message.type === TYPE_DISCOVER);
  assert.ok(pings.length >= 5, `expected retry pings, saw ${pings.length}`);
  page.discover(LOCAL_ID);
  page.clock.advance(1000);
  assert.equal(page.lastState().phase, 'opening');
}

// --- request-id binding on open replies ---

{
  const page = makePage({});
  page.controller.start();
  page.clock.advance(500);
  page.discover(LOCAL_ID);
  page.clock.advance(1700);
  assert.equal(page.lastState().phase, 'opening');
  const open = page.opens()[0];
  // An OPENING echoing someone else's request id must not clear the timer.
  page.receive({ v: PROTOCOL_VERSION, type: TYPE_OPENING, requestId: 'unrelated-request-id-1' });
  page.clock.advance(1000);
  assert.notEqual(page.lastState().phase, 'opening', 'mismatched acks do not confirm the hand-off');
  assert.ok(page.opens().length >= 1);
  assert.ok(EXTENSION_ID_RE.test(open.message.targetExtensionId));
}

process.stdout.write('Viewer hand-off tests passed: parser plus discovery behavior.\n');
