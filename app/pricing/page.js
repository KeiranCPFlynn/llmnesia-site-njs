// PV-04 on docs/REVENUE_LAUNCH_BOARD.md (LLMnesia repo).
//
// NOT YET REVIEWED. This is public pricing copy and the card requires an owner
// read before it goes live. It is left at app/pricing/ rather than the dormant
// app/_pricing/ because the extension's Vault paywall panel (PV-03) links to
// https://llmnesia.com/pricing, so the route has to exist by the time that
// panel can be reached. Nothing here is live until this repo is committed,
// pushed and deployed.
//
// Rewritten 2026-09-01 against docs/VAULT_LAUNCH_CONVERSION_PLAN.md.
//
//   Headline. "Half your thinking is on the other machine." The earlier draft
//       sold recall, which is what the FREE extension already does, so the paid
//       tier was competing with its own free tier. This headline names the gap
//       the free product leaves instead: one archive per machine. It also does
//       not depend on the mobile web app, which is not guaranteed for launch.
//
//   D3. The founding rate is not on this page. It is honoured for people who
//       signed up before launch and delivered through Stripe, not chosen in the
//       browser. Removing it also removes a bug class: the old page had price
//       bullets gated on a founding flag and others hardcoded, which
//       contradicted each other the moment founding was switched off.
//
//   D3. No struck-through "was" price. A strikethrough teaches the reader that
//       the lower number is the real price, which mis-anchors every customer
//       who arrives after the founding cohort.
//
//   Annual is now genuinely discounted: £80/year against £8/month, which is two
//       months free and an effective £6.67/month. This is a revenue decision,
//       not a giveaway. A £8 monthly subscriber who cancels around month nine
//       pays £72, so £80 taken upfront beats the expected monthly run, removes
//       eleven Stripe fees, and gives a lower headline number to quote without
//       cutting the monthly rate.
//
//       WARNING: STRIPE_VAULT_ANNUAL_PRICE_ID must point at an £80 Price before
//       this deploys. If it still points at the £96 Price, this page and
//       Checkout will disagree.
//
// Accuracy traps worth keeping:
//
//   - Searching ACROSS MODELS is free, because the extension already does that
//     on one device. What Vault adds is across MACHINES. Do not blur those two;
//     it overstates the paid tier and understates the free one.
//   - Do not state how many platforms are supported, and do not present a list
//     as complete. The set changes.
//
// Reuses the existing vault-* pricing classes rather than adding new CSS: this
// IS the Vault pricing surface, so the classes are being used for the thing
// they were named for.

import { notFound } from 'next/navigation';
import SiteChrome from '../components/site-chrome';
import VaultWaitlistForm from '../components/vault-waitlist-form';
import VaultPurchase from '../components/vault-purchase';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true';

// Gates every claim that Vault reaches a phone. Defaults OFF on purpose: the
// mobile web app works, but MV-24 (physical-device install) is blocked on a
// human test and MV-51, MV-52 and MV-53 are still todo. Turn this on only once
// the mobile board says the app has actually shipped.
const MOBILE_READY = process.env.NEXT_PUBLIC_VAULT_MOBILE_READY === 'true';

// Gates the whole route. Vault is not launched, so a public /pricing page
// quotes a price for something nobody can buy, and the previously deployed
// version was publicly serving the founding rate and the "first 100" cap that
// are meant to stay private. Off by default: the route 404s unless this is
// explicitly set, so shipping the page can never again publish it by accident.
// Turn it on in the same deploy that opens Checkout, not before.
//
// Requires BOTH flags deliberately: either one missing serves a 404, so a single
// environment mistake cannot republish this page, and it can never be public
// while there is no purchase path. They flip together in the authorised release,
// so demanding both costs nothing.
const PRICING_PUBLIC =
  process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true' &&
  process.env.NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true';

const MONTHLY_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_MONTHLY_PRICE_LABEL || '£8';
const ANNUAL_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL || '£80';
const ANNUAL_MONTHLY_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL || '£6.67';

const DEVICE_PHRASE = MOBILE_READY ? 'every device you use' : 'every browser and machine you use';

