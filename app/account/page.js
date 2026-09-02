import { notFound } from 'next/navigation';
import SiteChrome from '../components/site-chrome';
import VaultPurchase from '../components/vault-purchase';

// This route is included in the Vercel-authenticated live-billing acceptance
// branch so the real customer-management flow can be tested before launch.
// Do not merge the acceptance bypass into main.
const PROTECTED_ACCEPTANCE_PREVIEW = true;

// Account management is available alongside Checkout. Keeping the same gate
// means the extension never links customers to a public billing screen before
// Vault is ready to be sold.
const ACCOUNT_PUBLIC =
  process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true' &&
  process.env.NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true';

export const metadata = ACCOUNT_PUBLIC || PROTECTED_ACCEPTANCE_PREVIEW
  ? {
      title: 'Account & billing — LLMnesia',
      description: 'View your LLMnesia Vault status and securely manage billing through Stripe.',
      robots: { index: false, follow: false }
    }
  : { title: 'Not found', robots: { index: false, follow: false } };

export default function AccountPage() {
  if (!ACCOUNT_PUBLIC && !PROTECTED_ACCEPTANCE_PREVIEW) notFound();

  return (
    <SiteChrome>
      <main id="main-content" className="pricing-page">
        <section className="section vault-pricing">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow">Vault account</p>
              <h1>Manage your Vault subscription.</h1>
              <p className="section-intro">
                View whether Vault is active, then securely manage your payment details, invoices,
                or cancellation through Stripe.
              </p>
              <p className="vault-reassure">
                Sign in with the same email address you use in the LLMnesia extension.
              </p>
            </div>
            <aside className="vault-price-card" aria-label="Vault account and billing">
              <p className="vault-price-badge">Account &amp; billing</p>
              <VaultPurchase accountOnly />
            </aside>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
