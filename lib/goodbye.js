// The extension's uninstall page (/goodbye). The extension sends only its
// version and a coarse install-age bucket in the query string; everything read
// from the URL is validated here before it can reach an analytics event.

export const GOODBYE_REASONS = [
  { id: 'not_useful', label: "It wasn't useful to me" },
  { id: 'no_capture', label: "It didn't pick up my chats on the AI sites I use" },
  { id: 'slowed_browser', label: 'It slowed down my browser' },
  { id: 'privacy_worry', label: 'I had a privacy worry' },
  { id: 'didnt_understand', label: "I didn't understand how it worked" },
  { id: 'switched_tools', label: 'I switched to another tool' },
  { id: 'something_else', label: 'Something else' }
];

const REASON_IDS = new Set(GOODBYE_REASONS.map((reason) => reason.id));
const INSTALL_AGE_BUCKETS = new Set(['d0', 'd1_2', 'd3_6', 'd7_13', 'd14_29', 'd30_plus', 'unknown']);
const VERSION_PATTERN = /^\d{1,4}(\.\d{1,4}){0,3}$/;

export const GOODBYE_COMMENT_MAX_LENGTH = 500;

export function parseGoodbyeParams(search) {
  const params = new URLSearchParams(typeof search === 'string' ? search : '');
  const version = params.get('v') || '';
  const age = params.get('d') || '';
  return {
    extension_version: VERSION_PATTERN.test(version) ? version : 'unknown',
    install_age: INSTALL_AGE_BUCKETS.has(age) ? age : 'unknown'
  };
}

export function isGoodbyeReason(value) {
  return typeof value === 'string' && REASON_IDS.has(value);
}

export function cleanGoodbyeComment(value) {
  return typeof value === 'string' ? value.trim().slice(0, GOODBYE_COMMENT_MAX_LENGTH) : '';
}
