// PV-04 on docs/REVENUE_LAUNCH_BOARD.md (LLMnesia repo).
//
// NOT YET REVIEWED. This is public pricing copy and the card requires an owner
// read before it goes live. It is left at app/pricing/ rather than the dormant
// app/_pricing/ because the extension's Vault paywall panel (PV-03) links to
// https://llmnesia.com/pricing, so the route has to exist by the time that
// panel can be reached. Nothing here is live until this repo is committed and
// deployed.
//
// Rewritten 2026-09-01 against docs/VAULT_LAUNCH_CONVERSION_PLAN.md. Three
// things changed and each is deliberate:
//
//   D3. The founding rate is no longer public. It is honoured for the people
//       already on the waitlist, delivered as a coupon in a personal email, so
//       every FOUNDING_ENABLED branch has been removed from this page. That
//       also removes a whole bug class: the old page had price bullets gated
//       on the founding flag and others hardcoded, which contradicted each
//       other the moment founding was switched off.
//
//   D3. The price is shown plainly at £96/year or £8/month with no struck
//       through "was" figure. A strikethrough teaches the reader that the
//       lower number is the real price, which mis-anchors every customer after
//       the founding cohort.
//
//   D4. The pitch is recall, not backup. Of 27 waitlist members who wrote why
//       they signed up, 8 asked for consolidation across models, 8 for access
//       across machines and 7 for retrieving past reasoning. Exactly one
//       mentioned losing data. Backup is real and stays on the page, but it is
//       a supporting line, not the headline.
//
// Accuracy trap worth keeping: searching ACROSS MODELS is free, because the
// extension already does that on one device. What Vault adds is across
// MACHINES. Do not blur those two, it overstates the paid tier and understates
// the free one.
//
// The recurring rate is £8/month or £96/year, plus tax by customer location.
// Annual is recommended at the same rate, with no extra annual discount.
//
// Reuses the existing vault-* pricing classes rather than adding new CSS: this
// IS the Vault pricing surface, so the classes are being used for the thing
// they were named for.

import SiteChrome from '../components/site-chrome';
import VaultWaitlistForm from '../components/vault-waitlist-form';
import VaultPurchase from '../components/vault-purchase';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true';

// Gates every claim that Vault reaches a phone. Defaults OFF on purpose: the
// mobile web app is built but its real-device test (MV-24) has not been run,
// and "from anywhere" is the load-bearing half of the recall pitch. Turn this
// on only once a real iPhone and a real Android have installed and reopened it.
const MOBILE_READY = process.env.NEXT_PUBLIC_VAULT_MOBILE_READY === 'true';

const MONTHLY_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_MONTHLY_PRICE_LABEL || '£8';
const ANNUAL_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL || '£96';

const DEVICE_PHRASE = MOBILE_READY ? 'every device you use' : 'every desktop you use';

export const metadata = buildPageMetadata({
  title: 'Pricing — LLMnesia',
  description:
    'The LLMnesia browser extension, its search and the MCP connection stay free. Vault brings the history from all your machines into one archive for £96 a year or £8 a month.',
  canonicalPath: '/pricing'
});

