import SiteChrome from '../components/site-chrome';
import VaultWaitlistForm from '../components/vault-waitlist-form';
import VaultPageView from '../components/vault-page-view';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true';

// Same gate as app/pricing/page.js, which 404s the whole route unless this is
// set. Vault is not launched, so no price figure belongs on a public page yet:
// this section used to render its numbers unconditionally, which both put
// pricing live before launch and made the page contradict itself, quoting a
// live Vault pricing directly beneath "Coming soon". The approved
// pricing copy below is unchanged and simply waits for the flag. Turn it on in
// the same deploy that opens Checkout, not before.
const PRICING_PUBLIC = process.env.NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true';
const PURCHASE_PUBLIC = CHECKOUT_ENABLED && PRICING_PUBLIC;

// Kept in step with app/pricing/page.js. Annual is one month free against
// monthly, so STRIPE_VAULT_ANNUAL_PRICE_ID must point at an £88 Price.
const MONTHLY_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_MONTHLY_PRICE_LABEL || '£8';
const ANNUAL_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL || '£88';
const ANNUAL_MONTHLY_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL || '£7.33';

export const metadata = buildPageMetadata({
  title: 'LLMnesia Vault — One Memory Across Every AI Tool',
  description: PURCHASE_PUBLIC
    ? 'Vault securely syncs and backs up your AI chat history across your supported desktop devices. The free local search and MCP features remain free.'
    : 'Coming soon. Vault securely syncs and backs up your AI chat history across every browser and machine you use. Mobile access is in development. Vault can make the free, local MCP feature even more useful by bringing more of your history together.',
  canonicalPath: '/vault'
});

// Reframed as feature blocks that sell the possibilities, not just storage.
const UNLOCKS = [
  {
    kicker: 'Every platform',
    title: 'One library, every AI',
    body: 'ChatGPT, Claude, Gemini, Perplexity, Grok, Copilot, DeepSeek and the other platforms LLMnesia supports, all in a single searchable memory instead of walled gardens you have to check one by one.'
  },
  {
    kicker: 'In development',
    title: 'Mobile access',
    body: 'A mobile version of Vault is being built and is included in the subscription when it lands. Vault begins with secure sync and backup across every browser and machine you use.'
  },
  {
    kicker: 'Backup included',
    title: 'Nothing ever lost',
    body: 'Platforms quietly delete old chats. Laptops die. Vault keeps an encrypted backup of everything you’ve indexed, so months of thinking never just disappear.'
  },
  {
    kicker: 'Zero knowledge',
    title: 'Encrypted end to end',
    body: 'Sealed on your device before it ever syncs. The key never leaves your hands. We can’t read your conversations, and neither can anyone else.'
  }
];

const USE_CASES = [
  {
    kicker: 'Pick up any thread',
    body: 'Start a problem in ChatGPT on one desktop, continue it in Claude on another. One continuous memory instead of a dozen dead-ended tabs.'
  },
  {
    kicker: 'Stop re-explaining yourself',
    body: 'Point your AI at your own history instead of re-pasting the same context every session. It already knows what you’ve decided, tried, and ruled out.'
  },
  {
    kicker: 'Build on your best thinking',
    body: 'Months of research, drafts and decisions become a knowledge base you can actually query, not scattered chats you’ll never find again.'
  }
];

