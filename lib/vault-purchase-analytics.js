import { trackEvent } from './analytics.js';

const PENDING_CHECKOUT_KEY = 'llmnesia:pending-vault-checkout:v1';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function checkoutProperties(plan, source) {
  return {
    surface: 'website_purchase',
    plan: plan === 'monthly' ? 'monthly' : 'annual',
    // Match the server's source allowlist. Never forward arbitrary query text.
    checkout_source: source === 'payoff' ? 'payoff' : 'unknown'
  };
}

export function clearVaultCheckout() {
  try {
    window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
  } catch {
    // Storage may be disabled; billing must continue to work.
  }
}

// Called only after the checkout function supplies a Stripe URL. The account
// binding stays in this tab's storage and is never sent to either provider.
export function trackVaultCheckout({ plan, source, userId }) {
  const properties = checkoutProperties(plan, source);
  try {
    window.sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify({
      properties, userId, createdAt: Date.now()
    }));
  } catch {
    // Without storage the return is deliberately unmeasured, not a false sale.
  }
  trackEvent('vault_checkout_started', properties, { beforeNavigation: true });
}

export function trackVaultPurchaseReturn({ checkoutReturn, entitled, userId }) {
  if (checkoutReturn === 'cancelled') {
    clearVaultCheckout();
    return;
  }
  if (checkoutReturn !== 'success' || entitled !== true || !userId) return;

  let pending;
  try {
    pending = JSON.parse(window.sessionStorage.getItem(PENDING_CHECKOUT_KEY));
    if (!pending || pending.userId !== userId) return;
    const age = Date.now() - pending.createdAt;
    if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_MS) {
      clearVaultCheckout();
      return;
    }
    // Consume synchronously before dispatch: polling, refreshes and React's
    // repeated effects must never count the same return twice.
    window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
  } catch {
    return;
  }
  trackEvent('vault_purchase_completed', {
    ...checkoutProperties(pending.properties?.plan, pending.properties?.checkout_source),
    verification: 'entitled_return'
  }, { waitForReady: true });
}
