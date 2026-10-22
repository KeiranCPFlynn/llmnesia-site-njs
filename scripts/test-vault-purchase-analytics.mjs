import assert from 'node:assert/strict';
import { test, afterEach } from 'node:test';
import { trackVaultCheckout, trackVaultPurchaseReturn } from '../lib/vault-purchase-analytics.js';

const KEY = 'llmnesia:pending-vault-checkout:v1';
function browser({ hostname = 'www.llmnesia.com', storage = new Map() } = {}) {
  const events = new EventTarget();
  const ga = [], posthog = [], timers = new Map();
  globalThis.window = {
    location: { hostname, pathname: '/vault' }, navigator: { language: 'en-GB' },
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    gtag: (...args) => ga.push(args), posthog: { capture: (...args) => posthog.push(args) },
    setTimeout: fn => { const id = timers.size + 1; timers.set(id, fn); return id; },
    clearTimeout: id => timers.delete(id),
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events)
  };
  return { ga, posthog, storage, timers, window: globalThis.window };
}
const checkout = { plan: 'monthly', source: 'payoff', userId: 'synthetic-account' };
const success = { checkoutReturn: 'success', entitled: true, userId: checkout.userId };
afterEach(() => { delete globalThis.window; });

test('checkout records only safe dimensions and sends before navigation without identifiers', () => {
  const b = browser();
  trackVaultCheckout(checkout);
  assert.equal(b.ga[0][1], 'vault_checkout_started');
  assert.equal(b.ga[0][2].transport_type, 'beacon');
  assert.equal(b.posthog[0][0], 'vault_checkout_started');
  assert.deepEqual(b.posthog[0][2], { transport: 'sendBeacon', send_instantly: true });
  assert.equal(b.posthog[0][1].plan, 'monthly');
  assert.equal(b.posthog[0][1].checkout_source, 'payoff');
  assert.doesNotMatch(JSON.stringify([b.ga, b.posthog]), /synthetic-account|userId|email|requestId/);
});

test('verified return keeps the selected plan/source across /account and counts once across reloads', () => {
  const first = browser();
  trackVaultCheckout(checkout);
  const returning = browser({ storage: first.storage });
  returning.window.location.pathname = '/account';
  trackVaultPurchaseReturn(success);
  trackVaultPurchaseReturn(success);
  assert.equal(returning.ga.length, 1);
  assert.equal(returning.ga[0][1], 'vault_purchase_completed');
  assert.equal(returning.posthog.length, 1);
  assert.equal(returning.posthog[0][1].checkout_source, 'payoff');
  assert.equal(returning.posthog[0][1].plan, 'monthly');
  assert.equal(returning.posthog[0][1].page_path, '/account');
  assert.equal(returning.posthog[0][1].verification, 'entitled_return');
  const reloaded = browser({ storage: first.storage });
  trackVaultPurchaseReturn(success);
  assert.equal(reloaded.ga.length, 0);
});

test('query text, existing subscribers, polling and a different account do not count a purchase', () => {
  const b = browser();
  trackVaultPurchaseReturn(success); // No checkout on this tab.
  trackVaultCheckout(checkout);
  for (const state of [
    { ...success, entitled: false }, { ...success, entitled: null },
    { ...success, checkoutReturn: '' }, { ...success, userId: 'another-account' }
  ]) trackVaultPurchaseReturn(state);
  assert.deepEqual(b.ga.map(e => e[1]), ['vault_checkout_started']);
  trackVaultPurchaseReturn(success); // A later entitlement poll succeeds.
  assert.equal(b.ga.length, 2);
});

test('cancellation and expired/corrupt records cannot become completed purchases', () => {
  for (const pending of [
    '{', 'null', JSON.stringify({ userId: checkout.userId }),
    JSON.stringify({ userId: checkout.userId, createdAt: Date.now() - 25 * 60 * 60 * 1000 }),
    JSON.stringify({ userId: checkout.userId, createdAt: Date.now() + 100000 })
  ]) {
    const b = browser({ storage: new Map([[KEY, pending]]) });
    trackVaultPurchaseReturn(success);
    assert.equal(b.ga.length, 0);
  }
  const b = browser();
  trackVaultCheckout(checkout);
  trackVaultPurchaseReturn({ ...success, checkoutReturn: 'cancelled' });
  trackVaultPurchaseReturn(success);
  assert.equal(b.ga.length, 1);
  assert.equal(b.storage.has(KEY), false);
});

test('raw source values are never forwarded, including values read back from storage', () => {
  const b = browser();
  trackVaultCheckout({ ...checkout, source: 'person@example.com' });
  const stored = JSON.parse(b.storage.get(KEY));
  stored.properties.checkout_source = 'arbitrary-private-text';
  b.storage.set(KEY, JSON.stringify(stored));
  trackVaultPurchaseReturn(success);
  assert.deepEqual(b.posthog.map(e => e[1].checkout_source), ['unknown', 'unknown']);
  assert.doesNotMatch(JSON.stringify([b.ga, b.posthog]), /person@example|arbitrary-private/);
});

test('blocked storage and throwing analytics never interrupt the billing path', () => {
  const b = browser();
  b.window.sessionStorage = { getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } };
  b.window.gtag = () => { throw new Error('blocked'); };
  assert.doesNotThrow(() => trackVaultCheckout(checkout));
  assert.equal(b.posthog.length, 1, 'GA failure does not prevent PostHog delivery');
  b.window.posthog.capture = () => { throw new Error('blocked'); };
  assert.doesNotThrow(() => trackVaultCheckout(checkout));
  assert.doesNotThrow(() => trackVaultPurchaseReturn(success));
});

test('delayed SDKs each get one completion despite repeated ready events and entitlement polls', () => {
  const b = browser();
  trackVaultCheckout(checkout);
  delete b.window.gtag;
  delete b.window.posthog;
  trackVaultPurchaseReturn(success);
  trackVaultPurchaseReturn(success);
  b.window.gtag = (...args) => b.ga.push(args);
  b.window.dispatchEvent(new Event('ga:ready'));
  b.window.dispatchEvent(new Event('ga:ready'));
  b.window.posthog = { capture: (...args) => b.posthog.push(args) };
  b.window.dispatchEvent(new Event('posthog:ready'));
  b.window.dispatchEvent(new Event('posthog:ready'));
  assert.deepEqual(b.ga.map(e => e[1]), ['vault_checkout_started', 'vault_purchase_completed']);
  assert.deepEqual(b.posthog.map(e => e[0]), ['vault_checkout_started', 'vault_purchase_completed']);
  assert.equal(b.timers.size, 0);
});

test('late SDK listeners are bounded and stop when the return page closes', () => {
  const b = browser();
  trackVaultCheckout(checkout);
  delete b.window.gtag;
  delete b.window.posthog;
  trackVaultPurchaseReturn(success);
  b.window.dispatchEvent(new Event('pagehide'));
  b.window.gtag = (...args) => b.ga.push(args);
  b.window.dispatchEvent(new Event('ga:ready'));
  assert.equal(b.ga.length, 1);
  assert.equal(b.timers.size, 0);
});

test('local and preview checkouts never send production analytics', () => {
  for (const hostname of ['localhost', '127.0.0.1', 'preview.vercel.app']) {
    const b = browser({ hostname });
    trackVaultCheckout(checkout);
    trackVaultPurchaseReturn(success);
    assert.equal(b.ga.length, 0);
    assert.equal(b.posthog.length, 0);
  }
});
