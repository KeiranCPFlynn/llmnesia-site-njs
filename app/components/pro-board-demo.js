'use client';

import { useState } from 'react';

// Interactive design preview of Pro for /pro. Everything here is made-up
// content for a fictional invoicing app. The project page mirrors the real Projects page in the extension (extension/src/pages/
// projects.ts): a project picker, a freshness line, Decided / In progress /
// Next tabs, and items that quote their chat with an "Open source chat" link.
// Opening a chat shows it as the LLMnesia viewer does, with "Continue in".
// Nothing here shows a feature the product does not have.
//
// The reader clicks around it freely. Three numbered captions beside it say
// what is going on, and clicking a caption shows that part of the page.

const PLATFORMS = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  'claude-code': 'Claude Code',
  codex: 'Codex'
};

// Every quote below appears word for word in one of these chats, so the chat
// view can highlight exactly what the project item is based on.
const CHATS = {
  'trial-pricing': {
    platform: 'claude', title: 'Free trial or free plan?', when: 'Just now',
    lines: [
      { you: true, text: 'Free plan or free trial for launch?' },
      { text: 'For a small team, a 14-day trial usually works better. People try everything, then decide.' },
      { you: true, text: 'OK, 14-day trial it is. Next I’ll write the emails that go out before the trial ends.' }
    ]
  },
  stripe: {
    platform: 'claude', title: 'Stripe or our own billing?', when: 'Mon',
    lines: [
      { you: true, text: 'Should we build our own billing or use Stripe?' },
      { text: 'Stripe handles invoices, receipts and failed payments. Your own system means weeks of work and upkeep.' },
      { you: true, text: 'Building our own is weeks of work. Stripe it is.' }
    ]
  },
  invoices: {
    platform: 'chatgpt', title: 'How should invoices reach customers?', when: 'Tue',
    lines: [
      { you: true, text: 'Do customers need a portal to see their invoices?' },
      { text: 'Most small customers just want the PDF by email.' },
      { you: true, text: 'Portal can wait. PDF plus email covers every customer we have.' }
    ]
  },
  refunds: {
    platform: 'claude-code', title: 'Refund endpoint', when: 'Yesterday',
    lines: [
      { you: true, text: 'Build the refund endpoint.' },
      { text: 'Full refunds work end to end. Partial refunds still need their own test.' }
    ]
  },
  'email-design': {
    platform: 'gemini', title: 'Invoice email design', when: 'Wed',
    lines: [
      { you: true, text: 'Can you mock up the invoice email?' },
      { text: 'Here’s a first layout. Swap in your real logo when Sam sends the files.' }
    ]
  },
  webhooks: {
    platform: 'claude-code', title: 'Payment webhooks', when: 'Mon',
    lines: [
      { you: true, text: 'Run the webhook tests against the Stripe test account.' },
      { text: 'All passing. Payment webhooks are live and tested.' }
    ]
  },
  vat: {
    platform: 'codex', title: 'Invoice PDF renderer', when: 'Wed',
    lines: [
      { you: true, text: 'Render each invoice as a PDF.' },
      { text: 'The PDF renderer works. Add VAT lines before you invoice UK customers.' }
    ]
  }
};

// The chat the first caption opens.
const FIRST_CHAT = 'trial-pricing';

// The project, shaped like the real board: decisions, cards and next actions,
// each with the quote it rests on.
const DECIDED = [
  { id: 'trial', text: '14-day free trial, no free plan', quote: 'OK, 14-day trial it is.', chat: FIRST_CHAT },
  { id: 'stripe', text: 'Use Stripe for billing, not our own system', quote: 'Building our own is weeks of work. Stripe it is.', chat: 'stripe' },
  { id: 'pdf', text: 'Invoices go out as a PDF by email. No customer portal yet.', quote: 'Portal can wait. PDF plus email covers every customer we have.', chat: 'invoices' }
];

const IN_PROGRESS = [
  { id: 'refunds', title: 'Refund flow', status: 'Active', summary: 'Full refunds work. Partial refunds still need a test.', quote: 'Full refunds work end to end. Partial refunds still need their own test.', chat: 'refunds' },
  { id: 'email', title: 'Invoice email design', status: 'Waiting', summary: 'First layout done. Waiting on the logo files from Sam.', quote: 'Swap in your real logo when Sam sends the files.', chat: 'email-design' }
];

