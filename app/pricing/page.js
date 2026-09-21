// Vault is launched, so this route and its product copy are always public.
// CHECKOUT_ENABLED controls only the embedded payment flow in a given build.
// Annual is £88 against £8 monthly, which includes one month free.
// Free local search covers models inside one browser profile. Vault adds sync
// across devices, encrypted backup, and the subscriber web app beta.

import SiteChrome from '../components/site-chrome';
import VaultPurchase from '../components/vault-purchase';
import VaultPlanCta from '../components/vault-plan-cta';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true';

const MONTHLY_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_MONTHLY_PRICE_LABEL || '£8';
const ANNUAL_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL || '£88';
const ANNUAL_MONTHLY_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL || '£7.33';

export const metadata = buildPageMetadata({
  title: 'Pricing',
  description:
    'The LLMnesia browser extension, local search and MCP connection stay free. Vault adds encrypted sync, backup and the Vault web app beta for £88 a year or £8 a month.',
  canonicalPath: '/pricing'
});

// The two things a reader is actually choosing between. Kept deliberately
// short: this is a comparison card, not documentation. The price is the hero
// element rather than a footnote in a pill, and each line is scannable in one
// pass. The detail these lines used to carry now lives in the section below
// and in the FAQ, where someone who wants it will look for it.
const PLANS = [
  {
    name: 'LLMnesia',
    priceMain: 'Free',
    priceSub: 'Always. No account needed.',
    points: [
      'Search every AI platform you use',
      'Import your existing history',
      'Claude Code and Codex sessions too',
      'MCP for your desktop AI apps',
      'Nothing leaves your machine'
    ],
    foot: 'Yours already. Nothing to do.'
  },
  {
    name: 'Vault',
    featured: true,
    flag: 'Recommended',
    priceMain: ANNUAL_MONTHLY_LABEL,
    priceUnit: '/month',
    priceSub: `Billed annually at ${ANNUAL_PRICE_LABEL}, with one month free. Or ${MONTHLY_PRICE_LABEL} monthly. Plus tax.`,
    points: [
      'Every browser and machine, one archive',
      'Automatic backup, nothing ages out',
      'Installable Vault web app beta',
      'Ask Vault with linked source conversations',
      'Sealed with a key we never hold'
    ],
    cta: 'Get Vault'
  }
];

// Example content rendered in the same shape as the extension popup's current
// quick-search results: platform pill, conversation title and matched snippet.
// Vault does not currently expose or separate source browser-profile/device
// labels, so none are invented here.
const PROOF_QUERY = 'italy trip itinerary';

const PROOF_WITHOUT = [
  {
    platform: 'ChatGPT',
    platformKey: 'chatgpt',
    title: 'Italy trip itinerary',
    snippet: 'Rome, Florence and Bologna over ten days, with the travel days kept short.'
  },
  {
    platform: 'Claude',
    platformKey: 'claude',
    title: 'Getting around northern Italy',
    snippet: 'Use high-speed trains between the larger cities and book timed tickets early.'
  }
];

const PROOF_WITH = [
  ...PROOF_WITHOUT,
  {
    platform: 'Gemini',
    platformKey: 'gemini',
    title: 'Puglia towns worth a detour',
    snippet: 'Lecce for baroque streets, Ostuni for a half day, and Monopoli by the water.'
  },
  {
    platform: 'Perplexity',
    platformKey: 'perplexity',
    title: 'Lake Como ferry planning',
    snippet: 'The mid-lake route links Bellagio, Varenna and Menaggio throughout the day.'
  },
  {
    platform: 'Grok',
    platformKey: 'grok',
    title: 'Packing for Italy in October',
    snippet: 'Bring layers, a light rain shell and shoes that are comfortable on stone streets.'
  }
];

