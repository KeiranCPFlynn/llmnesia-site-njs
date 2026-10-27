import SiteChrome from '../components/site-chrome';
import JsonLd from '../components/json-ld';
import ProBoardDemo from '../components/pro-board-demo';
import ProEarlyAccessForm from '../components/pro-early-access-form';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

// Waitlist page for Pro (Projects and Teams). Pro is still being built, so
// every claim here must match the "safe once it ships" list in the LLMnesia
// repo's docs/TEAMS_PROJECTS_GTM_PLAN.md, and the price and packaging must match
// the Decisions table in docs/TEAMS_FIRST_PAID_TEAM.md. The board is a labelled
// design preview with made-up content, never a real user's work.

export const metadata = buildPageMetadata({
  title: 'LLMnesia Pro: know where every project stands, across every AI (coming soon)',
  description:
    'LLMnesia saves your ChatGPT, Claude and coding-agent chats, then keeps a simple board for each project: what is decided, what is in progress and what is next, each linked to the chat it came from. Use it alone or with your team. Coming soon: join the waitlist.',
  canonicalPath: '/pro'
});

// Keep in step with the Decisions table (decision 2) before publishing.
const PRICE_MONTHLY = '£15';
const PRICE_ANNUAL = '£165';

const SOURCES = ['ChatGPT', 'Claude', 'Gemini', 'Claude Code', 'Codex', 'and more'];

// The pain, in the reader's words, then what Pro does about it.
const PAINS = [
  { text: 'The decision is in a Claude chat from Tuesday.', platform: 'claude', label: 'Claude' },
  { text: 'The next step is in last night’s Codex session.', platform: 'codex', label: 'Codex' },
  { text: 'The full picture is in your head, and nowhere else.' }
];

const OUTCOMES = [
  'See where every project stands.',
  'Check any decision against the chat it came from.',
  'Jump back into the right chat and carry on.'
];

const STEPS = [
  {
    title: 'Install LLMnesia',
    body: 'The free extension saves your AI chats as you go. Coding sessions come in through the free desktop helper.'
  },
  {
    title: 'Connect your AI',
    body: 'Add an OpenAI, Anthropic or OpenRouter key, or use a coding agent you already have. Pro uses it to read your chats.'
  },
  {
    title: 'It keeps track for you',
    body: 'Each project gets one page of what’s decided, in progress and next, updated while your computer is on. Nothing to sort by hand.'
  }
];

const PROMISES = [
  { icon: 'lock', title: 'Only your team can read it', body: 'Team projects are encrypted before they leave your computer. We can’t read them.' },
  { icon: 'key', title: 'Your own AI account', body: 'Pro uses your AI account to write boards, so you pay the AI company directly. We add no markup.' },
  { icon: 'check', title: 'Nothing shared by accident', body: 'You see the exact text before your team does.' },
  { icon: 'undo', title: 'Take it back', body: 'Withdraw anything you shared, any time.' }
];

const FAQS = [
  {
    q: 'When can I use it?',
    a: 'Not yet. We are building Pro now. Everyone on the waitlist hears first, and we will open it in small groups so everyone gets set up properly. Joining the waitlist is free, and you only pay if you decide to start once it opens.'
  },
  {
    q: 'Can I use it on my own?',
    a: 'Yes. A solo user is simply a one-seat Pro. Your boards work the same whether or not you ever invite anyone.'
  },
  {
    q: 'Do I need my own AI account?',
    a: 'Yes. Pro uses an AI you connect to write your boards: an OpenAI, Anthropic or OpenRouter API key, or a coding agent you already use, such as Claude Code, Codex or ZCode. On a team project, the admin can add one key for everyone, so teammates don’t need their own.'
  },
  {
    q: 'What does the AI provider see?',
    a: 'To write a board update, your computer sends the relevant chat text to the AI company you chose, and it processes that text. LLMnesia’s servers never see it, and team projects are encrypted so we can’t read them.'
  },
  {
    q: 'What will the AI cost me?',
    a: 'Very little. In our testing with a fast, low-cost model (GPT-6 Luna), each update cost well under a tenth of a penny, and a busy month came to around £1. Bigger models cost more. You pay the AI company directly and set a daily limit, so it can never run away.'
  },
  {
    q: 'What does it run on?',
    a: 'Pro runs in the LLMnesia browser extension on your computer. Claude Code and Codex sessions are picked up with the free desktop helper.'
  },
  {
    q: 'Can I take back something I shared?',
    a: 'Yes. Withdraw it and it disappears from LLMnesia for everyone. Copies someone already made outside LLMnesia cannot be recalled.'
  },
  {
    q: 'I already pay for Vault. What happens?',
    a: 'Vault is included in every Pro seat. When you upgrade, you get credit for the unused part of your current Vault period.'
  }
];