const FAQS = [
  {
    q: 'What does “chat with your history” actually mean?',
    a: 'MCP is a separate, free feature that lets desktop AI tools use the conversations in your local LLMnesia archive. Vault is not required. If you choose Vault, its encrypted sync can bring more of your history together across supported desktops, making MCP more useful. Search still runs on your desktop, where your key lives and your archive can be decrypted.'
  },
  {
    q: 'Which platforms does it cover?',
    a: 'Everything LLMnesia already supports, including ChatGPT, Claude, Gemini, Perplexity, Microsoft Copilot, DeepSeek, Grok, Mistral, Kimi and Qwen, brought together into one place. We add platforms regularly, so the extension is the best guide to the current list.'
  },
  {
    q: 'Will it work on mobile?',
    a: 'A mobile version is in development and is included in the subscription when it lands. Vault begins with sync and backup across every browser and machine you use, while MCP remains desktop-only because it runs locally on your desktop.'
  },
  {
    q: 'Isn’t syncing the opposite of local-first?',
    a: 'No. Your history still lives on your device. Vault lets your devices share an encrypted copy directly, with a key only you hold. What travels between them is an unreadable blob, so it is the same privacy promise with more reach.'
  },
  {
    q: 'Will the free version still work?',
    a: 'Always. Local search, indexing, and MCP stay free. Vault is an optional add-on for people who want encrypted sync and backup across supported devices.'
  },
  {
    q: 'How is it private if it’s in the cloud?',
    a: 'Everything is encrypted on your device with a key we never see. What we store is meaningless without it. We can’t read your conversations, and we can’t hand over what we don’t have.'
  },
  PURCHASE_PUBLIC
    ? {
        q: 'How do I subscribe?',
        a: 'Open the pricing page, sign in with the same email as your Vault account, and continue to secure Stripe Checkout. Stripe activates sync automatically after payment.'
      }
    : {
        q: 'When does it launch?',
        a: 'We’re getting Vault ready now. Join the waitlist and you’ll be first to know, before anyone else hears about it.'
      }
];