// Written to answer the question a paywall actually raises: what happens to my
// stuff. The cancellation answer matches what the extension's own Vault panel
// says, and both match what the server does.
const FAQS = [
  {
    q: 'Is the extension itself going to start costing money?',
    a: 'No. Capturing your chats, importing your history and searching it on your device are free, and that is not changing. Vault is an addition, not a fence put around something you already have.'
  },
  {
    q: 'Do I need Vault to use MCP?',
    a: 'No. MCP is a separate free feature. It lets compatible desktop AI apps use the local LLMnesia archive on that computer. Vault is only for encrypted sync, backup, restore, and mobile access across your devices.'
  },
  {
    q: 'What am I actually paying for?',
    a: 'Joining your browsers and machines together. The free extension already searches across every AI platform in the browser profile you are using. Vault is what makes that one archive instead of several, so the thing you worked out in your work profile, or on the work laptop, is there everywhere else. Backup and restore come with it. That is the part with a server behind it, which is the part that costs money to run.'
  },
  {
    q: 'What happens to my conversations if I cancel?',
    a: 'Nothing is deleted. Conversations already on each device remain there and stay searchable. Sync and restore from the encrypted Vault pause when the subscription ends, and resume if you renew.'
  },
  {
    q: 'Is annual cheaper than monthly?',
    a: `Yes. Annual works out at ${ANNUAL_MONTHLY_LABEL} a month against ${MONTHLY_PRICE_LABEL} monthly, which includes one month free. Both plans are the same Vault with the same features, so the only reason to pay monthly is if you would rather not commit to a year.`
  },
  {
    q: 'Why is it a subscription and not a one-off?',
    a: 'Because the cost is ongoing. Storing your encrypted history and serving it to your other devices costs money every month that you keep it there, so charging once would only work until it did not. You can cancel from the billing portal at any time. Conversations already on each device stay searchable; Vault sync and restore pause until you renew.'
  },
  {
    q: 'How do I subscribe?',
    a: 'Sign in here with the same email as your Vault account, then continue to secure Stripe Checkout. Stripe activates sync automatically after payment; no manual grant is needed.'
  },
  {
    q: 'Can you read my conversations?',
    a: 'No. Everything is encrypted on your device with a key we never see, so what we store is meaningless without it. We cannot read your conversations and we cannot hand over what we do not have.'
  },
  {
    q: 'Does Vault work on my phone?',
    a: 'Yes. The installable Vault web app beta works on phone and desktop, where you can search and read your synced history. It is included in the subscription.'
  },
  {
    q: 'Does Ask Vault send my whole archive to an AI provider?',
    a: 'No. Ask Vault selects a bounded set of relevant material for the question and sends that directly from your browser to the provider you chose using your own API key. It does not send the whole archive, and the request does not pass through LLMnesia.'
  }
];

