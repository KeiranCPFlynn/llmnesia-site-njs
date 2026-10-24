import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  GOODBYE_COMMENT_MAX_LENGTH,
  GOODBYE_REASONS,
  cleanGoodbyeComment,
  isGoodbyeReason,
  parseGoodbyeParams
} from '../lib/goodbye.js';

test('version and install age come through only in their expected shapes', () => {
  assert.deepEqual(parseGoodbyeParams('?v=0.4.20&d=d7_13'), { extension_version: '0.4.20', install_age: 'd7_13' });
  assert.deepEqual(parseGoodbyeParams('?v=1.0&d=d30_plus'), { extension_version: '1.0', install_age: 'd30_plus' });
});

test('anything unexpected in the URL becomes unknown and never reaches an event', () => {
  const parsed = parseGoodbyeParams('?v=1.0%26email%3Da%40b.co&d=today&install_id=abc&email=a%40b.co');
  assert.deepEqual(parsed, { extension_version: 'unknown', install_age: 'unknown' });
  assert.deepEqual(Object.keys(parsed).sort(), ['extension_version', 'install_age']);
  assert.deepEqual(parseGoodbyeParams(undefined), { extension_version: 'unknown', install_age: 'unknown' });
});

test('there are seven one-tap reasons with stable ids and no em dashes in the copy', () => {
  assert.deepEqual(GOODBYE_REASONS.map((r) => r.id), [
    'not_useful', 'no_capture', 'slowed_browser', 'privacy_worry', 'didnt_understand', 'switched_tools',
    'something_else'
  ]);
  for (const reason of GOODBYE_REASONS) {
    assert.equal(isGoodbyeReason(reason.id), true);
    assert.equal(reason.label.includes(String.fromCharCode(0x2014)), false);
  }
  assert.equal(isGoodbyeReason('please_reinstall'), false);
  assert.equal(isGoodbyeReason(undefined), false);
});

test('the optional note is trimmed and capped', () => {
  assert.equal(cleanGoodbyeComment('  too slow  '), 'too slow');
  assert.equal(cleanGoodbyeComment('x'.repeat(GOODBYE_COMMENT_MAX_LENGTH + 50)).length, GOODBYE_COMMENT_MAX_LENGTH);
  assert.equal(cleanGoodbyeComment(null), '');
});