// The two things a reader is actually choosing between. "Free" is first and
// deliberately not thinned out: the contrast is the argument for Vault, so
// understating the free tier would weaken the paid one.
const PLANS = [
  {
    name: 'LLMnesia',
    price: 'Free',
    period: 'always',
    lead: 'Everything the extension does today, on the device you install it on.',
    points: [
      'Capture and search your chats across ChatGPT, Claude, Gemini, Perplexity, Copilot, DeepSeek, Grok, Mistral, Kimi, Qwen, Google AI Studio, Character.AI and Z.ai',
      'Import your existing history from each platform',
      'Local coding sessions from Claude Code and Codex, indexed alongside the rest',
      'The MCP connection, so Claude Desktop, Cursor, Codex and other desktop AI tools can read your history',
      'No account needed, and nothing leaves your machine'
    ]
  },
  {
    name: 'Vault',
    price: `${MONTHLY_PRICE_LABEL}/month or ${ANNUAL_PRICE_LABEL}/year`,
    period: 'plus tax',
    lead: `Optional. Joins ${DEVICE_PHRASE} into one archive, so a search finds the answer wherever you happened to be sitting.`,
    points: [
      'One archive across all your machines, instead of one per browser profile',
      'Your free MCP connection then answers from all of it, not only what this machine captured',
      ...(MOBILE_READY ? ['The same archive on your phone, so you can ask without opening a laptop'] : []),
      'Backup comes with it: a dead laptop, or a platform quietly deleting old chats, no longer takes your history',
      'Sealed on your device before it syncs, with a key we never hold'
    ]
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
    a: 'No. MCP is free and always will be. It reads the LLMnesia archive on the machine it is installed on, so it works perfectly well with a single-device archive. What Vault changes is what is in that archive: with it, your desktop AI answers from the history of every machine you use rather than just the one in front of you.'
  },
  {
    q: 'What am I actually paying for?',
    a: 'Joining your machines together. The free extension already searches across every AI platform on the device you are using. Vault is what makes that one archive instead of several, so the thing you worked out on the work laptop is there on the home one. Backup and restore come with it. That is the part with a server behind it, which is the part that costs money to run.'
  },
  {
    q: 'What happens to my conversations if I cancel?',
    a: 'Nothing is deleted. Everything already in your Vault stays yours and you can restore it to any of your devices without an active subscription. What stops is new conversations syncing up. Your local archive carries on working exactly as it did before you subscribed.'
  },
  {
    q: 'Why is it a subscription and not a one-off?',
    a: 'Because the cost is ongoing. Storing your encrypted history and serving it to your other devices costs money every month that you keep it there, so charging once would only work until it did not. Annual billing is the same rate as monthly, not a discount, and you can cancel from the billing portal at any time.'
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
        a: 'Not yet, but it is coming. Vault starts with sync and backup across supported desktop devices, and a mobile version is close behind. Your subscription covers it when it lands, at no extra cost.'
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
              You already worked this out.{' '}
              <span className="text-gradient">Somewhere.</span>
            </h1>
            <p className="subheadline vault-hero-sub">
              Searching your own AI history is free, on the machine you are using, across every
              platform you use. That does not change. Vault is the paid part: it joins{' '}
              {DEVICE_PHRASE} into a single archive, so the answer is there whether you worked it
              out in ChatGPT on the work laptop or in Claude at home.
            </p>
          </div>
        </section>

        {/* The two plans */}
        <section className="section vault-benefits">
          <div className="container">
            <p className="section-eyebrow">What costs what</p>
            <h2>Two things, and only one of them has a price.</h2>
            <div className="card-grid vault-benefit-grid">
              {PLANS.map((plan) => (
                <article className="card vault-benefit-card" key={plan.name}>
                  <p className="vault-price-badge">
                    {plan.price} · {plan.period}
                  </p>
                  <h3>{plan.name}</h3>
                  <p>{plan.lead}</p>
                  <ul className="vault-pricing-points">
                    {plan.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Vault */}
        <section className="section vault-pricing">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow">Vault</p>
              <h2>One archive, not one per machine.</h2>
              <p className="section-intro">
                Most people do not lose a conversation. They lose track of which machine it was on,
                or which model they asked. Vault removes that problem by keeping one encrypted
                archive that {DEVICE_PHRASE} writes into and reads from.
              </p>
              <ul className="vault-pricing-points">
                <li>
                  Your free MCP connection reads that archive, so Claude Desktop, Cursor and Codex
                  answer from everything you have discussed, not just this machine.
                </li>
                {MOBILE_READY ? (
                  <li>Open it in your phone browser and search the whole thing from anywhere.</li>
                ) : null}
                <li>
                  Cancel and you keep every conversation. Restore keeps working without a
                  subscription.
                </li>
                <li>
                  Choose {ANNUAL_PRICE_LABEL} yearly (recommended) or {MONTHLY_PRICE_LABEL} monthly.
                  The rate is the same either way.
                </li>
                <li>The extension and MCP stay free whether or not you ever take Vault.</li>
              </ul>
            </div>
            <aside className="vault-price-card" aria-label="Vault pricing">
              <p className="vault-price-badge">Vault</p>
              <p className="vault-price-figure">
                <span className="vault-price-now">{MONTHLY_PRICE_LABEL}</span>
                <span className="vault-price-period">/month</span>
              </p>
              <p className="vault-price-sub">
                Or {ANNUAL_PRICE_LABEL} a year at the same rate, recommended. Plus applicable tax.
                Your local archive stays free.
              </p>
              {CHECKOUT_ENABLED ? (
                <VaultPurchase monthlyLabel={MONTHLY_PRICE_LABEL} annualLabel={ANNUAL_PRICE_LABEL} />
              ) : (
                <VaultWaitlistForm context="pricing_founding" compact />
              )}
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section className="section vault-faq">
          <div className="container">
            <p className="section-eyebrow">Questions</p>
            <h2>The details, answered.</h2>
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
                ? 'Stop re-deriving what you already worked out.'
                : 'Be first in when Vault opens.'}
            </h2>
            <p className="section-intro">
              {CHECKOUT_ENABLED
                ? `Sign in, choose yearly or monthly, and Stripe activates sync automatically. ${ANNUAL_PRICE_LABEL} a year or ${MONTHLY_PRICE_LABEL} a month, plus tax. The free extension and MCP connection stay free.`
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
