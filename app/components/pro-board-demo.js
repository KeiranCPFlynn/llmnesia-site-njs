'use client';

import { useState } from 'react';

// Interactive design preview of Pro for /pro. Everything here is made-up
// content. The page copies the real Projects page in the extension
// (extension/src/pages/projects.ts) as closely as a web page can: the heading
// and subtitle, the project picker with Retry, the freshness line, the
// Decided / In progress / Next tabs, and cards with a title, a status, a
// summary, a kind ("Decision claim", "Explicit commitment", "Recommendation",
// "Verified complete") and an "Open source chat" link above each quote.
// Opening a chat shows it as the LLMnesia viewer does, with "Continue in".
// Nothing here shows a feature the product does not have.
//
// Three numbered steps above it tell the story in order: the chat in the
// assistant, the Projects page it fed, then the source chat opened from it.
// Clicking a step shows that view, and the reader can click around freely.

const PLATFORMS = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  'claude-code': 'Claude Code',
  codex: 'Codex'
};

const PROJECTS = [
  { id: 'invoicing', name: 'Invoicing app' },
  { id: 'launch', name: 'Launch website' }
];

// Every quote below appears word for word in one of these chats, so the chat
// view can highlight exactly what the card is based on.
const CHATS = {
  'trial-pricing': {
    platform: 'claude', project: 'invoicing', title: 'Free trial or free plan?', when: 'Just now',
    lines: [
      { you: true, text: 'Free plan or free trial for launch?' },
      { text: 'For a small team, a 14-day trial usually works better. People try everything, then decide.' },
      { you: true, text: 'OK, 14-day trial it is. Next I’ll write the emails that go out before the trial ends.' }
    ]
  },
  headline: {
    platform: 'chatgpt', project: 'launch', title: 'Homepage headline ideas', when: 'Today',
    lines: [
      { you: true, text: 'Which of these headlines is strongest?' },
      { text: 'The second one. Lead with the time saved, not the feature list.' },
      { you: true, text: 'Agreed, the time saved goes first.' }
    ]
  },
  refunds: {
    platform: 'claude-code', project: 'invoicing', title: 'Refund endpoint', when: 'Yesterday',
    lines: [
      { you: true, text: 'Build the refund endpoint.' },
      { text: 'Full refunds work end to end. Partial refunds still need their own test.' }
    ]
  },
  'launch-post': {
    platform: 'gemini', project: 'launch', title: 'Launch blog post outline', when: 'Yesterday',
    lines: [
      { you: true, text: 'Outline a launch post for the new site.' },
      { text: 'Here’s an outline in five sections, from the problem to the call to action.' },
      { you: true, text: 'Good. I’ll write the full draft on Friday.' }
    ]
  },
  vat: {
    platform: 'codex', project: 'invoicing', title: 'Invoice PDF renderer', when: 'Wed',
    lines: [
      { you: true, text: 'Render each invoice as a PDF.' },
      { text: 'The PDF renderer works. Add VAT lines before you invoice UK customers.' }
    ]
  },
  stripe: {
    platform: 'claude', project: 'invoicing', title: 'Stripe or our own billing?', when: 'Mon',
    lines: [
      { you: true, text: 'Should we build our own billing or use Stripe?' },
      { text: 'Stripe handles invoices, receipts and failed payments. Your own system means weeks of work and upkeep.' },
      { you: true, text: 'Building our own is weeks of work. Stripe it is.' }
    ]
  },
  webhooks: {
    platform: 'claude-code', project: 'invoicing', title: 'Payment webhooks', when: 'Mon',
    lines: [
      { you: true, text: 'Run the webhook tests against the Stripe test account.' },
      { text: 'All passing. Payment webhooks are live and tested.' }
    ]
  }
};

// The chat the story follows: step 1 shows it, step 3 opens it.
const FIRST_CHAT = 'trial-pricing';

// The steps. Each one shows the view it describes.
const GUIDE = [
  {
    id: 'chat',
    title: 'You chat in any AI',
    body: 'ChatGPT, Claude, Gemini, Claude Code, Codex. LLMnesia saves each chat as you go.'
  },
  {
    id: 'decided',
    title: 'It sorts them into projects by itself',
    body: 'No tagging or copying. LLMnesia reads your new chats and keeps each project page up to date: what’s decided, in progress and next.'
  },
  {
    id: 'next',
    title: 'Click to check or carry on',
    body: 'Open the chat behind any item, then pick up there or continue it in another AI.'
  }
];