const COMPLETED = [
  { id: 'webhooks', title: 'Payment webhooks', status: 'Verified complete', summary: 'Live and tested against Stripe.', quote: 'Payment webhooks are live and tested.', chat: 'webhooks' }
];

const NEXT = [
  { id: 'emails', text: 'Write the emails that go out before the trial ends', basis: 'You said you’d do this', quote: 'Next I’ll write the emails that go out before the trial ends.', chat: FIRST_CHAT },
  { id: 'vat', text: 'Add VAT lines to the invoice PDF', basis: 'Suggested', quote: 'Add VAT lines before you invoice UK customers.', chat: 'vat' }
];

const TABS = [
  { id: 'decided', label: 'Decided' },
  { id: 'progress', label: 'In progress' },
  { id: 'next', label: 'Next' }
];

const CONTINUE_TARGETS = ['chatgpt', 'gemini', 'claude', 'claude-code'];

// The captions. Each one shows the part of the page it describes.
const GUIDE = [
  {
    id: 'chat',
    title: 'You chat in any AI',
    body: 'ChatGPT, Claude, Gemini, Claude Code, Codex. LLMnesia saves each chat as you go.'
  },
  {
    id: 'decided',
    title: 'It writes down where things stand',
    body: 'Each project gets one page: what’s decided, in progress and next, quoting your own words.'
  },
  {
    id: 'next',
    title: 'Click to check or carry on',
    body: 'Open the chat behind any item, then pick up there or continue it in another AI.'
  }
];

function Platform({ id }) {
  return (
    <span className="pro-chip" data-platform={id}>
      {PLATFORMS[id]}
    </span>
  );
}

// Highlights every quoted passage in a line, in the order they appear.
function withMark(text, quotes) {
  const found = quotes
    .map((quote) => ({ quote, start: text.indexOf(quote) }))
    .filter((hit) => hit.start >= 0)
    .sort((a, b) => a.start - b.start);
  if (!found.length) return text;
  const parts = [];
  let at = 0;
  for (const { quote, start } of found) {
    if (start < at) continue;
    parts.push(text.slice(at, start), <mark key={start}>{quote}</mark>);
    at = start + quote.length;
  }
  parts.push(text.slice(at));
  return parts;
}

const ALL_ITEMS = [...DECIDED, ...IN_PROGRESS, ...COMPLETED, ...NEXT];
const quotesFor = (chatId) => ALL_ITEMS.filter((item) => item.chat === chatId).map((item) => item.quote);

// One quote with its link back to the chat, as the real page shows it.
function Evidence({ item, onOpen }) {
  const chat = CHATS[item.chat];
  return (
    <div className="pro-evidence">
      <span className="pro-evidence-quote">“{item.quote}”</span>
      <span className="pro-evidence-row">
        <span className="pro-evidence-source">
          <Platform id={chat.platform} /> {chat.title} · {chat.when}
        </span>
        <button
          type="button"
          className="pro-evidence-link"
          onClick={() => onOpen?.(item.chat)}
        >
          Open source chat
        </button>
      </span>
    </div>
  );
}

