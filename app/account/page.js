import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import SiteChrome from '../components/site-chrome';
import VaultAccountExperience from '../components/vault-account-experience';

// Account management is available alongside Checkout. Keeping the same gate
// means the extension never links customers to a public billing screen before
// Vault is ready to be sold.
const ACCOUNT_PUBLIC =
  process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true' &&
  process.env.NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true';

export const metadata = ACCOUNT_PUBLIC
  ? {
      title: 'Account & billing — LLMnesia',
      description: 'View your LLMnesia Vault status and securely manage billing through Stripe.',
      robots: { index: false, follow: false }
    }
  : { title: 'Not found', robots: { index: false, follow: false } };

export default function AccountPage() {
  if (!ACCOUNT_PUBLIC) notFound();

  return (
    <SiteChrome>
      <main id="main-content" className="pricing-page">
        <Suspense fallback={<p className="vault-account-loading">Loading your Vault account…</p>}>
          <VaultAccountExperience />
        </Suspense>
      </main>
    </SiteChrome>
  );
}