// Work items shaped like the real board: a title, a status, a summary and
// evidence, plus any decision claims and a next action, each with its quote.
const ev = (chat, quote) => [{ chat, quote }];
const CARDS = [
  {
    id: 'pricing', project: 'invoicing', title: 'Launch pricing', status: 'active',
    summary: 'Trial length decided. The trial-ending emails are still to write.',
    evidence: ev('trial-pricing', 'OK, 14-day trial it is.'),
    claims: [{ text: '14-day free trial, no free plan.', evidence: ev('trial-pricing', 'OK, 14-day trial it is.') }],
    next: { text: 'Write the emails that go out before the trial ends.', basis: 'explicit', evidence: ev('trial-pricing', 'Next I’ll write the emails that go out before the trial ends.') }
  },
  {
    id: 'billing', project: 'invoicing', title: 'Billing provider', status: 'active',
    summary: 'Stripe chosen. Webhooks are done.',
    evidence: ev('stripe', 'Stripe it is.'),
    claims: [{ text: 'Use Stripe for billing, not our own system.', evidence: ev('stripe', 'Building our own is weeks of work. Stripe it is.') }]
  },
  {
    id: 'refunds', project: 'invoicing', title: 'Refund flow', status: 'active',
    summary: 'Full refunds work. Partial refunds still need a test.',
    evidence: ev('refunds', 'Full refunds work end to end. Partial refunds still need their own test.'),
    next: { text: 'Add a test for partial refunds.', basis: 'recommendation', evidence: ev('refunds', 'Partial refunds still need their own test.') }
  },
  {
    id: 'pdf', project: 'invoicing', title: 'Invoice PDFs', status: 'waiting',
    summary: 'The renderer works. VAT lines are needed before UK customers are invoiced.',
    evidence: ev('vat', 'The PDF renderer works.'),
    next: { text: 'Add VAT lines to the invoice PDF.', basis: 'recommendation', evidence: ev('vat', 'Add VAT lines before you invoice UK customers.') }
  },
  {
    id: 'webhooks', project: 'invoicing', title: 'Payment webhooks', status: 'verified_complete',
    summary: 'Live and tested against the Stripe test account.',
    evidence: ev('webhooks', 'Payment webhooks are live and tested.')
  },
  {
    id: 'headline', project: 'launch', title: 'Homepage headline', status: 'active',
    summary: 'Headline direction chosen. Final wording to come.',
    evidence: ev('headline', 'Lead with the time saved, not the feature list.'),
    claims: [{ text: 'Lead with the time saved, not the feature list.', evidence: ev('headline', 'Agreed, the time saved goes first.') }]
  },
  {
    id: 'launch-post', project: 'launch', title: 'Launch blog post', status: 'active',
    summary: 'Outline done. The full draft is still to write.',
    evidence: ev('launch-post', 'Here’s an outline in five sections'),
    next: { text: 'Write the full draft of the launch post.', basis: 'explicit', evidence: ev('launch-post', 'I’ll write the full draft on Friday.') }
  }
];

const TABS = [
  { id: 'decided', label: 'Decided' },
  { id: 'progress', label: 'In progress' },
  { id: 'next', label: 'Next' }
];

const IN_PROGRESS_STATUSES = ['active', 'waiting', 'parked'];
const KIND_LABELS = { explicit: 'Explicit commitment', recommendation: 'Recommendation' };
const CONTINUE_TARGETS = ['chatgpt', 'gemini', 'claude', 'claude-code'];

const statusText = (status) => status.replaceAll('_', ' ');

// The quotes a chat backs, across every card, so the chat view can mark them.
function quotesFor(chatId) {
  const refs = CARDS.flatMap((card) => [
    ...card.evidence,
    ...(card.claims || []).flatMap((claim) => claim.evidence),
    ...(card.next ? card.next.evidence : [])
  ]);
  return refs.filter((ref) => ref.chat === chatId).map((ref) => ref.quote);
}

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

// "Open source chat" above the quote, as the real page lists evidence.
function Evidence({ refs, onOpen }) {
  return (
    <ul className="pro-evidence">
      {refs.map((ref) => (
        <li key={ref.quote}>
          <button type="button" className="pro-evidence-link" onClick={() => onOpen(ref.chat)}>
            Open source chat
          </button>
          <span className="pro-evidence-quote">“{ref.quote}”</span>
        </li>
      ))}
    </ul>
  );
}

function Card({ card, summary, kind, refs, onOpen }) {
  return (
    <article className="pro-project-card">
      <h4>{card.title}</h4>
      <span className="pro-project-pill">{statusText(card.status)}</span>
      <p className="pro-project-summary">{summary}</p>
      {kind ? <span className="pro-project-pill">{kind}</span> : null}
      <Evidence refs={refs} onOpen={onOpen} />
    </article>
  );
}

