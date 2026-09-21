import { Suspense } from 'react';
import SiteChrome from '../components/site-chrome';
import VaultAccountExperience from '../components/vault-account-experience';

export const metadata = {
  title: 'Account & billing | LLMnesia',
  description: 'View your LLMnesia Vault status and securely manage billing through Stripe.',
  robots: { index: false, follow: false }
};

export default function AccountPage() {
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