// While the route is gated the page still emits a document head, so keep the
// price out of the description rather than shipping it on a 404.
export const metadata = PRICING_PUBLIC
  ? buildPageMetadata({
      title: 'Pricing — LLMnesia',
      description:
        'The LLMnesia browser extension, its search and the MCP connection stay free. Vault joins the history from every browser and machine you use into one archive for £80 a year or £8 a month.',
      canonicalPath: '/pricing'
    })
  : { title: 'Not found', robots: { index: false, follow: false } };

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
    priceSub: `Billed annually at ${ANNUAL_PRICE_LABEL}, two months free. Or ${MONTHLY_PRICE_LABEL} monthly. Plus tax.`,
    points: [
      'Every browser and machine, one archive',
      'MCP answers from all of it',
      'Automatic backup, nothing ages out',
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
    a: 'No. MCP is free and always will be. It reads the LLMnesia archive for the browser profile it is connected to, so it works perfectly well with a single-profile archive. What Vault changes is what is in that archive: with it, your desktop AI answers from the history of every browser and machine you use rather than just the one in front of you.'
  },
  {
    q: 'What am I actually paying for?',
    a: 'Joining your browsers and machines together. The free extension already searches across every AI platform in the browser profile you are using. Vault is what makes that one archive instead of several, so the thing you worked out in your work profile, or on the work laptop, is there everywhere else. Backup and restore come with it. That is the part with a server behind it, which is the part that costs money to run.'
  },
  {
    q: 'What happens to my conversations if I cancel?',
    a: 'Nothing is deleted. Everything already in your Vault stays yours and you can restore it to any of your devices without an active subscription. What stops is new conversations syncing up. Your local archive carries on working exactly as it did before you subscribed.'
  },
  {
    q: 'Is annual cheaper than monthly?',
    a: `Yes. Annual works out at ${ANNUAL_MONTHLY_LABEL} a month against ${MONTHLY_PRICE_LABEL} monthly, which is two months free. Both plans are the same Vault with the same features, so the only reason to pay monthly is if you would rather not commit to a year.`
  },
  {
    q: 'Why is it a subscription and not a one-off?',
    a: 'Because the cost is ongoing. Storing your encrypted history and serving it to your other devices costs money every month that you keep it there, so charging once would only work until it did not. You can cancel from the billing portal at any time and keep everything already in your Vault.'
  },
  CHECKOUT_ENABLED
    ? {
        q: 'How do I subscribe?',
        a: 'Sign in here with the same email as your Vault account, then continue to secure Stripe Checkout. Stripe activates sync automatically after payment; no manual grant is needed.'
      }
    : {
        q: 'Does joining the waitlist give me access or charge me anything?',
        a: 'Neither. There is nothing to pay yet and no card to enter. Joining tells us where to email you when Vault opens.'
      },
  {
    q: 'Can you read my conversations?',
    a: 'No. Everything is encrypted on your device with a key we never see, so what we store is meaningless without it. We cannot read your conversations and we cannot hand over what we do not have.'
  },
  MOBILE_READY
    ? {
        q: 'Does Vault work on my phone?',
        a: 'Yes. Your Vault opens in the phone browser and you can search your whole history there, including chats captured on machines you were not holding at the time. It is included in the subscription at no extra cost.'
      }
    : {
        q: 'Does Vault work on my phone?',
        a: 'Not yet. Vault starts with sync and backup across every browser and machine you use, and a mobile version is in development. Your subscription covers it when it lands, at no extra cost.'
      }
];

export default function PricingPage() {
  if (!PRICING_PUBLIC) notFound();

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
              you use. Vault joins {DEVICE_PHRASE} into one archive, so you stop re-solving what
              you already worked out somewhere else.
            </p>
          </div>
        </section>

        {/* The two plans */}
        <section className="section vault-benefits">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">What you get</p>
              <h2>The free part stays free. Vault is what completes it.</h2>
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
                    <a className="button vault-plan-cta" href="#get-vault">
                      {plan.cta}
                    </a>
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
              <h2>Your agent shouldn’t only know what this laptop saw.</h2>
              <p className="section-intro">
                The extension already finds what you asked, in the browser profile that captured
                it. The gap is everything captured somewhere else: the other laptop, the work
                profile, the model you were using that week. The more you use AI, the wider that
                gap gets. Vault closes it: one encrypted archive that {DEVICE_PHRASE} writes into
                and reads from.
              </p>
              {MOBILE_READY ? (
                <ul className="vault-pricing-points vault-plan-points">
                  <li>Open it in your phone browser and search the whole thing from anywhere.</li>
                </ul>
              ) : null}
              <p className="vault-reassure">
                Cancel any time. When your subscription ends, your existing Vault stays available
                to restore; only new uploads stop.
              </p>
            </div>
            <aside className="vault-price-card" aria-label="Vault pricing">
              <p className="vault-price-badge">Vault</p>
              <p className="vault-price-figure">
                <span className="vault-price-now">{ANNUAL_MONTHLY_LABEL}</span>
                <span className="vault-price-period">/month</span>
              </p>
              <p className="vault-price-sub">
                Billed annually at {ANNUAL_PRICE_LABEL}, two months free. Or {MONTHLY_PRICE_LABEL}{' '}
                monthly. Plus tax.
              </p>
              {CHECKOUT_ENABLED ? (
                <VaultPurchase
                  monthlyLabel={MONTHLY_PRICE_LABEL}
                  annualLabel={ANNUAL_PRICE_LABEL}
                  annualMonthlyLabel={ANNUAL_MONTHLY_LABEL}
                />
              ) : (
                <VaultWaitlistForm context="pricing_founding" compact />
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
            <h2>
              {CHECKOUT_ENABLED
                ? 'Stop re-deriving what the other machine already knows.'
                : 'Be first in when Vault opens.'}
            </h2>
            <p className="section-intro">
              {CHECKOUT_ENABLED
                ? `Sign in, choose yearly or monthly, and Stripe activates sync automatically. ${ANNUAL_PRICE_LABEL} a year, which is ${ANNUAL_MONTHLY_LABEL} a month, or ${MONTHLY_PRICE_LABEL} billed monthly, plus tax. The free extension and MCP connection stay free.`
                : 'Vault is still being built. Join the waitlist and you will be first to hear when it opens. No card, no commitment, and the free version carries on exactly as it is either way.'}
            </p>
            {CHECKOUT_ENABLED ? (
              <a className="button button-large" href="#vault-purchase">Choose Vault</a>
            ) : (
              <VaultWaitlistForm context="pricing_closing" />
            )}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
