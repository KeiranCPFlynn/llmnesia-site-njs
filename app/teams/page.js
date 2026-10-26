import SiteChrome from '../components/site-chrome';
import JsonLd from '../components/json-ld';
import ProBoardDemo from '../components/pro-board-demo';
import ProEarlyAccessForm from '../components/pro-early-access-form';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

// Early-access page for Pro (Projects and Teams). Pro is still being built, so
// every claim here must match the "safe once it ships" list in the LLMnesia
// repo's docs/TEAMS_PROJECTS_GTM_PLAN.md, and the price and packaging must match
// the Decisions table in docs/TEAMS_FIRST_PAID_TEAM.md. The board is a labelled
// design preview with made-up content, never a real user's work.

export const metadata = buildPageMetadata({
  title: 'LLMnesia Pro: a project board that keeps itself current (early access)',
  description:
    'LLMnesia Pro turns your ChatGPT, Claude, Gemini, Claude Code and Codex chats into a project board of what is decided, in progress and next, with every card linked to the chats behind it. Use it alone or with your team. Join early access.',
  canonicalPath: '/teams'
});

// Keep in step with the Decisions table (decision 2) before publishing.
const PRICE_MONTHLY = '£25';
const PRICE_ANNUAL = '£250';

const SOURCES = ['ChatGPT', 'Claude', 'Gemini', 'Claude Code', 'Codex', 'and more'];

const MOMENTS = [
  {
    label: 'See',
    title: 'Where every project stands.',
    body: 'Decided, in progress and next, kept up to date from your AI chats while your computer is on.'
  },
  {
    label: 'Trust',
    title: 'Every card shows its source.',
    body: 'Each decision and next step quotes the chat it came from, one click away.'
  },
  {
    label: 'Resume',
    title: 'Pick up where you left off.',
    body: 'Continue in the right chat or coding agent, with the context already there.'
  }
];

const PROMISES = [
  { icon: 'lock', title: 'End-to-end encrypted', body: 'Our servers can’t read your projects.' },
  { icon: 'key', title: 'Your AI, your key', body: 'Updates use the provider you choose. We never mark up model costs.' },
  { icon: 'check', title: 'Shared only with approval', body: 'You see the exact text before your team does.' },
  { icon: 'undo', title: 'Take it back', body: 'Withdraw anything you shared, any time.' }
];

const PRICE_POINTS = [
  'Self-updating boards for every project',
  'Team projects with a shared board',
  'Vault sync and backup included',
  'Bring your own AI key',
  'Use it alone or add seats'
];

const FAQS = [
  {
    q: 'When can I use it?',
    a: 'We are building Pro now. Early-access members hear first, and we will open it in small groups so everyone gets set up properly.'
  },
  {
    q: 'Can I use it on my own?',
    a: 'Yes. A solo user is simply a one-seat Pro. Your boards work the same whether or not you ever invite anyone.'
  },
  {
    q: 'Do I need an API key?',
    a: 'Boards are updated by an AI model you supply: your own API key, or a coding agent such as Claude Code or Codex. On a team project, the admin can add one key for everyone, so teammates do not need their own.'
  },
  {
    q: 'What does the AI provider see?',
    a: 'Board updates are drafted on your computer and sent to the AI provider you chose, which processes that text. LLMnesia’s servers never see it, and team projects are stored end-to-end encrypted.'
  },
  {
    q: 'What will the AI cost me?',
    a: 'It depends on how much you use it. You pay your AI provider directly, and you set a daily limit so updates pause rather than overspend.'
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
  },
  {
    q: 'Is there a free trial or an early-access discount?',
    a: 'No. Instead, early-access members get personal setup help from the founder and a real say in what we build next.'
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

export default function TeamsPage() {
  return (
    <SiteChrome pagePath="/teams">
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <main id="main-content" className="pro-page">
        <section className="pro-hero">
          <div className="pro-hero-glow" aria-hidden="true" />
          <div className="container pro-hero-inner">
            <p className="pro-pill">
              <span className="pro-pill-dot" aria-hidden="true" />
              LLMnesia Pro · Early access
            </p>
            <h1 className="pro-title">
              Your AI chats,
              <br />
              <span className="pro-title-accent">now a project board.</span>
            </h1>
            <p className="pro-lede">
              A board of what’s decided, in progress and next, that keeps itself current. Every card
              links to the chats behind it.
            </p>
            <div className="pro-hero-actions">
              <a className="pro-cta" href="#early-access">Join early access</a>
              <span className="pro-hero-note">Use it alone or with your team</span>
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

        <section className="pro-moments">
          <div className="container pro-moments-grid">
            {MOMENTS.map((moment, index) => (
              <article className="pro-moment" key={moment.label}>
                <p className="pro-moment-label">
                  <span>0{index + 1}</span> {moment.label}
                </p>
                <h2>{moment.title}</h2>
                <p>{moment.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pro-team">
          <div className="container pro-team-inner">
            <div className="pro-team-copy">
              <p className="pro-kicker">For teams</p>
              <h2>Share decisions, not your whole chat history.</h2>
              <p>
                Everyone keeps their own AI tools. Share a card or excerpt in one click, the project
                lead approves what lands, and teammates’ AI tools can read the team board.
              </p>
            </div>

            <figure className="pro-share" aria-label="Design preview of the share review">
              <div className="pro-share-head">
                <span>Share to <strong>Invoicing app</strong></span>
                <span className="pro-app-badge">Design preview</span>
              </div>
              <p className="pro-share-label">Your team will see exactly this</p>
              <div className="pro-share-text">
                <p className="pro-share-card">Retry failed payment webhooks</p>
                <p>Retries are keyed on the Stripe event ID, so a replay can never charge twice.</p>
                <span className="pro-chip" data-platform="codex">Codex</span>
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

        <section className="pro-join" id="early-access">
          <div className="container pro-join-inner">
            <div className="pro-price" id="pricing">
              <p className="pro-kicker">Pro</p>
              <p className="pro-price-figure">
                {PRICE_MONTHLY}
                <span>per seat / month</span>
              </p>
              <p className="pro-price-sub">or {PRICE_ANNUAL} a year, two months free</p>
              <ul className="pro-price-list">
                {PRICE_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="pro-price-foot">
                Early-access members get personal setup help from the founder and a say in what we
                build next.
              </p>
            </div>

            <div className="pro-join-form">
              <h2>Get early access.</h2>
              <p className="pro-join-sub">Three quick taps, then your email.</p>
              <ProEarlyAccessForm context="teams_page" />
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
