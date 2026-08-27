// PV-04 on docs/REVENUE_LAUNCH_BOARD.md (LLMnesia repo).
//
// NOT YET REVIEWED. This is public pricing copy and the card requires an owner
// read before it goes live. It is left at app/pricing/ rather than the dormant
// app/_pricing/ because the extension's Vault paywall panel (PV-03) links to
// https://llmnesia.com/pricing, so the route has to exist by the time that
// panel can be reached. Nothing here is live until this repo is committed and
// deployed.
//
// Numbers are fixed by VAULT_MCP_STRATEGY.md and marked "do not relitigate":
// £8/month standard, £4/month founding held for as long as the subscription
// runs. It is not a lifetime purchase and the founding rate is not
// time-limited. The £6 step after the first 100 mirrors what /vault already
// tells the waitlist, so the two pages cannot contradict each other.
//
// Reuses the existing vault-* pricing classes rather than adding new CSS: this
// IS the Vault pricing surface, so the classes are being used for the thing
// they were named for.

import SiteChrome from '../components/site-chrome';
import VaultWaitlistForm from '../components/vault-waitlist-form';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

export const metadata = buildPageMetadata({
  title: 'Pricing — LLMnesia',
  description:
    'The LLMnesia browser extension and its MCP connection are free and stay free. Vault, the optional encrypted sync and backup across your devices, is £8 a month, or £4 a month for founding members who keep that rate for as long as they stay subscribed.',
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
    price: '£8',
    period: 'per month',
    lead: 'Optional. Adds encrypted sync and backup, so your history is not tied to one browser profile.',
    points: [
      'One encrypted memory shared across your supported desktop devices',
      'Automatic backup, so a dead laptop or a platform quietly deleting old chats does not take your history with it',
      'Sealed on your device before it syncs, with a key we never hold',
      'Restore to a new device whenever you need it, subscribed or not',
      '£80 a year if you would rather pay annually, which works out at two months free'
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
    a: 'No. MCP is free and always will be. It reads the LLMnesia archive on your machine, so it works perfectly well with a single-device archive. Vault only changes what is in that archive, by bringing in the history from your other desktops.'
  },
  {
    q: 'What am I actually paying for?',
    a: 'Encrypted sync and backup. Your conversations are sealed on your device and stored so your other devices can pull them down, and so you still have them if a machine dies or a platform deletes a chat. That is the part with a server behind it, which is the part that costs money to run.'
  },
  {
    q: 'What happens to my conversations if I cancel?',
    a: 'Nothing is deleted. Everything already in your Vault stays yours and you can restore it to any of your devices without an active subscription. What stops is new conversations syncing up. Your local archive carries on working exactly as it did before you subscribed.'
  },
  {
    q: 'How long does the founding rate last?',
    a: 'For as long as you stay subscribed. It is not a discount that expires after a year and it is not a one-off lifetime purchase. Vault is a monthly subscription, and founding members keep paying the founding price at every renewal.'
  },
  {
    q: 'Does joining the waitlist give me access or charge me anything?',
    a: 'Neither. There is nothing to pay yet and no card to enter. Joining tells us where to email you when Vault opens, and reserves your place at the founding rate.'
  },
  {
    q: 'Can you read my conversations?',
    a: 'No. Everything is encrypted on your device with a key we never see, so what we store is meaningless without it. We cannot read your conversations and we cannot hand over what we do not have.'
  },
  {
    q: 'Does Vault work on my phone?',
    a: 'Not yet. Vault starts with sync and backup across supported desktop devices, and mobile access is planned for a future update.'
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
              LLMnesia is free.{' '}
              <span className="text-gradient">Vault is the optional part.</span>
            </h1>
            <p className="subheadline vault-hero-sub">
              The browser extension, every platform it captures, the search that runs on your
              machine and the MCP connection to your desktop AI tools are free, and they stay
              free. Vault is the one paid piece: encrypted sync and backup, so your history
              belongs to you rather than to one browser profile.
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

        {/* Founding rate */}
        <section className="section vault-pricing">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow">Founding rate</p>
              <h2>Half price, and it stays half price.</h2>
              <p className="section-intro">
                The first 100 founding members pay £4 a month instead of £8, and keep that rate
                for as long as they stay subscribed. After the first 100, the founding rate is £6,
                still under the standard price, and it works the same way: the price you join at
                is the price you keep. It is our thank-you to the people who back Vault before it
                is finished.
              </p>
              <ul className="vault-pricing-points">
                <li>Not time-limited. The rate does not step up to £8 after a year.</li>
                <li>Not a lifetime purchase. Vault is a subscription, and this is the price you renew at.</li>
                <li>Nothing to pay today. The waitlist is free and takes no card details.</li>
                <li>The extension and MCP stay free whether or not you ever take Vault.</li>
              </ul>
            </div>
            <aside className="vault-price-card" aria-label="Founding member pricing">
              <p className="vault-price-badge">First 100 · Founding member</p>
              <p className="vault-price-figure">
                <span className="vault-price-strike">£8</span>
                <span className="vault-price-now">£4</span>
                <span className="vault-price-period">/month</span>
              </p>
              <p className="vault-price-sub">
                Kept for as long as you stay subscribed. After the first 100 the founding rate is
                £6, then £8 at launch.
              </p>
              <VaultWaitlistForm context="pricing_founding" compact />
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
            <h2>Claim the founding rate before Vault opens.</h2>
            <p className="section-intro">
              Vault is still being built. Join the waitlist and you will be first to hear when it
              opens, at the founding price you keep for as long as you stay subscribed. No card,
              no commitment, and the free version carries on exactly as it is either way.
            </p>
            <VaultWaitlistForm context="pricing_closing" />
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