export default function PricingPage() {
  return (
    <SiteChrome>
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <main id="main-content" className="vault-page">
        {/* Hero */}
        <section className="section vault-hero">
          <div className="container vault-hero-inner">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Pricing
            </p>
            <h1>
              Half your thinking is on{' '}
              <span className="text-gradient">the other machine.</span>
            </h1>
              <p className="subheadline vault-hero-sub">
              The free extension searches the browser profile you are in, across every AI platform
              you use. Vault joins every browser and computer you use into one archive, so you stop re-solving what
              you already worked out somewhere else, then lets you search and read that archive
              in the Vault web app beta.
            </p>
          </div>
        </section>

        {/* The two plans */}
        <section className="section vault-benefits">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">What you get</p>
              <h2>Free on one profile. Vault across your devices.</h2>
            </div>
            <div className="card-grid vault-benefit-grid">
              {PLANS.map((plan) => (
                <article
                  className={`card vault-benefit-card vault-plan-card${
                    plan.featured ? ' vault-plan-card-featured' : ''
                  }`}
                  key={plan.name}
                >
                  {plan.flag ? <p className="vault-plan-flag">{plan.flag}</p> : null}
                  <h3>{plan.name}</h3>
                  <p className="vault-plan-price">
                    <span className="vault-plan-price-main">{plan.priceMain}</span>
                    {plan.priceUnit ? (
                      <span className="vault-plan-price-unit">{plan.priceUnit}</span>
                    ) : null}
                  </p>
                  <p className="vault-plan-price-sub">{plan.priceSub}</p>
                  <ul className="vault-pricing-points vault-plan-points">
                    {plan.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {plan.cta ? (
                    <VaultPlanCta />
                  ) : (
                    <p className="vault-plan-foot">{plan.foot}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* The one piece of evidence on the page: the gap, shown rather than asserted */}
        <section className="section vault-proof">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">The difference</p>
              <h2>The same search. More of your own history.</h2>
            </div>
            <div className="vault-proof-grid">
              <figure className="vault-proof-panel">
                <figcaption className="vault-proof-label">Free extension</figcaption>
                <div className="vault-proof-app" aria-label="Example LLMnesia search results without Vault">
                  <div className="vault-proof-app-head">
                    <strong>LLMnesia</strong>
                    <span>Search your AI chats. Instantly.</span>
                  </div>
                  <div className="vault-proof-search-row">
                    <p className="vault-proof-query">{PROOF_QUERY}</p>
                    <span className="vault-proof-full-search">Full search ⤢</span>
                  </div>
                  <ul className="vault-proof-list">
                    {PROOF_WITHOUT.map((hit) => (
                      <li key={`${hit.platform}-${hit.title}`}>
                        <div className="vault-proof-result-head">
                          <span className="vault-proof-platform" data-platform={hit.platformKey}>{hit.platform}</span>
                          <strong>{hit.title}</strong>
                        </div>
                        <span className="vault-proof-snippet">{hit.snippet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="vault-proof-note">
                  Search covers the conversations indexed in this browser profile.
                </p>
              </figure>

              <figure className="vault-proof-panel vault-proof-panel-on">
                <figcaption className="vault-proof-label">With Vault</figcaption>
                <div className="vault-proof-app" aria-label="Example LLMnesia search results with Vault">
                  <div className="vault-proof-app-head">
                    <strong>LLMnesia</strong>
                    <span>Search your AI chats. Instantly.</span>
                  </div>
                  <div className="vault-proof-search-row">
                    <p className="vault-proof-query">{PROOF_QUERY}</p>
                    <span className="vault-proof-full-search">Full search ⤢</span>
                  </div>
                  <ul className="vault-proof-list">
                    {PROOF_WITH.map((hit) => (
                      <li key={`${hit.platform}-${hit.title}`}>
                        <div className="vault-proof-result-head">
                          <span className="vault-proof-platform" data-platform={hit.platformKey}>{hit.platform}</span>
                          <strong>{hit.title}</strong>
                        </div>
                        <span className="vault-proof-snippet">{hit.snippet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="vault-proof-note">
                  Synced conversations join the same local search on this device.
                </p>
              </figure>
            </div>
            <p className="vault-proof-caption">
              Example content shown in the current popup result format.
            </p>
          </div>
        </section>

        {/* Vault, led by the one capability upgrade available on day one */}
        <section className="section vault-pricing" id="get-vault">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow">Vault</p>
              <h2>Your archive shouldn’t stop at this laptop.</h2>
              <p className="section-intro">
                The extension already finds what you asked, in the browser profile that captured
                it. The gap is everything captured somewhere else: the other laptop, the work
                profile, the model you were using that week. The more you use AI, the wider that
                gap gets. Vault closes it: one encrypted archive that every connected browser and
                computer writes into and reads from.
              </p>
              <ul className="vault-pricing-points vault-plan-points">
                <li>Install the Vault web app on phone or desktop to search and read the whole synced archive.</li>
                <li>Ask Vault can answer across that history and link back to its source conversations.</li>
              </ul>
              <p className="vault-reassure">
                Cancel any time. Conversations already on each device stay searchable. Renew Vault
                whenever you want to sync or restore the encrypted backup again.
              </p>
            </div>
            <aside className="vault-price-card" aria-label="Vault pricing">
              <p className="vault-price-badge">Vault</p>
              <p className="vault-price-figure">
                <span className="vault-price-now">{ANNUAL_MONTHLY_LABEL}</span>
                <span className="vault-price-period">/month</span>
              </p>
              <p className="vault-price-sub">
                Billed annually at {ANNUAL_PRICE_LABEL}, with one month free. Or {MONTHLY_PRICE_LABEL}{' '}
                monthly. Plus tax.
              </p>
              {CHECKOUT_ENABLED ? (
                <VaultPurchase
                  monthlyLabel={MONTHLY_PRICE_LABEL}
                  annualLabel={ANNUAL_PRICE_LABEL}
                  annualMonthlyLabel={ANNUAL_MONTHLY_LABEL}
                />
              ) : (
                <div id="vault-purchase" className="vault-purchase-fallback">
                  <a className="button button-large" href="https://www.llmnesia.com/pricing#vault-purchase">
                    Subscribe on the live site
                  </a>
                </div>
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

        {/* Closing */}
        <section className="section vault-closing">
          <div className="container vault-closing-inner">
            <h2>Stop re-deriving what your own history already knows.</h2>
            <p className="section-intro">
              Sign in, choose yearly or monthly, and Stripe activates sync automatically.{' '}
              {ANNUAL_PRICE_LABEL} a year, which is {ANNUAL_MONTHLY_LABEL} a month, or{' '}
              {MONTHLY_PRICE_LABEL} billed monthly, plus tax. The free extension stays free.
            </p>
            <a className="button button-large" href="#vault-purchase">Choose Vault</a>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
