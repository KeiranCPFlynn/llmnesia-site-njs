'use client';

import { useSearchParams } from 'next/navigation';
import VaultPurchase from './vault-purchase';

function AccountManagement() {
  return (
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
  );
}

function CheckoutSuccess() {
  return (
    <section className="section vault-account-success" aria-labelledby="vault-success-title">
      <div className="container vault-account-success-shell">
        <header className="vault-account-success-header">
          <span className="vault-account-success-mark" aria-hidden="true">✓</span>
          <p className="section-eyebrow">Payment successful</p>
          <h1 id="vault-success-title">You’re subscribed to Vault.</h1>
          <p>
            Your payment went through. One short setup in the LLMnesia extension will switch on
            encrypted sync and backup for this device.
          </p>
        </header>

        <div className="vault-account-success-grid">
          <section className="vault-account-next" aria-labelledby="vault-next-title">
            <p className="section-eyebrow">What to do next</p>
            <h2 id="vault-next-title">Finish setup in LLMnesia</h2>
            <ol className="vault-account-steps">
              <li>
                <span aria-hidden="true">1</span>
                <div>
                  <strong>Confirm your Vault account</strong>
                  <p>If asked, sign in here with the same email you used at checkout.</p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">2</span>
                <div>
                  <strong>Return to LLMnesia Settings</strong>
                  <p>Find Vault and click “I’ve subscribed, check again”.</p>
                </div>
              </li>
              <li>
                <span aria-hidden="true">3</span>
                <div>
                  <strong>Create or unlock your private Vault</strong>
                  <p>Your passphrase stays on your device and is never shared with LLMnesia.</p>
                </div>
              </li>
            </ol>
            <p className="vault-account-done">
              You’re finished when Settings says “Vault subscription active”. You can close this
              tab then.
            </p>
          </section>

          <aside className="vault-price-card vault-account-status-card" aria-label="Vault account status and billing">
            <p className="vault-price-badge">Your Vault account</p>
            <VaultPurchase accountOnly />
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function VaultAccountExperience() {
  const searchParams = useSearchParams();
  return searchParams.get('checkout') === 'success' ? <CheckoutSuccess /> : <AccountManagement />;
}
