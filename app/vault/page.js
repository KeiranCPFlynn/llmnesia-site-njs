import SiteChrome from '../components/site-chrome';
import VaultPageView from '../components/vault-page-view';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

const MONTHLY_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_MONTHLY_PRICE_LABEL || '£8';
const ANNUAL_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL || '£88';
const ANNUAL_MONTHLY_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL || '£7.33';

export const metadata = buildPageMetadata({
  title: 'LLMnesia Vault | Encrypted sync and backup for your AI chat history',
  description:
    'LLMnesia Vault is available now. Keep one end-to-end encrypted AI chat archive across your browsers and computers, with backup and an installable web app beta.',
  canonicalPath: '/vault'
});

const UNLOCKS = [
  {
    kicker: 'Every profile',
    title: 'One archive across your devices',
    body: 'Bring the history indexed in your work profile, personal profile, desktop and laptop into the same encrypted archive instead of leaving it split between machines.'
  },
  {
    kicker: 'Web app beta',
    title: 'Your archive on phone and desktop',
    body: 'Install the Vault web app or open it in a browser to search and read your synced history. Optional Face ID or fingerprint unlock makes returning quicker.'
  },
  {
    kicker: 'Encrypted backup',
    title: 'Protected when a device disappears',
    body: 'Your archive is encrypted on your device before upload with a key LLMnesia never receives. If a laptop fails, Vault can restore the history you synced.'
  }
];

const USE_CASES = [
  {
    kicker: 'Keep every machine current',
    body: 'History captured in a work profile, personal profile, laptop or desktop becomes available in the same encrypted archive.'
  },
  {
    kicker: 'Search and read on your phone',
    body: 'Open vault.llmnesia.com when the computer that captured a conversation is not with you. The web app can be installed to your home screen.'
  },
  {
    kicker: 'Sync and recover',
    body: 'Keep connected browser profiles up to date and restore your encrypted archive after a lost machine or browser profile.'
  }
];

const FAQS = [
  {
    q: 'How is Vault different from free LLMnesia?',
    a: 'Free LLMnesia captures and searches AI chats locally in each browser profile. Vault is the optional paid service that syncs those archives across your browsers and computers, keeps an encrypted backup, and powers the Vault web app. You do not need Vault for local capture or search.'
  },
  {
    q: 'What is the Vault web app?',
    a: 'It is an installable subscriber beta at vault.llmnesia.com for searching and reading your synced archive on phone or desktop. You create and connect your first Vault in the browser extension, then unlock that existing Vault in the web app.'
  },
  {
    q: 'What is Ask Vault?',
    a: 'Ask Vault is a feature inside the Vault web app beta. It answers questions across your synced history using your chosen AI provider and your own API key. Its answers are grounded in your conversations and link back to the sources they used.'
  },
  {
    q: 'Which AI platforms does it cover?',
    a: 'Everything LLMnesia already supports, including ChatGPT, Claude, Gemini, Perplexity, Microsoft Copilot, DeepSeek, Grok, Mistral, Kimi and Qwen, brought together into one place. We add platforms regularly, so the extension is the best guide to the current list.'
  },
  {
    q: 'Is syncing the opposite of local-first?',
    a: 'No. Your local index and search still live on your device. Vault adds an encrypted copy that your own devices can share. Encryption happens before upload and LLMnesia never receives the key needed to read your archive.'
  },
  {
    q: 'Do I need Vault to use MCP?',
    a: 'No. MCP is a separate free feature for compatible desktop AI apps and works with the local archive on that computer. Vault provides encrypted sync, backup, restore and the Vault web app.'
  },
  {
    q: 'How do I subscribe?',
    a: 'Open the pricing page, sign in with the same email as your Vault account, and continue to secure Stripe Checkout. Stripe activates sync automatically after payment.'
  }
];

