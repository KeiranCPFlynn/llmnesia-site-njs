import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeVaultCode, normalizeVaultEmail, vaultAuthMessage } from '../lib/vault-sign-in.js';

test('pasted email and eight-digit code normalize without changing their content', () => {
  assert.equal(normalizeVaultEmail(' Owner@Example.com '), 'owner@example.com');
  assert.equal(normalizeVaultCode(' 1234 5678\n'), '12345678');
});

test('rate limits explain waiting and preserve the existing code as a recovery option', () => {
  for (const error of [{ code: 'over_email_send_rate_limit' }, { code: 'over_request_rate_limit' }, { status: 429 }]) {
    assert.match(vaultAuthMessage(error), /Wait a few minutes/);
    assert.match(vaultAuthMessage(error), /most recent one/);
  }
});

test('unknown account management requests point new users to account creation', () => {
  assert.match(vaultAuthMessage({ code: 'otp_disabled' }), /existing Vault account/);
  assert.match(vaultAuthMessage({ code: 'otp_disabled' }), /pricing page/);
});

test('expired code and network verification failures have different recovery instructions', () => {
  assert.match(vaultAuthMessage({ code: 'otp_expired' }, 'verify'), /request a new one/);
  const offline = vaultAuthMessage(new TypeError('private diagnostic'), 'verify');
  assert.match(offline, /do not need to request another code/);
  assert.doesNotMatch(offline, /private diagnostic|did not work/);
});

test('provider details never reach customer-facing messages', () => {
  assert.doesNotMatch(vaultAuthMessage({ message: 'private details' }), /private details/);
  assert.match(vaultAuthMessage({ code: 'email_address_invalid' }), /typo/);
});