// The project page.
function ProjectPage({ tab, onTab, onOpenChat }) {
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="pro-project">
      <p className="pro-project-h1">Projects</p>
      <p className="pro-project-sub">Your project work, kept in your Vault.</p>
      <div className="pro-project-controls">
        <span className="pro-project-select">
          Invoicing app <span aria-hidden="true">▾</span>
        </span>
        <span className="pro-project-fresh">Updated just now</span>
      </div>

      <div className="pro-project-tabs" role="tablist" aria-label="Project sections">
        {TABS.map((t) => (
          <button
            type="button"
            role="tab"
            key={t.id}
            aria-selected={tab === t.id}
            className={`pro-project-tab${tab === t.id ? ' is-on' : ''}`}
            onClick={() => onTab?.(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pro-project-list" role="tabpanel">
        {tab === 'decided'
          ? DECIDED.map((item) => (
              <article key={item.id} className="pro-project-card">
                <h4>{item.text}</h4>
                <Evidence item={item} onOpen={onOpenChat} />
              </article>
            ))
          : null}

        {tab === 'progress' ? (
          <>
            {IN_PROGRESS.map((item) => (
              <article key={item.id} className="pro-project-card">
                <h4>{item.title}</h4>
                <span className={`pro-project-status is-${item.status.toLowerCase()}`}>{item.status}</span>
                <p className="pro-project-summary">{item.summary}</p>
                <Evidence item={item} onOpen={onOpenChat} />
              </article>
            ))}
            <div className="pro-project-completed">
              <button type="button" onClick={() => setShowCompleted((open) => !open)} aria-expanded={showCompleted}>
                <span aria-hidden="true">{showCompleted ? '▾' : '▸'}</span> Completed work ({COMPLETED.length})
              </button>
              {showCompleted
                ? COMPLETED.map((item) => (
                    <article key={item.id} className="pro-project-card">
                      <h4>{item.title}</h4>
                      <span className="pro-project-status is-done">{item.status}</span>
                      <p className="pro-project-summary">{item.summary}</p>
                      <Evidence item={item} onOpen={onOpenChat} />
                    </article>
                  ))
                : null}
            </div>
          </>
        ) : null}

        {tab === 'next'
          ? NEXT.map((item) => (
              <article key={item.id} className="pro-project-card">
                <h4>{item.text}</h4>
                <span className="pro-project-status">{item.basis}</span>
                <Evidence item={item} onOpen={onOpenChat} />
              </article>
            ))
          : null}
      </div>
    </div>
  );
}

// A chat as the LLMnesia viewer shows it: the quoted lines highlighted, and
// "Continue in" to carry it on in another assistant.
function ChatView({ chatId, onBack }) {
  const chat = CHATS[chatId];
  const quotes = quotesFor(chatId);
  return (
    <div className="pro-viewer">
      <div className="pro-viewer-head">
        {onBack ? (
          <button type="button" className="pro-viewer-back" onClick={onBack}>
            <span aria-hidden="true">←</span> Back to project
          </button>
        ) : null}
        <p className="pro-viewer-title">
          <Platform id={chat.platform} /> {chat.title}
        </p>
        <p className="pro-viewer-meta">{chat.when} · Invoicing app</p>
      </div>
      <div className="pro-window-body">
        {chat.lines.map((line) => (
          <div key={line.text} className={`pro-line${line.you ? ' pro-line--you' : ''}`}>
            <span className="pro-line-who">{line.you ? 'You' : PLATFORMS[chat.platform]}</span>
            <p>{withMark(line.text, quotes)}</p>
          </div>
        ))}
      </div>
      <div className="pro-viewer-foot">
        <span className="pro-viewer-open">Open in {PLATFORMS[chat.platform]}</span>
        <span className="pro-viewer-continue">
          <span>Continue in</span>
          {CONTINUE_TARGETS.filter((id) => id !== chat.platform).slice(0, 3).map((id) => (
            <span key={id} className="pro-viewer-target">{PLATFORMS[id]}</span>
          ))}
        </span>
      </div>
    </div>
  );
}

export default function ProBoardDemo() {
  const [tab, setTab] = useState('decided');
  const [openChat, setOpenChat] = useState(null);
  const active = openChat ? 'chat' : tab === 'progress' ? 'decided' : tab;

  const show = (id) => {
    if (id === 'chat') {
      setOpenChat(FIRST_CHAT);
      return;
    }
    setOpenChat(null);
    setTab(id);
  };

  return (
    <div className="pro-demo">
      <ol className="pro-guide">
        {GUIDE.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={`pro-guide-item${active === item.id ? ' is-on' : ''}`}
              aria-pressed={active === item.id}
              onClick={() => show(item.id)}
            >
              <span className="pro-guide-num" aria-hidden="true">{index + 1}</span>
              <span className="pro-guide-text">
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </span>
            </button>
          </li>
        ))}
        <li className="pro-guide-hint">Try it: everything in the preview is clickable.</li>
      </ol>

      <div className="pro-app">
        <div className="pro-app-bar">
          <span className="pro-app-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="pro-app-name">LLMnesia · Projects</span>
          <span className="pro-app-badge">Design preview</span>
        </div>
        <div className="pro-scene">
          {openChat ? (
            <ChatView chatId={openChat} onBack={() => setOpenChat(null)} />
          ) : (
            <ProjectPage tab={tab} onTab={setTab} onOpenChat={setOpenChat} />
          )}
        </div>
      </div>
    </div>
  );
}
