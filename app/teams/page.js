import SiteChrome from '../components/site-chrome';
import JsonLd from '../components/json-ld';
import ProEarlyAccessForm from '../components/pro-early-access-form';
import { buildPageMetadata } from '../../lib/metadata';
import { homepageFaqSchema } from '../../lib/schema';

// Early-access page for Pro (Projects and Teams). Pro is still being built, so
// every claim here must match the "safe once it ships" list in the LLMnesia
// repo's docs/TEAMS_PROJECTS_GTM_PLAN.md, and the price and packaging must match
// the Decisions table in docs/TEAMS_FIRST_PAID_TEAM.md. The board shown below is
// a labelled design preview with made-up content, never a real user's work.

export const metadata = buildPageMetadata({
  title: 'LLMnesia Pro: one project board for every AI you use (early access)',
  description:
    'LLMnesia Pro saves your AI chats and coding sessions from ChatGPT, Claude, Gemini, Claude Code and Codex, sorts them by project and keeps a project board up to date. Use it alone or invite your team. In development: join early access.',
  canonicalPath: '/teams'
});

const PRICE_MONTHLY = '£25';
const PRICE_ANNUAL = '£250';

const STEPS = [
  {
    kicker: '1',
    title: 'Every AI chat, sorted by project',
    body: 'LLMnesia saves your chats from ChatGPT, Claude, Gemini and other supported assistants, plus your Claude Code and Codex sessions. Chats go into the right project automatically where the source is clear. Anything unclear stays private until you sort it with a click.'
  },
  {
    kicker: '2',
    title: 'A board that keeps itself current',
    body: 'Each project gets a board of what is decided, what is in progress and what comes next. It updates on its own while your computer is on, so you can see where every project stands and pick up the right thread.'
  },
  {
    kicker: '3',
    title: 'Share with one deliberate click',
    body: 'When something is worth sharing, you see the exact text first and approve it. Nothing reaches your team until you say so, and your private chats stay private.'
  }
];

const BOARD = [
  {
    section: 'Decided',
    cards: [
      {
        title: 'Use Stripe Billing for invoices',
        note: 'Chosen over a custom ledger: less to maintain.',
        source: 'Claude',
        sourceKey: 'claude'
      },
      {
        title: 'Invoices are PDF and email only',
        note: 'Portal view moved to a later release.',
        source: 'ChatGPT',
        sourceKey: 'chatgpt'
      }
    ]
  },
  {
    section: 'In progress',
    cards: [
      {
        title: 'Retry failed payment webhooks',
        note: 'Backoff added; idempotency test still failing.',
        source: 'Claude Code',
        sourceKey: 'claude-code'
      }
    ]
  },
  {
    section: 'Next',
    cards: [
      {
        title: 'Write the refund email copy',
        note: 'Tone agreed: short and friendly.',
        source: 'ChatGPT',
        sourceKey: 'chatgpt'
      },
      {
        title: 'Add VAT to the invoice template',
        note: 'Rates table drafted; needs review.',
        source: 'Codex',
        sourceKey: 'codex'
      }
    ]
  }
];

const TEAM_POINTS = [
  {
    title: 'Members suggest, the project lead decides',
    body: 'Teammates and their AI suggest changes to the team board. The project lead accepts, edits or rejects them, and every card shows who decided and when.'
  },
  {
    title: 'Teammates’ AI tools can read the project',
    body: 'Any desktop AI tool that supports MCP can read the team project, so a teammate’s assistant starts with the decisions already made.'
  },
  {
    title: 'One key for the whole team',
    body: 'The project admin adds one AI provider key for the team, with a spending limit. Teammates do not need a key of their own.'
  }
];

const PRIVACY_POINTS = [
  {
    title: 'We can’t read your projects',
    body: 'Team projects are end-to-end encrypted. Our servers store them, but they cannot read what is in them.'
  },
  {
    title: 'You choose the AI that drafts updates',
    body: 'Board updates are drafted on your computer, using the AI provider and key you choose. That provider processes the text sent to it for the update. We never pay for, see or mark up those calls.'
  },
  {
    title: 'Nothing is shared without your approval',
    body: 'Filing a chat under a team project never shares it. You approve the exact text before anything reaches your team.'
  },
  {
    title: 'You can take shared material back',
    body: 'Withdraw something you shared and it disappears from LLMnesia for everyone. Copies someone already made outside LLMnesia cannot be recalled.'
  }
];

const PRICE_POINTS = [
  'Projects with boards that keep themselves current',
  'Team projects with a shared board and library',
  'Vault sync and backup for each seat',
  'Bring your own AI provider key: you pay your provider directly',
  'Use it alone, or add seats for your team'
];