function ProjectPage({ project, onProject, tab, onTab, onOpenChat }) {
  const cards = CARDS.filter((card) => card.project === project);
  const completed = cards.filter((card) => card.status === 'verified_complete');

  return (
    <div className="pro-project">
      <div className="pro-project-head">
        <div>
          <p className="pro-project-h1">Projects</p>
          <p className="pro-project-sub">Your private project work, kept in your Vault.</p>
        </div>
        <span className="pro-project-button">Open Vault settings</span>
      </div>

      <div className="pro-project-controls">
        <select
          className="pro-project-select"
          aria-label="Private project"
          value={project}
          onChange={(event) => onProject(event.target.value)}
        >
          {PROJECTS.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <span className="pro-project-button">Retry</span>
      </div>
      <p className="pro-project-fresh">Updated just now</p>

      <div className="pro-project-tabs">
        {TABS.map((t) => (
          <button
            type="button"
            key={t.id}
            aria-pressed={tab === t.id}
            className="pro-project-tab"
            onClick={() => onTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pro-project-list">
        {tab === 'decided'
          ? cards.flatMap((card) =>
              (card.claims || []).map((claim) => (
                <Card
                  key={`${card.id}-${claim.text}`}
                  card={card}
                  summary={claim.text}
                  kind="Decision claim"
                  refs={claim.evidence}
                  onOpen={onOpenChat}
                />
              ))
            )
          : null}

        {tab === 'progress'
          ? cards
              .filter((card) => IN_PROGRESS_STATUSES.includes(card.status))
              .map((card) => (
                <Card key={card.id} card={card} summary={card.summary} refs={card.evidence} onOpen={onOpenChat} />
              ))
          : null}

        {tab === 'next'
          ? cards
              .filter((card) => card.next)
              .map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  summary={card.next.text}
                  kind={KIND_LABELS[card.next.basis]}
                  refs={card.next.evidence}
                  onOpen={onOpenChat}
                />
              ))
          : null}
      </div>

      {tab === 'progress' && completed.length ? (
        <details className="pro-project-completed">
          <summary>Completed work ({completed.length})</summary>
          <div className="pro-project-list">
            {completed.map((card) => (
              <Card key={card.id} card={card} summary={card.summary} kind="Verified complete" refs={card.evidence} onOpen={onOpenChat} />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

// A chat as the LLMnesia viewer shows it: the quoted lines highlighted, and
// "Continue in" to carry it on in another assistant.
function ChatView({ chatId, onBack }) {
  const chat = CHATS[chatId];
  const quotes = quotesFor(chatId);
  const projectName = PROJECTS.find((item) => item.id === chat.project).name;
  return (
    <div className="pro-viewer">
      <div className="pro-viewer-head">
        <button type="button" className="pro-viewer-back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to project
        </button>
        <p className="pro-viewer-title">
          <Platform id={chat.platform} /> {chat.title}
        </p>
        <p className="pro-viewer-meta">{chat.when} · {projectName}</p>
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

// A chat as it happens in the assistant itself, before LLMnesia does anything.
function AiChat({ chatId }) {
  const chat = CHATS[chatId];
  return (
    <div className="pro-aichat">
      <p className="pro-aichat-title">{chat.title}</p>
      <div className="pro-window-body">
        {chat.lines.map((line) => (
          <div key={line.text} className={`pro-line${line.you ? ' pro-line--you' : ''}`}>
            <span className="pro-line-who">{line.you ? 'You' : PLATFORMS[chat.platform]}</span>
            <p>{line.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProBoardDemo() {
  // 'ai' is the chat in the assistant (step 1), 'project' the Projects page
  // (step 2) and 'viewer' a source chat opened from it (step 3).
  const [view, setView] = useState('ai');
  const [project, setProject] = useState('invoicing');
  const [tab, setTab] = useState('decided');
  const [chatId, setChatId] = useState(FIRST_CHAT);
  const step = view === 'ai' ? 0 : view === 'project' ? 1 : 2;

  const show = (index) => {
    if (index === 0) {
      setView('ai');
    } else if (index === 1) {
      setProject('invoicing');
      setTab('decided');
      setView('project');
    } else {
      setChatId(FIRST_CHAT);
      setView('viewer');
    }
  };

  const openChat = (id) => {
    setChatId(id);
    setView('viewer');
  };

  const barName = view === 'ai' ? PLATFORMS[CHATS[FIRST_CHAT].platform] : 'LLMnesia · Projects';
  const last = step === GUIDE.length - 1;

  return (
    <div className="pro-demo">
      <ol className="pro-guide">
        {GUIDE.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={`pro-guide-item${step === index ? ' is-on' : ''}`}
              aria-pressed={step === index}
              onClick={() => show(index)}
            >
              <span className="pro-guide-num" aria-hidden="true">{index + 1}</span>
              <span className="pro-guide-text">
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="pro-app">
        <div className="pro-app-bar">
          <span className="pro-app-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="pro-app-name">{barName}</span>
          <span className="pro-app-badge">Design preview</span>
        </div>
        <div className="pro-scene">
          {view === 'ai' ? <AiChat chatId={FIRST_CHAT} /> : null}
          {view === 'project' ? (
            <ProjectPage project={project} onProject={setProject} tab={tab} onTab={setTab} onOpenChat={openChat} />
          ) : null}
          {view === 'viewer' ? <ChatView chatId={chatId} onBack={() => setView('project')} /> : null}
        </div>
        <div className="pro-app-foot">
          <span className="pro-app-hint">Everything in the preview is clickable.</span>
          <button type="button" className="pro-app-next" onClick={() => show(last ? 0 : step + 1)}>
            {last ? 'Start again' : `Next: ${GUIDE[step + 1].title}`} <span aria-hidden="true">{last ? '↺' : '→'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
