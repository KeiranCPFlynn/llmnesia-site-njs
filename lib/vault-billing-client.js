import { createClient } from '@supabase/supabase-js';

let client = null;

export function getVaultBillingClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_VAULT_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_VAULT_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey) throw new Error('billing_not_configured');

  client = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
  return client;
}

export async function vaultFunctionError(error, fallback) {
  try {
    const body = await error?.context?.json();
    if (typeof body?.error === 'string') return body.error;
  } catch {
    // A network/runtime failure has no structured function response.
  }
  return fallback;
}

export function billingMessage(code) {
  const messages = {
    subscription_already_exists: 'This account already has a Vault subscription. Use Manage billing instead.',
    founding_offer_full: 'This introductory offer is no longer available. We have not charged you.',
    billing_account_not_found: 'No billing account exists for this sign-in yet.',
    checkout_unavailable: 'Checkout is temporarily unavailable. Please try again.',
    portal_unavailable: 'Billing management is temporarily unavailable. Please try again.'
  };
  return messages[code] || 'Something went wrong. Please try again.';
}