const FAQS = [
  {
    q: 'When can I use it?',
    a: 'We are building Pro now. Early-access members hear first, and we will open it in small groups so everyone gets set up properly.'
  },
  {
    q: 'Can I use it on my own?',
    a: 'Yes. A solo user is simply a one-seat Pro. Your private boards work the same whether or not you ever invite anyone.'
  },
  {
    q: 'Do I need an API key?',
    a: 'Boards are updated by an AI model you supply: your own API key, or a coding agent such as Claude Code or Codex. On a team project, the admin can add one key for everyone, so teammates do not need their own.'
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
    q: 'I already pay for Vault. What happens?',
    a: 'Vault is included in every Pro seat. When you upgrade, you get credit for the unused part of your current Vault period.'
  },
  {
    q: 'Is there a free trial or an early-access discount?',
    a: 'No. Instead, early-access members get personal setup help from the founder and a real say in what we build next.'
  }
];

export default function TeamsPage() {
  return (
    <SiteChrome pagePath="/teams">
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <main id="main-content" className="teams-page">
        {/* Hero */}
        <section className="section vault-hero teams-hero">
          <div className="container vault-hero-inner teams-hero-inner">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              LLMnesia Pro · In development
            </p>
            <h1>
              Every AI you use.{' '}
              <span className="text-gradient">One project board that keeps itself current.</span>
            </h1>
            <p className="subheadline vault-hero-sub">
              ChatGPT, Claude, Gemini, Claude Code, Codex: LLMnesia saves every chat, sorts it by
              project and keeps your board up to date. Use it alone or invite your team. Nothing is
              shared until you say so.
            </p>
            <div className="teams-hero-actions">
              <a className="button button-large" href="#early-access">
                Join early access
              </a>
              <a className="teams-hero-link" href="#pricing">
                {PRICE_MONTHLY} per seat per month
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section teams-steps">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">How it works</p>
              <h2>From scattered chats to a clear next step.</h2>
            </div>
            <div className="card-grid teams-step-grid">
              {STEPS.map((step) => (
                <article className="card teams-step-card" key={step.title}>
                  <p className="teams-step-kicker" aria-hidden="true">{step.kicker}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Design preview of the board */}
        <section className="section teams-preview">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">Design preview</p>
              <h2>Where every project stands, at a glance.</h2>
              <p className="section-intro">
                An example board for a made-up invoicing app, built across four different AI tools.
                The finished product may look different.
              </p>
            </div>
            <figure className="teams-board" aria-label="Design preview of an LLMnesia project board">
              <div className="teams-board-head">
                <span className="teams-board-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="teams-board-title">Invoicing app</span>
                <span className="teams-board-badge">Design preview</span>
              </div>
              <div className="teams-board-columns">
                {BOARD.map((column) => (
                  <div className="teams-board-column" key={column.section}>
                    <p className="teams-board-section">
                      {column.section}
                      <span className="teams-board-count">{column.cards.length}</span>
                    </p>
                    {column.cards.map((card) => (
                      <article className="teams-board-card" key={card.title}>
                        <h3>{card.title}</h3>
                        <p>{card.note}</p>
                        <span className="teams-board-source" data-source={card.sourceKey}>
                          {card.source}
                        </span>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
              <figcaption className="teams-board-caption">
                Illustration with made-up content. Not real customer data.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Teams */}
        <section className="section teams-team">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">For teams</p>
              <h2>Your team’s AI work, on one board.</h2>
              <p className="section-intro">
                Everyone keeps using the AI tools they like. The board brings the decisions and next
                steps together, and the project lead stays in charge of what it says.
              </p>
            </div>
            <div className="card-grid teams-point-grid">
              {TEAM_POINTS.map((point) => (
                <article className="card teams-point-card" key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="section teams-privacy">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow">Privacy</p>
              <h2>Private by default. Shared on purpose.</h2>
            </div>
            <div className="card-grid teams-privacy-grid">
              {PRIVACY_POINTS.map((point) => (
                <article className="card teams-point-card" key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Price and early access */}
        <section className="section teams-join" id="pricing">
          <div className="container teams-join-inner">
            <article className="card vault-plan-card vault-plan-card-featured teams-price-card">
              <p className="section-eyebrow">Pro pricing</p>
              <p className="vault-plan-price">
                <span className="vault-plan-price-main">{PRICE_MONTHLY}</span>
                <span className="vault-plan-price-unit">per seat / month</span>
              </p>
              <p className="vault-plan-price-sub">
                Or {PRICE_ANNUAL} per seat a year, two months free. No minimum number of seats.
              </p>
              <ul className="vault-pricing-points vault-plan-points">
                {PRICE_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="teams-price-foot">
                Early-access members get personal setup help from the founder and a say in what we
                build next.
              </p>
            </article>

            <div className="teams-join-form" id="early-access">
              <p className="section-eyebrow">Early access</p>
              <h2>Be first in when it opens.</h2>
              <p className="section-intro">
                Three quick questions help us build the right thing and set you up properly.
              </p>
              <ProEarlyAccessForm context="teams_page" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section teams-faq">
          <div className="container">
            <p className="section-eyebrow">Good to know</p>
            <h2>Questions people ask.</h2>
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
