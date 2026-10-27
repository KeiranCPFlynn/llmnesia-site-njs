'use client';

import { useEffect, useRef, useState } from 'react';

// Interactive design preview of Pro for /pro. Everything here is made-up
// content for a fictional invoicing app. The project page in steps 2 to 4
// mirrors the real Projects page in the extension (extension/src/pages/
// projects.ts): a project picker, a freshness line, Decided / In progress /
// Next tabs, and items that quote their chat with an "Open source chat" link.
// Opening a chat shows it as the LLMnesia viewer does, with "Continue in".
// Nothing here shows a feature the product does not have.
//
// It is a four-step tour the reader moves through: you chat, LLMnesia adds it
// to the project, you pick up where you left off, then the project page to
// explore. One idea per step, and nothing advances on its own.

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

const NEW_CHAT = 'trial-pricing';

// The project, shaped like the real board: decisions, cards and next actions,
// each with the quote it rests on. `isNew` items come from the new chat.
const DECIDED = [
  { id: 'trial', text: '14-day free trial, no free plan', quote: 'OK, 14-day trial it is.', chat: NEW_CHAT, isNew: true },
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
  { id: 'emails', text: 'Write the emails that go out before the trial ends', basis: 'You said you’d do this', quote: 'Next I’ll write the emails that go out before the trial ends.', chat: NEW_CHAT, isNew: true },
  { id: 'vat', text: 'Add VAT lines to the invoice PDF', basis: 'Suggested', quote: 'Add VAT lines before you invoice UK customers.', chat: 'vat' }
];

const TABS = [
  { id: 'decided', label: 'Decided' },
  { id: 'progress', label: 'In progress' },
  { id: 'next', label: 'Next' }
];

const CONTINUE_TARGETS = ['chatgpt', 'gemini', 'claude', 'claude-code'];