export default function VaultPage() {
  return (
    <SiteChrome>
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <VaultPageView />
      <main id="main-content" className="vault-page">
        {/* Hero */}
        <section className="section vault-hero">
          <div className="container vault-hero-inner">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {PURCHASE_PUBLIC ? 'Encrypted sync & backup · LLMnesia Vault' : 'Coming soon · LLMnesia Vault'}
            </p>
            <h1>
              All your AI chats.{' '}
              <span className="text-gradient">One memory you can actually use.</span>
            </h1>
            <p className="subheadline vault-hero-sub">
              LLMnesia already searches your chat history across every AI tool, but only inside
              the browser profile where you indexed it. Vault takes it further: one encrypted
              memory that syncs across every browser and machine you use and backs itself up
              automatically. A mobile version is in development. MCP remains a separate, free
              desktop feature, and Vault simply makes it more useful by bringing more of your
              history together.
            </p>
            {PURCHASE_PUBLIC ? (
              <>
                <div className="vault-hero-actions">
                  <a className="button button-large" href="/pricing#vault-purchase">
                    Subscribe to Vault
                  </a>
                  <a className="vault-hero-secondary" href="#what-vault-unlocks">
                    See what you get &rarr;
                  </a>
                </div>
                <p className="vault-hero-note">
                  {ANNUAL_PRICE_LABEL}/year or {MONTHLY_PRICE_LABEL}/month &middot; cancel any time
                </p>
              </>
            ) : (
              <VaultWaitlistForm context="vault_hero" />
            )}
          </div>
        </section>

        {/* Spotlight — the headline MCP feature */}
        <section className="section vault-spotlight">
          <div className="container vault-spotlight-inner">
            <div className="vault-spotlight-copy">
              <p className="section-eyebrow">A stronger local archive</p>
              <h2>Bring more of your history together.</h2>
              <p className="section-intro">
                Index in one browser, then keep your history securely available across supported
                desktop devices. MCP is a separate free feature that can use your local LLMnesia
                archive with Claude Desktop, Cursor, and other compatible tools, with no Vault required.
                Add Vault and that local archive can include the history you’ve synced from your
                other desktops.
              </p>
              <p className="section-intro">
                A mobile version of Vault is in development. Search runs locally on your desktop,
                where your key lives, so we can’t read your conversations.
              </p>
            </div>
            <div className="vault-mock" aria-hidden="true">
              <div className="vault-mock-head">
                <span className="vault-mock-dots">
                  <span className="vault-mock-dot" />
                  <span className="vault-mock-dot" />
                  <span className="vault-mock-dot" />
                </span>
                <span className="vault-mock-title">assistant · your history</span>
              </div>
              <div className="vault-mock-body">
                <div className="vault-mock-bubble vault-mock-user">
                  How did I end up fixing that flaky auth test last month?
                </div>
                <div className="vault-mock-bubble vault-mock-ai">
                  <span className="vault-mock-source">
                    Found it in 4 past chats across Claude &amp; ChatGPT
                  </span>
                  You traced it to a race condition in the token refresh. Mocking the clock
                  didn’t work. The fix was awaiting the refresh before the test’s first request.
                </div>
                <p className="vault-mock-caption">
                  MCP uses your local history on your desktop · Vault optional
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What it unlocks */}
        <section className="section vault-benefits" id="what-vault-unlocks">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">What Vault unlocks</p>
              <h2>More than a backup. Your history, finally working for you.</h2>
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

        {/* Use cases */}
        <section className="section vault-usecases">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">What you’ll do with it</p>
              <h2>The possibilities it opens up.</h2>
            </div>
            <div className="vault-usecase-list">
              {USE_CASES.map((item, index) => (
                <div className="vault-usecase" key={item.kicker}>
                  <span className="vault-usecase-num">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{item.kicker}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="section vault-pricing">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow">Pricing</p>
              <h2>One archive, not one per browser profile.</h2>
              <p className="section-intro">
                {PURCHASE_PUBLIC ? (
                  <>
                    Vault is {ANNUAL_PRICE_LABEL} a year, which works out at {ANNUAL_MONTHLY_LABEL} a
                    month and includes one month free against paying monthly. Or {MONTHLY_PRICE_LABEL} a
                    month if you would rather not commit to a year. Plus applicable tax.
                  </>
                ) : (
                  <>
                    Vault will be a paid add-on, priced when it opens. The extension, its local
                    search and the MCP connection stay free either way. Join the waitlist and we
                    will tell you the price before anyone is asked to pay.
                  </>
                )}
              </p>
              <ul className="vault-pricing-points">
                <li>
                  Encrypted history available across every browser and machine you use, not just
                  the single profile you indexed it in
                </li>
                <li>A mobile version is in development and is included when it lands</li>
                <li>Automatic, private backup of everything you&rsquo;ve indexed</li>
                <li>MCP stays free and works without a Vault subscription</li>
                <li>Cancel any time and keep everything already in your Vault</li>
              </ul>
            </div>
            <aside className="vault-price-card" aria-label="Vault pricing">
              <p className="vault-price-badge">Vault</p>
              {PURCHASE_PUBLIC ? (
                <>
                  <p className="vault-price-figure">
                    <span className="vault-price-now">{ANNUAL_MONTHLY_LABEL}</span>
                    <span className="vault-price-period">/month</span>
                  </p>
                  <p className="vault-price-sub">
                    Billed annually at {ANNUAL_PRICE_LABEL}, which includes one month free. Or{' '}
                    {MONTHLY_PRICE_LABEL} a month billed monthly. Plus applicable tax. The extension,
                    its local search and the MCP connection stay free either way.
                  </p>
                </>
              ) : (
                <>
                  <p className="vault-price-figure">
                    <span className="vault-price-now">Coming soon</span>
                  </p>
                  <p className="vault-price-sub">
                    Vault is not open yet. Join the waitlist and we will tell you the price and the
                    opening date at the same time. The extension, its local search and the MCP
                    connection stay free either way.
                  </p>
                </>
              )}
              {PURCHASE_PUBLIC ? (
                <a className="button button-large" href="/pricing#vault-purchase">Subscribe securely</a>
              ) : (
                <VaultWaitlistForm context="vault_pricing" compact />
              )}
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section className="section vault-faq">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">Questions</p>
              <h2>The details, answered.</h2>
            </div>
            <div className="faq-list vault-faq-list">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section vault-closing">
          <div className="container vault-closing-inner">
            <h2>{PURCHASE_PUBLIC ? 'Keep your history safe on every browser and machine.' : 'Be first in when Vault opens.'}</h2>
            <p className="section-intro">
              {PURCHASE_PUBLIC
                ? 'Subscribe with the same email as your Vault account. The free extension, local search and MCP connection stay free whether or not you take Vault.'
                : 'Joining the waitlist costs nothing and takes no card details. You will hear about it before anyone else, and the free version carries on exactly as it is either way.'}
            </p>
            {PURCHASE_PUBLIC ? (
              <a className="button button-large" href="/pricing#vault-purchase">Choose Vault</a>
            ) : (
              <VaultWaitlistForm context="vault_closing" />
            )}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
