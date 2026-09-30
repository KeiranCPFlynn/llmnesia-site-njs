import assert from 'node:assert/strict';
import { legacyViewerUrl, parseHandoffHash } from '../app/open/viewer-link.js';

const extensionId = 'leekfgbdojiaabifbjbbgiiclannjdkf';

// Parser bounds mirror the extension's isValidDocId (extension repo,
// extension/src/shared/viewer_handoff.ts): trimmed, 1..512 chars, no controls.
// The extensionId is a hint now; links without one stay usable via discovery.
assert.deepEqual(
  parseHandoffHash(`#docId=claude_code%3Aabc-123&extensionId=${extensionId}`),
  { docId: 'claude_code:abc-123', extensionId }
);
assert.deepEqual(parseHandoffHash('#docId=claude%3Aabc'), {
  docId: 'claude:abc',
  extensionId: ''
});
assert.deepEqual(parseHandoffHash('#docId=%20claude%3Aabc%20'), {
  docId: 'claude:abc',
  extensionId: ''
});
assert.equal(
  parseHandoffHash('#docId=claude%3Aabc&extensionId=not-an-extension').extensionId,
  ''
);
assert.equal(parseHandoffHash(`#docId=${'a'.repeat(513)}&extensionId=${extensionId}`), null);
assert.equal(parseHandoffHash('#docId=claude%3Aabc%0Adef'), null);
assert.equal(parseHandoffHash(''), null);
assert.equal(parseHandoffHash('#extensionId=leekfgbdojiaabifbjbbgiiclannjdkf'), null);

// Legacy redirect used when no bridge answers discovery.
assert.equal(
  legacyViewerUrl(extensionId, 'claude_code:abc-123'),
  `chrome-extension://${extensionId}/viewer.html?docId=claude_code%3Aabc-123`
);

process.stdout.write('Viewer hand-off parser checks passed.\n');