function PromiseIcon({ name }) {
  const paths = {
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    key: <><circle cx="8" cy="15" r="3.5" /><path d="M10.5 12.5 19 4M16 7l2.5 2.5M14 9l2 2" /></>,
    check: <><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.2 2.4 2.4 4.6-5" /></>,
    undo: <><path d="M9 7 5 11l4 4" /><path d="M5 11h9a5 5 0 0 1 0 10h-3" /></>
  };
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function ProPage() {
  return (
    <SiteChrome pagePath="/pro">
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <main id="main-content" className="pro-page">
        <section className="pro-hero">
          <div className="pro-hero-glow" aria-hidden="true" />
          <div className="container pro-hero-inner">
            <p className="pro-pill">
              <span className="pro-pill-dot" aria-hidden="true" />
              LLMnesia Pro · Coming soon
            </p>
            <h1 className="pro-title">
              Know where every project stands,{' '}
              <span className="pro-title-accent">across every AI.</span>
            </h1>
            <p className="pro-lede">
              LLMnesia saves your ChatGPT, Claude and coding-agent chats, then keeps a simple board for
              each project: what’s decided, what’s in progress, what’s next. Every item links back to
              the chat it came from.
            </p>
            <div className="pro-hero-actions">
              <a className="pro-cta" href="#waitlist">Join the waitlist</a>
              <span className="pro-hero-note">Free to join, no card needed</span>
            </div>
          </div>

          <div className="container pro-demo-wrap">
            <ProBoardDemo />
          </div>

          <div className="container pro-sources" aria-label="Works with">
            <span className="pro-sources-label">Saves your work from</span>
            {SOURCES.map((name) => (
              <span className="pro-source" key={name}>{name}</span>
            ))}
          </div>
        </section>

        <section className="pro-pain">
          <div className="container pro-pain-inner">
            <div className="pro-pain-problem">
              <p className="pro-kicker">Sound familiar?</p>
              <ul className="pro-pain-list">
                {PAINS.map((pain) => (
                  <li key={pain.text}>
                    {pain.platform ? (
                      <span className="pro-chip" data-platform={pain.platform}>{pain.label}</span>
                    ) : (
                      <span className="pro-chip pro-chip--you">You</span>
                    )}
                    <span>{pain.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pro-pain-answer">
              <h2>LLMnesia keeps track of it for you.</h2>
              <ul className="pro-outcomes">
                {OUTCOMES.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="pro-steps">
          <div className="container">
            <p className="pro-kicker pro-steps-kicker">How it works</p>
            <ol className="pro-steps-list">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <span className="pro-step-number" aria-hidden="true">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="pro-team" id="for-teams">
          <div className="container pro-team-inner">
            <div className="pro-team-copy">
              <p className="pro-kicker">For teams</p>
              <h2>Share decisions, not your whole chat history.</h2>
              <p>
                Everyone keeps using their own AI tools. When something is worth sharing, you pick it,
                check the exact wording and share it in one click. The project lead approves what goes
                on the team board, and your teammates’ AI tools can read it.
              </p>
            </div>

            <figure className="pro-share" aria-label="Design preview of the share review">
              <div className="pro-share-head">
                <span>Share to <strong>Invoicing app</strong></span>
                <span className="pro-app-badge">Design preview</span>
              </div>
              <p className="pro-share-label">Your team will see exactly this</p>
              <div className="pro-share-text">
                <p className="pro-share-card">14-day free trial, no free plan</p>
                <p>OK, 14-day trial it is.</p>
                <span className="pro-chip" data-platform="claude">Claude</span>
              </div>
              <div className="pro-share-change">
                <span className="pro-share-move">In progress</span>
                <span aria-hidden="true">→</span>
                <span className="pro-share-move pro-share-move--to">Decided</span>
              </div>
              <p className="pro-share-review">Decided changes go to Sam, the project lead, for review.</p>
              <div className="pro-share-actions">
                <span className="pro-btn">Cancel</span>
                <span className="pro-btn pro-btn--primary">Approve and share</span>
              </div>
            </figure>
          </div>
        </section>

        <section className="pro-promises">
          <div className="container">
            <h2 className="pro-promises-title">Private by default. Shared on purpose.</h2>
            <div className="pro-promises-grid">
              {PROMISES.map((item) => (
                <div className="pro-promise" key={item.title}>
                  <span className="pro-promise-icon"><PromiseIcon name={item.icon} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pro-join" id="waitlist">
          <div className="container pro-join-inner">
            <div className="pro-price" id="pricing">
              <p className="pro-kicker">Planned price at launch</p>
              <p className="pro-price-figure">
                {PRICE_MONTHLY}
                <span>per person / month</span>
              </p>
              <p className="pro-price-sub">or {PRICE_ANNUAL} a year, one month free</p>
              <p className="pro-price-for">For anyone working across more than one AI.</p>
              <ul className="pro-price-includes">
                <li>
                  <strong>LLMnesia Vault included</strong>
                  <span>End-to-end encrypted backup and sync of all your chats. £8 a month on its own.</span>
                </li>
                <li>
                  <strong>Alone or with a team</strong>
                  <span>Keep projects private, or share them with your team.</span>
                </li>
                <li>
                  <strong>Uses your own AI account</strong>
                  <span>Your board updates with your own key or coding agent.</span>
                </li>
              </ul>
              <p className="pro-price-foot">Nothing to pay now.</p>
            </div>

            <div className="pro-join-form">
              <h2>Join the waitlist.</h2>
              <p className="pro-join-sub">Free to join, no card needed. We’ll email you when Pro opens.</p>
              <ProEarlyAccessForm context="pro_page" />
            </div>
          </div>
        </section>

        <section className="pro-faq">
          <div className="container pro-faq-inner">
            <h2>Questions</h2>
            <div className="faq-list">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