export default function VaultPage() {
  return (
    <SiteChrome>
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <VaultPageView />
      <main id="main-content" className="vault-page">
        <section className="section vault-hero">
          <div className="container vault-hero-inner">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Available now · LLMnesia Vault
            </p>
            <h1>
              Your AI chat history.<br />
              <span className="text-gradient">Together, protected and useful.</span>
            </h1>
            <p className="subheadline vault-hero-sub">
              Vault syncs and backs up the conversations LLMnesia captures across your browsers
              and computers. Open the installable Vault web app on phone or desktop to search and
              read your whole archive.
            </p>
            <div className="vault-hero-actions">
              <a className="button button-large" href="/pricing#vault-purchase">Subscribe to Vault</a>
              <a className="vault-hero-secondary" href="https://vault.llmnesia.com">Open the Vault web app &rarr;</a>
            </div>
            <p className="vault-hero-note">
              {ANNUAL_PRICE_LABEL}/year or {MONTHLY_PRICE_LABEL}/month · web app currently in subscriber beta
            </p>
          </div>
        </section>

        <section className="section vault-spotlight">
          <div className="container vault-spotlight-inner">
            <div className="vault-spotlight-copy">
              <p className="section-eyebrow">Vault web app beta</p>
              <h2>Your synced history, on any screen.</h2>
              <p className="section-intro">
                Vault brings the separate archives from your browsers and computers together in
                one place. The web app lets you open that same encrypted history on your phone or
                desktop to search and read the conversations you need.
              </p>
              <p className="section-intro">
                It is an installable subscriber beta, not a separate archive. Create and connect
                Vault in the extension first, then unlock the same Vault in the web app.
              </p>
              <div className="vault-ask-callout">
                <p className="vault-ask-kicker">Also in the web app beta</p>
                <h3>Ask Vault</h3>
                <p>
                  Think of it as the mobile, built-in counterpart to MCP. Ask a question across
                  your synced history and get an answer grounded in your conversations, with links
                  back to the exact sources it used. It uses your chosen AI provider and your own
                  API key.
                </p>
              </div>
            </div>
            <figure className="vault-mock" aria-label="LLMnesia Vault web app showing a fictional search result">
              <div className="vault-pwa-head">
                <strong>LLMnesia Vault</strong>
                <span className="vault-pwa-beta">Beta</span>
                <span className="vault-pwa-settings">Settings</span>
              </div>
              <div className="vault-pwa-tabs" aria-hidden="true">
                <span className="is-active">Search</span>
                <span>Ask</span>
              </div>
              <div className="vault-mock-body">
                <div className="vault-pwa-intro">
                  <h3>Search your archive.</h3>
                  <p>Every connected device, one encrypted history.</p>
                </div>
                <div className="vault-pwa-search">garden plan for spring</div>
                <div className="vault-pwa-results">
                  <div><span>Claude</span><p>Raised-bed garden layout</p><small>Start with two small beds and herbs near the kitchen.</small></div>
                  <div><span>ChatGPT</span><p>Easy herbs to grow</p><small>Basil, mint and rosemary suit a sunny spot.</small></div>
                </div>
                <figcaption className="vault-mock-caption">Illustrative sample only. No customer or personal data.</figcaption>
              </div>
            </figure>
          </div>
        </section>

        <section className="section vault-benefits" id="what-vault-unlocks">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">What Vault includes</p>
              <h2>A synced archive you can search and read anywhere.</h2>
            </div>
            <div className="card-grid vault-benefit-grid">
              {UNLOCKS.map((item) => (
                <article className="card vault-benefit-card" key={item.title}>
                  <p className="vault-benefit-kicker">{item.kicker}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section vault-usecases">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">What you can do</p>
              <h2>Keep the same archive wherever you work.</h2>
            </div>
            <div className="vault-usecase-list">
              {USE_CASES.map((item, index) => (
                <div className="vault-usecase" key={item.kicker}>
                  <span className="vault-usecase-num">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{item.kicker}</h3><p>{item.body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section vault-pricing">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow">Pricing</p>
              <h2>Vault is available now.</h2>
              <p className="section-intro">
                Vault is {ANNUAL_PRICE_LABEL} a year, which works out at {ANNUAL_MONTHLY_LABEL} a
                month and includes one month free against paying monthly. Or choose {MONTHLY_PRICE_LABEL} a
                month. Plus applicable tax.
              </p>
              <ul className="vault-pricing-points">
                <li>Encrypted sync and backup across your connected browsers and computers</li>
                <li>Installable Vault web app beta for phone and desktop</li>
                <li>Search and transcript reading from the Vault web app beta</li>
                <li>Ask Vault answers grounded in your history, with source conversations attached</li>
                <li>Cancel any time; device copies stay searchable while sync and restore pause</li>
              </ul>
            </div>
            <aside className="vault-price-card" aria-label="Vault pricing">
              <p className="vault-price-badge">Vault</p>
              <p className="vault-price-figure">
                <span className="vault-price-now">{ANNUAL_MONTHLY_LABEL}</span>
                <span className="vault-price-period">/month</span>
              </p>
              <p className="vault-price-sub">
                Billed annually at {ANNUAL_PRICE_LABEL}, including one month free. Or{' '}
                {MONTHLY_PRICE_LABEL} billed monthly. Plus applicable tax.
              </p>
              <a className="button button-large" href="/pricing#vault-purchase">Subscribe securely</a>
            </aside>
          </div>
        </section>

        <section className="section vault-faq">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">Questions</p>
              <h2>The details, answered.</h2>
            </div>
            <div className="faq-list vault-faq-list">
              {FAQS.map((item) => (
                <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="section vault-closing">
          <div className="container vault-closing-inner">
            <h2>Bring your whole AI history with you.</h2>
            <p className="section-intro">
              Subscribe with the same email as your Vault account, connect the extension, then
              open vault.llmnesia.com to search and read from anywhere.
            </p>
            <div className="vault-hero-actions">
              <a className="button button-large" href="/pricing#vault-purchase">Choose Vault</a>
              <a className="vault-hero-secondary" href="https://vault.llmnesia.com">Open the web app &rarr;</a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