// The guided tour: one idea per step, moved on by the reader, never on a timer.
// Each scene's animation plays once when its step opens and then holds still.
const STEPS = [
  {
    label: 'You chat',
    title: 'You chat like you always do.',
    what: 'Here you settle a pricing question with Claude. LLMnesia saves the chat in the background.',
    why: 'Nothing new to learn. No copying, pasting or note-taking.'
  },
  {
    label: 'It’s noted',
    title: 'LLMnesia adds it to your project.',
    what: 'It spots the decision and the next step in that chat and adds them to your Invoicing app project, quoting your own words.',
    why: 'Your project stays written down, and you didn’t have to write it.'
  },
  {
    label: 'Pick up',
    title: 'Come back any time and pick up where you left off.',
    what: 'Your next step is waiting. One click opens the chat it came from, so you can carry on there or continue it in another AI.',
    why: 'No digging through old chats to remember where you got to.'
  },
  {
    label: 'Your project',
    title: 'Every project, in one place.',
    what: 'This is the project page. Switch between Decided, In progress and Next, and open the chat behind any item.',
    why: 'Know where every project stands, and check anything against the chat it came from.'
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

// Fades a piece of a scene in after `at` seconds. With reduced motion it is
// simply there (see the CSS).
const reveal = (at, className = '') => ({
  className: className ? `${className} pro-reveal` : 'pro-reveal',
  style: { animationDelay: `${at}s` }
});

// One quote with its link back to the chat, as the real page shows it.
function Evidence({ item, onOpen, pulse = false }) {
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
          className={`pro-evidence-link${pulse ? ' is-pulse' : ''}`}
          onClick={() => onOpen?.(item.chat)}
        >
          Open source chat
        </button>
      </span>
    </div>
  );
}

function NewTag() {
  return <span className="pro-pill-new">New</span>;
}

// The project page. `highlight` marks the items that came from the new chat;
// `revealNew` (seconds) fades them in; `pulseNext` draws the eye to the link.
function ProjectPage({ tab, onTab, onOpenChat, highlight = false, revealNew = null, pulseNext = false }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const itemProps = (item) => {
    const className = `pro-project-card${highlight && item.isNew ? ' is-new' : ''}`;
    return revealNew !== null && item.isNew ? reveal(revealNew, className) : { className };
  };

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
            {highlight && t.id === 'next' && tab !== 'next' ? (
              <span {...reveal((revealNew ?? 0) + 1.4, 'pro-tab-new')}>1 new</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="pro-project-list" role="tabpanel">
        {tab === 'decided'
          ? DECIDED.map((item) => (
              <article key={item.id} {...itemProps(item)}>
                <h4>
                  {item.text} {highlight && item.isNew ? <NewTag /> : null}
                </h4>
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
              <article key={item.id} {...itemProps(item)}>
                <h4>
                  {item.text} {highlight && item.isNew ? <NewTag /> : null}
                </h4>
                <span className="pro-project-status">{item.basis}</span>
                <Evidence item={item} onOpen={onOpenChat} pulse={pulseNext && item.isNew} />
              </article>
            ))
          : null}
      </div>
    </div>
  );
}

// A chat as the LLMnesia viewer shows it: the quoted lines highlighted, and
// "Continue in" to carry it on in another assistant.
function ChatView({ chatId, onBack, className = '', style }) {
  const chat = CHATS[chatId];
  const quotes = quotesFor(chatId);
  return (
    <div className={`pro-viewer${className ? ` ${className}` : ''}`} style={style}>
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

function ChatScene() {
  const chat = CHATS[NEW_CHAT];
  return (
    <div className="pro-scene">
      <div className="pro-window">
        <div className="pro-window-bar">
          <Platform id={chat.platform} />
          <span>{chat.title}</span>
        </div>
        <div className="pro-window-body">
          {chat.lines.map((line, index) => (
            <div key={line.text} {...reveal(0.5 + index * 1.6)}>
              <div className={`pro-line${line.you ? ' pro-line--you' : ''}`}>
                <span className="pro-line-who">{line.you ? 'You' : 'Claude'}</span>
                <p>{line.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div {...reveal(5.4, 'pro-window-foot')}>
          <span className="pro-save-dot" aria-hidden="true" />
          Saved by LLMnesia
        </div>
      </div>
    </div>
  );
}

function NotedScene() {
  return (
    <div className="pro-scene">
      <ProjectPage tab="decided" highlight revealNew={0.9} />
    </div>
  );
}

function PickUpScene() {
  return (
    <div className="pro-scene">
      <ProjectPage tab="next" highlight pulseNext />
      <span {...reveal(2.4, 'pro-scene-arrow')} aria-hidden="true">↓ Opens the chat</span>
      <ChatView chatId={NEW_CHAT} {...reveal(2.8)} />
    </div>
  );
}

// The project page, open to explore. Opening a chat swaps to the chat view.
function ProjectScene() {
  const [tab, setTab] = useState('decided');
  const [openChat, setOpenChat] = useState(null);
  return (
    <div className="pro-scene">
      {openChat ? (
        <ChatView chatId={openChat} onBack={() => setOpenChat(null)} />
      ) : (
        <ProjectPage tab={tab} onTab={setTab} onOpenChat={setOpenChat} />
      )}
    </div>
  );
}

const SCENES = [ChatScene, NotedScene, PickUpScene, ProjectScene];

export default function ProBoardDemo() {
  const rootRef = useRef(null);
  const [step, setStep] = useState(0);
  // The first scene waits, paused, until the demo is on screen.
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setSeen(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const current = STEPS[step];
  const Scene = SCENES[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="pro-demo" ref={rootRef}>
      <div className="pro-tour">
        <ol className="pro-tour-steps">
          {STEPS.map((s, index) => (
            <li key={s.label}>
              <button
                type="button"
                className={`pro-tour-step${step === index ? ' is-current' : ''}${step > index ? ' is-done' : ''}`}
                aria-current={step === index ? 'step' : undefined}
                onClick={() => setStep(index)}
              >
                <span className="pro-tour-num">{index + 1}</span>
                <span className="pro-tour-label">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="pro-tour-story" aria-live="polite">
          <div className="pro-tour-copy" key={step}>
            <h3 className="pro-tour-title">{current.title}</h3>
            <p className="pro-tour-what">{current.what}</p>
            <p className="pro-tour-why">
              <strong>Why it matters:</strong> {current.why}
            </p>
          </div>
          <div className="pro-tour-nav">
            <button type="button" className="pro-tour-back" onClick={() => setStep(step - 1)} disabled={step === 0}>
              Back
            </button>
            <button type="button" className="pro-tour-next" onClick={() => setStep(last ? 0 : step + 1)}>
              {last ? 'Start again' : 'Next'} <span aria-hidden="true">{last ? '↺' : '→'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`pro-app${seen ? '' : ' is-waiting'}`}>
        <div className="pro-app-bar">
          <span className="pro-app-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="pro-app-name">{step === 0 ? 'Claude' : 'LLMnesia · Projects'}</span>
          <span className="pro-app-badge">Design preview</span>
        </div>
        <div className="pro-stage" key={step}>
          <Scene />
        </div>
        {last ? null : (
          <div className="pro-stage-foot">
            <button type="button" className="pro-stage-next" onClick={() => setStep(step + 1)}>
              Next: {STEPS[step + 1].label} <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
