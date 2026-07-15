import SiteChrome from '../components/site-chrome';
import VaultWaitlistForm from '../components/vault-waitlist-form';
import VaultPageView from '../components/vault-page-view';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

export const metadata = buildPageMetadata({
  title: 'LLMnesia Vault — One Memory Across Every AI Tool',
  description:
    'Vault syncs, backs up, and unlocks your entire AI chat history — across ChatGPT, Claude, Gemini, Perplexity, Grok and every tool LLMnesia supports. Chat with your whole history via MCP, on any device, end-to-end encrypted. Founding members lock in 50% off for life.',
  canonicalPath: '/vault'
});

// Reframed as feature blocks that sell the possibilities, not just storage.
const UNLOCKS = [
  {
    title: 'One library, every AI',
    body: 'ChatGPT, Claude, Gemini, Perplexity, Grok, Copilot, DeepSeek and the rest — all in a single searchable memory instead of a dozen walled gardens you have to check one by one.'
  },
  {
    title: 'On your phone, too',
    body: 'Your history syncs to every device. Look up what you worked through on your desktop from your phone on the train — the same searchable library, wherever you are.'
  },
  {
    title: 'Nothing ever lost',
    body: 'Platforms quietly delete old chats. Laptops die. Vault keeps an encrypted backup of everything you’ve indexed, so months of thinking never just disappear.'
  },
  {
    title: 'Encrypted end to end',
    body: 'Sealed on your device before it ever syncs. The key never leaves your hands. We can’t read your conversations — and neither can anyone else.'
  }
];

const USE_CASES = [
  {
    kicker: 'Pick up any thread',
    body: 'Start a problem in ChatGPT on your desktop, continue it in Claude on your laptop, check a detail on your phone. One continuous memory instead of a dozen dead-ended tabs.'
  },
  {
    kicker: 'Stop re-explaining yourself',
    body: 'Point your AI at your own history instead of re-pasting the same context every session. It already knows what you’ve decided, tried, and ruled out.'
  },
  {
    kicker: 'Build on your best thinking',
    body: 'Months of research, drafts and decisions become a knowledge base you can actually query — not scattered chats you’ll never find again.'
  }
];

const FAQS = [
  {
    q: 'What does “chat with your history” actually mean?',
    a: 'Vault can expose your indexed conversations to AI tools through MCP — the open standard Claude, Cursor and a growing list of apps already support. Your assistant can then answer using your own past conversations as source material, not just its training data.'
  },
  {
    q: 'Which platforms does it cover?',
    a: 'Everything LLMnesia already supports — ChatGPT, Claude, Gemini, Perplexity, Microsoft Copilot, DeepSeek, Grok, Mistral, Kimi, Qwen and Google AI Studio — brought together into one place.'
  },
  {
    q: 'Will it work on mobile?',
    a: 'That’s a core part of the plan. Once your history is synced through Vault, it’s reachable from your phone — not just the browser where you first indexed it.'
  },
  {
    q: 'Isn’t syncing the opposite of local-first?',
    a: 'No. Your history still lives on your device. Vault lets your devices share an encrypted copy directly, with a key only you hold. What travels between them is an unreadable blob — same privacy promise, more reach.'
  },
  {
    q: 'Will the free version still work?',
    a: 'Always. Local search and indexing stay free, forever. Vault is an optional add-on for people who want their history synced, backed up, and usable inside their AI tools.'
  },
  {
    q: 'How is it private if it’s in the cloud?',
    a: 'Everything is encrypted on your device with a key we never see. What we store is meaningless without it. We can’t read your conversations, and we can’t hand over what we don’t have.'
  },
  {
    q: 'When does it launch?',
    a: 'We’re building it now. Join the waitlist and you’ll be first to know — and founding members lock in half price for as long as they stay subscribed.'
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
              Coming soon · LLMnesia Vault
            </p>
            <h1>
              All your AI chats.{' '}
              <span className="text-gradient">One memory you can actually use.</span>
            </h1>
            <p className="subheadline vault-hero-sub">
              LLMnesia already searches your chat history across every AI tool. Vault takes it
              further — one encrypted memory that syncs to all your devices, backs itself up
              automatically, and plugs straight into your AI so it can draw on everything
              you’ve ever worked through. The first 100 founding members lock in half price for
              life.
            </p>
            <VaultWaitlistForm context="vault_hero" />
          </div>
        </section>

        {/* Spotlight — the headline MCP feature */}
        <section className="section vault-spotlight">
          <div className="container vault-spotlight-inner">
            <div className="vault-spotlight-copy">
              <p className="section-eyebrow">The headline feature</p>
              <h2>Ask your entire history a question.</h2>
              <p className="section-intro">
                Vault connects your conversations to Claude, Cursor, and any tool that speaks
                MCP. Suddenly your AI can draw on everything you’ve already worked through —
                every decision, every draft, every dead end — no matter which assistant you
                used at the time. Your context stops being trapped in whichever tab you opened
                it in.
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
                  didn’t work — the fix was awaiting the refresh before the test’s first request.
                </div>
                <p className="vault-mock-caption">Answered from your own history, via MCP</p>
              </div>
            </div>
          </div>
        </section>

        {/* What it unlocks */}
        <section className="section vault-benefits">
          <div className="container">
            <p className="section-eyebrow">What Vault unlocks</p>
            <h2>More than a backup — your history, finally working for you.</h2>
            <div className="card-grid vault-benefit-grid">
              {UNLOCKS.map((item) => (
                <article className="card vault-benefit-card" key={item.title}>
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
            <p className="section-eyebrow">What you’ll do with it</p>
            <h2>The possibilities it opens up.</h2>
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
              <p className="section-eyebrow">Founding pricing</p>
              <h2>The first 100 pay half. For life.</h2>
              <p className="section-intro">
                The first 100 founding members lock in £4/month — half of the £8 launch price —
                and keep that rate for as long as they stay subscribed. After the first 100, the
                founding rate steps up to £6, still below launch. It’s our thank-you to the people
                who back it earliest.
              </p>
              <ul className="vault-pricing-points">
                <li>Chat with your entire history from Claude, Cursor &amp; other MCP tools</li>
                <li>Encrypted sync across every device, including mobile</li>
                <li>Automatic, private backup of everything you’ve indexed</li>
                <li>Founding-member pricing that never goes up on you</li>
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
                Locked in for life. First 100 members only — after that it’s £6, then £8 at launch.
              </p>
              <VaultWaitlistForm context="vault_pricing" compact />
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

        {/* Closing CTA */}
        <section className="section vault-closing">
          <div className="container vault-closing-inner">
            <h2>Be one of the first 100 — at half the price, for life.</h2>
            <p className="section-intro">
              The first 100 founding members lock in half price for life, and everyone who joins
              before launch keeps a founding rate. It costs nothing to claim your place now — no
              card, no commitment — and you’ll never pay full price if you do.
            </p>
            <VaultWaitlistForm context="vault_closing" />
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
