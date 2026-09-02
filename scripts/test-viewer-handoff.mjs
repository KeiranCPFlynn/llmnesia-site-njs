import assert from 'node:assert/strict';
import { viewerUrlFromHash } from '../app/open/viewer-link.js';

const extensionId = 'leekfgbdojiaabifbjbbgiiclannjdkf';

assert.equal(
  viewerUrlFromHash(`#docId=claude_code%3Aabc-123&extensionId=${extensionId}`),
  `chrome-extension://${extensionId}/viewer.html?docId=claude_code%3Aabc-123`
);
assert.equal(viewerUrlFromHash('#docId=claude%3Aabc'), null);
assert.equal(viewerUrlFromHash('#docId=claude%3Aabc&extensionId=not-an-extension'), null);
assert.equal(
  viewerUrlFromHash(`#docId=${'a'.repeat(513)}&extensionId=${extensionId}`),
  null
);
assert.equal(
  viewerUrlFromHash(`#docId=claude%3Aabc%0Adef&extensionId=${extensionId}`),
  null
);

process.stdout.write('Viewer hand-off parser checks passed.\n');
