'use client';

import { useEffect, useRef, useState } from 'react';

// Interactive design preview of a Pro project board for /teams. Everything here
// is made-up content for a fictional invoicing app. It mirrors the real card
// shape in the Projects engine: a card has decisions and a next step, each
// quoting the chat it came from, plus its linked chats and a resume target.
//
// It plays as a four-step story when it scrolls into view: a new Codex chat
// arrives, LLMnesia files it, the board updates, then you carry on in one
// click. The step buttons jump to any step. With reduced motion nothing plays
// on its own; the steps still work.

const PLATFORMS = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  'claude-code': 'Claude Code',
  codex: 'Codex'
};

// Every quote on a card appears word for word in one of these chats, so the
// chat view can highlight exactly what the card is based on.
const CHATS = {
  'billing-shortlist': {
    platform: 'chatgpt', title: 'Billing provider shortlist', when: 'Mon', cardId: 'stripe',
    lines: [
      { you: true, text: 'Which billing providers should we shortlist for invoices and receipts?' },
      { text: 'Stripe Billing, Paddle and Chargebee all cover it. Stripe fits best because you already take payments there.' }
    ]
  },
  'stripe-vs-ledger': {
    platform: 'claude', title: 'Stripe Billing vs a custom ledger', when: 'Mon', cardId: 'stripe',
    lines: [
      { you: true, text: 'Custom ledger or Stripe Billing for invoices?' },
      { text: 'Stripe Billing handles invoices, receipts and retries. A custom ledger gives you control but needs ongoing upkeep.' },
      { you: true, text: 'A ledger is weeks of work we’d have to maintain forever. Stripe it is.' }
    ]
  },
  'stripe-tax': {
    platform: 'claude', title: 'Stripe Tax and VAT', when: 'Tue', cardId: 'stripe',
    lines: [
      { you: true, text: 'Do we need our own VAT rates table?' },
      { text: 'Stripe Tax covers UK and EU VAT, so we don’t need our own rates table. Turn it on before the VAT work starts.' }
    ]
  },
  'invoice-needs': {
    platform: 'chatgpt', title: 'What do customers need from invoices?', when: 'Tue', cardId: 'pdf',
    lines: [
      { you: true, text: 'Do customers need a portal to see their invoices?' },
      { text: 'Most small customers just want the PDF by email.' },
      { you: true, text: 'Portal can wait. PDF plus email covers every customer we have.' }
    ]
  },
  'email-layout': {
    platform: 'gemini', title: 'Invoice email layout ideas', when: 'Wed', cardId: 'pdf',
    lines: [
      { you: true, text: 'Ideas for the invoice email layout?' },
      { text: 'Keep the email to three lines and put the PDF up front.' }
    ]
  },
  'retry-handler': {
    platform: 'claude-code', title: 'Webhook retry handler', when: '2h ago', cardId: 'webhooks',
    lines: [
      { you: true, text: 'Webhook retries are charging twice when Stripe replays an event.' },
      { text: 'Use the event ID as the idempotency key so a replay can never charge twice.' }
    ]
  },
  'failure-strategy': {
    platform: 'chatgpt', title: 'Webhook failure strategy', when: 'Yesterday', cardId: 'webhooks',
    lines: [
      { you: true, text: 'How many times should we retry a failed webhook?' },
      { text: 'Three tries with backoff is plenty. After that, alert someone.' }
    ]
  },
  'idempotency-keys': {
    platform: 'claude', title: 'Idempotency keys explained', when: 'Mon', cardId: 'webhooks',
    lines: [
      { you: true, text: 'Explain idempotency keys simply.' },
      { text: 'An idempotency key tells the server it has already handled a request, so repeating it changes nothing.' }
    ]
  },
  'test-fixtures': {
    platform: 'claude-code', title: 'Webhook test fixtures', when: 'Mon', cardId: 'webhooks',
    lines: [
      { you: true, text: 'Add test fixtures for replayed webhook events.' },
      { text: 'Added fixtures for a replayed event and a duplicate delivery. The replay test fails for now, as expected.' }
    ]
  },
  'fix-idempotency': {
    platform: 'codex', title: 'Fix idempotency test', when: 'Just now', cardId: 'webhooks', folder: '~/invoicing-app',
    lines: [
      { you: true, text: 'The webhook idempotency test still fails when Stripe replays an event.' },
      { text: 'Found it: retries weren’t keyed on anything stable. I’ve keyed them on the Stripe event ID, so a replay is now a no-op.' },
      { text: 'All webhook tests pass now. Next step is staging.' }
    ]
  },
  'refund-policy': {
    platform: 'claude', title: 'Refund policy options', when: 'Mon', cardId: 'refunds',
    lines: [
      { you: true, text: 'Should refunds go back to the card or become store credit?' },
      { text: 'Original payment method only is the simplest place to start.' },
      { you: true, text: 'Original payment method only. No store credit for now.' }
    ]
  },
  'refund-endpoint': {
    platform: 'claude-code', title: 'Refund endpoint', when: 'Yesterday', cardId: 'refunds',
    lines: [
      { you: true, text: 'Build the refund endpoint.' },
      { text: 'Full refunds work end to end. Partial refunds need their own test, the rounding is easy to get wrong.' }
    ]
  },
  'valid-vat': {
    platform: 'claude', title: 'What a valid UK VAT invoice needs', when: 'Tue', cardId: 'vat',
    lines: [
      { you: true, text: 'What does a valid UK VAT invoice need?' },
      { text: 'The PDF needs our VAT number in the footer to be valid in the UK, plus the VAT amount on each line.' }
    ]
  },
  'pdf-renderer': {
    platform: 'codex', title: 'Invoice PDF renderer', when: 'Wed', cardId: 'vat',
    lines: [
      { you: true, text: 'Render each invoice as a PDF.' },
      { text: 'The renderer now outputs a one-page PDF. VAT lines aren’t added yet.' }
    ]
  },
  'refund-tone': {
    platform: 'chatgpt', title: 'Refund email tone', when: 'Wed', cardId: 'copy',
    lines: [
      { you: true, text: 'What tone should the refund email have?' },
      { text: 'Tone: short and friendly, and say how many days the money takes.' }
    ]
  }
};

const NEW_CHAT = 'fix-idempotency';

const CARDS = [
  {
    id: 'stripe', column: 'decided', title: 'Billing runs on Stripe',
    summary: 'Stripe Billing handles invoices and receipts. No custom ledger.',
    next: { text: 'Turn on Stripe Tax before the VAT work starts.', quote: 'Stripe Tax covers UK and EU VAT, so we don’t need our own rates table.', chat: 'stripe-tax' },
    decided: [{ text: 'Use Stripe Billing, not a custom ledger', quote: 'A ledger is weeks of work we’d have to maintain forever. Stripe it is.', chat: 'stripe-vs-ledger' }],
    chats: ['stripe-tax', 'stripe-vs-ledger', 'billing-shortlist'],
    resume: 'claude'
  },
  {
    id: 'pdf', column: 'decided', title: 'Invoices go out as PDF and email',
    summary: 'A PDF attached to an email for every invoice. A customer portal waits until later.',
    next: { text: 'Design the invoice email template.', quote: 'Keep the email to three lines and put the PDF up front.', chat: 'email-layout' },
    decided: [{ text: 'No customer portal in the first release', quote: 'Portal can wait. PDF plus email covers every customer we have.', chat: 'invoice-needs' }],
    chats: ['email-layout', 'invoice-needs'],
    resume: 'gemini'
  },
  {
    id: 'webhooks', column: 'progress', title: 'Retry failed payment webhooks',
    summary: 'Failed Stripe webhooks retry with backoff. Waiting on the idempotency fix.',
    blocked: 'Blocked: idempotency test still failing',
    next: { text: 'Key retries on the Stripe event ID, then rerun the webhook tests.', quote: 'Use the event ID as the idempotency key so a replay can never charge twice.', chat: 'retry-handler' },
    decided: [{ text: 'Three attempts: after 1, 5 and 15 minutes', quote: 'Three tries with backoff is plenty. After that, alert someone.', chat: 'failure-strategy' }],
    chats: ['retry-handler', 'failure-strategy', 'idempotency-keys', 'test-fixtures'],
    resume: 'claude-code',
    // What the card becomes once the new Codex chat has been read.
    updated: {
      summary: 'Failed Stripe webhooks retry with backoff. Idempotency is fixed and the tests pass.',
      blocked: null,
      next: { text: 'Deploy the retry handler to staging and watch one real failure.', quote: 'All webhook tests pass now. Next step is staging.', chat: NEW_CHAT },
      newDecision: { text: 'Retries are keyed on the Stripe event ID', quote: 'I’ve keyed them on the Stripe event ID, so a replay is now a no-op.', chat: NEW_CHAT },
      resume: 'codex'
    }
  },
  {
    id: 'refunds', column: 'progress', title: 'Refund flow',
    summary: 'Full refunds work end to end. Partial refunds are half built.',
    next: { text: 'Finish partial refunds and add a test for each case.', quote: 'Partial refunds need their own test, the rounding is easy to get wrong.', chat: 'refund-endpoint' },
    decided: [{ text: 'Refunds go back to the original card only', quote: 'Original payment method only. No store credit for now.', chat: 'refund-policy' }],
    chats: ['refund-endpoint', 'refund-policy'],
    resume: 'claude-code'
  },
  {
    id: 'vat', column: 'next', title: 'Add VAT to the invoice template',
    summary: 'Show VAT lines on invoices using Stripe Tax amounts.',
    next: { text: 'Add the VAT line and registration number to the PDF.', quote: 'The PDF needs our VAT number in the footer to be valid in the UK', chat: 'valid-vat' },
    decided: [],
    chats: ['pdf-renderer', 'valid-vat'],
    resume: 'codex'
  },
  {
    id: 'copy', column: 'next', title: 'Write the refund email copy',
    summary: 'A short, friendly email confirming a refund and when it lands.',
    next: { text: 'Draft the email and the subject line.', quote: 'Tone: short and friendly, and say how many days the money takes.', chat: 'refund-tone' },
    decided: [],
    chats: ['refund-tone'],
    resume: 'chatgpt'
  }
];

const COLUMNS = [
  { id: 'decided', label: 'Decided' },
  { id: 'progress', label: 'In progress' },
  { id: 'next', label: 'Next' }
];

// Which chat changed which card, newest first.
const ACTIVITY = [
  { chat: 'retry-handler', change: 'new next step' },
  { chat: 'pdf-renderer', change: 'linked' },
  { chat: 'email-layout', change: 'new next step' }
];

const STEPS = [
  { label: 'New chat', caption: 'You fix a bug in Codex. LLMnesia saves the session as you go.' },
  { label: 'Filed', caption: 'It works out which project the chat belongs to and files it there.' },
  { label: 'Board updates', caption: 'The board updates itself: the blocker clears and the decision is recorded, quoting the chat.' },
  { label: 'Carry on', caption: 'Next time, carry on in one click. The AI starts with the context already there.' }
];
const INTRO_CAPTION = 'Watch a new chat arrive, get filed and update the board.';
const DONE_CAPTION = 'Your turn: click any card, quote or chat to explore.';

// Autoplay timeline in milliseconds from the start.
const TIMELINE = { line1: 500, line2: 1800, line3: 3300, filed: 5000, updated: 6500, carryOn: 10300, done: 14800 };

function Platform({ id, compact = false }) {
  return (
    <span className={`pro-chip${compact ? ' pro-chip--dot' : ''}`} data-platform={id}>
      {compact ? <span className="visually-hidden">{PLATFORMS[id]}</span> : PLATFORMS[id]}
    </span>
  );
}

function withMarks(text, quotes) {
  const quote = quotes.find((q) => text.includes(q));
  if (!quote) return text;
  const start = text.indexOf(quote);
  return (
    <>
      {text.slice(0, start)}
      <mark>{quote}</mark>
      {text.slice(start + quote.length)}
    </>
  );
}

export default function ProBoardDemo() {
  const rootRef = useRef(null);
  const timers = useRef([]);
  const [step, setStep] = useState(-1); // -1 intro, 0 to 3 story steps, 4 done
  const [typed, setTyped] = useState(0);
  const [selected, setSelected] = useState({ kind: 'card', id: 'webhooks' });
  const [handoff, setHandoff] = useState(false);
  const [playing, setPlaying] = useState(false);

  const filed = step >= 1;
  const updated = step >= 2;

  function clearTimers() {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  }

  function show(nextStep) {
    setStep(nextStep);
    if (nextStep <= 1) setSelected({ kind: 'card', id: 'webhooks' });
    if (nextStep === 2) setSelected({ kind: 'card', id: 'webhooks' });
    setHandoff(nextStep === 3);
  }

  function jumpTo(nextStep) {
    clearTimers();
    setPlaying(false);
    setTyped(3);
    show(nextStep);
  }

  function play() {
    clearTimers();
    setPlaying(true);
    setTyped(0);
    show(0);
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    at(TIMELINE.line1, () => setTyped(1));
    at(TIMELINE.line2, () => setTyped(2));
    at(TIMELINE.line3, () => setTyped(3));
    at(TIMELINE.filed, () => show(1));
    at(TIMELINE.updated, () => show(2));
    at(TIMELINE.carryOn, () => show(3));
    at(TIMELINE.done, () => {
      show(4);
      setPlaying(false);
    });
  }

  useEffect(() => {
    const node = rootRef.current;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!node || reduceMotion || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          timers.current.push(setTimeout(play, 900));
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimers();
    };
    // play only uses state setters and the timer ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A card as it looks right now, with the new chat folded in once read.
  const view = (card) => {
    if (!(updated && card.updated)) return { ...card, fresh: false };
    const u = card.updated;
    return {
      ...card,
      summary: u.summary,
      blocked: u.blocked,
      next: u.next,
      decided: [u.newDecision, ...card.decided],
      chats: [NEW_CHAT, ...card.chats],
      resume: u.resume,
      fresh: true
    };
  };

  const cardPlatforms = (card) => [...new Set(card.chats.map((id) => CHATS[id].platform))].slice(0, 3);
  const quotesFor = (chatId) =>
    CARDS.map(view).flatMap((card) => [card.next, ...card.decided]).filter((q) => q.chat === chatId).map((q) => q.quote);

  const linkedTotal = CARDS.reduce((sum, card) => sum + card.chats.length, 0) + (filed ? 1 : 0);
  const activity = filed
    ? [{ chat: NEW_CHAT, change: updated ? 'blocker cleared, new decision' : 'filed' }, ...ACTIVITY]
    : ACTIVITY;

  const openChat = (id) => {
    setHandoff(false);
    setSelected({ kind: 'chat', id });
  };
  const openCard = (id) => {
    setHandoff(false);
    setSelected({ kind: 'card', id });
  };

  const card = selected.kind === 'card' ? view(CARDS.find((c) => c.id === selected.id)) : null;
  const chat = selected.kind === 'chat' ? CHATS[selected.id] : null;
  const caption = step === -1 ? INTRO_CAPTION : step === 4 ? DONE_CAPTION : STEPS[step].caption;
  const incomingState = step === 0 ? 'is-in' : step === 1 ? 'is-filing' : '';
  const incoming = CHATS[NEW_CHAT];

  const Quote = ({ item }) => (
    <blockquote className={`pro-quote${item.chat === NEW_CHAT && updated ? ' is-fresh' : ''}`}>
      <p>“{item.quote}”</p>
      <button type="button" className="pro-quote-source" onClick={() => openChat(item.chat)}>
        <Platform id={CHATS[item.chat].platform} /> {CHATS[item.chat].title} · {CHATS[item.chat].when}
        <span aria-hidden="true"> ↗</span>
      </button>
    </blockquote>
  );

  return (
    <div className="pro-demo" ref={rootRef}>
      <div className="pro-story">
        <ol className="pro-story-steps">
          {STEPS.map((s, index) => (
            <li key={s.label}>
              <button
                type="button"
                className={`pro-story-step${step === index ? ' is-current' : ''}${step > index ? ' is-done' : ''}`}
                aria-current={step === index ? 'step' : undefined}
                onClick={() => jumpTo(index)}
              >
                <span className="pro-story-num">{index + 1}</span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="pro-story-replay" onClick={play} disabled={playing}>
          {playing ? 'Playing…' : step === -1 ? 'Play' : 'Replay'}
        </button>
        <p className="pro-story-caption" aria-live="polite">{caption}</p>
      </div>

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

        <div className="pro-app-body">
          <aside className="pro-app-side" aria-label="Projects">
            <p className="pro-side-label">Projects</p>
            <ul className="pro-side-list">
              <li className={`is-active${step === 1 ? ' is-pulse' : ''}`}>
                <span>Invoicing app</span>
                <span className="pro-side-count">{linkedTotal}</span>
              </li>
              <li>
                <span>Marketing site</span>
                <span className="pro-side-count">6</span>
              </li>
              <li>
                <span>Mobile app</span>
                <span className="pro-side-count">9</span>
              </li>
            </ul>
            <p className="pro-side-label">Saved from</p>
            <ul className="pro-side-sources">
              {Object.keys(PLATFORMS).map((id) => (
                <li key={id}>
                  <Platform id={id} compact /> {PLATFORMS[id]}
                </li>
              ))}
            </ul>
          </aside>

          <div className="pro-app-main">
            <div className="pro-board-top">
              <div>
                <p className="pro-board-name">Invoicing app</p>
                <p className="pro-board-meta">
                  6 cards · {linkedTotal} linked chats ·{' '}
                  <span className={updated ? 'pro-live is-on' : 'pro-live'}>
                    {updated ? 'updated just now' : 'updated 2h ago'}
                  </span>
                </p>
              </div>
              <span className="pro-board-scope">Team · 4 members</span>
            </div>

            <div className="pro-columns" role="list">
              {COLUMNS.map((column) => (
                <div className="pro-column" key={column.id} role="listitem">
                  <p className="pro-column-label">
                    {column.label}
                    <span>{CARDS.filter((c) => c.column === column.id).length}</span>
                  </p>
                  {CARDS.filter((c) => c.column === column.id).map((raw) => {
                    const c = view(raw);
                    const isSelected = selected.kind === 'card' && selected.id === c.id;
                    const waiting = step === 1 && c.id === 'webhooks';
                    return (
                      <button
                        type="button"
                        key={c.id}
                        className={`pro-card${isSelected ? ' is-selected' : ''}${c.fresh ? ' is-fresh' : ''}${waiting ? ' is-incoming' : ''}`}
                        onClick={() => openCard(c.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="pro-card-title">{c.title}</span>
                        {c.blocked ? <span className="pro-card-flag">Blocked</span> : null}
                        {waiting ? <span className="pro-card-flag pro-card-flag--new">1 new chat</span> : null}
                        {c.fresh ? <span className="pro-card-flag pro-card-flag--fresh">Updated</span> : null}
                        <span className="pro-card-foot">
                          <span className="pro-card-platforms">
                            {cardPlatforms(c).map((p) => (
                              <Platform id={p} compact key={p} />
                            ))}
                          </span>
                          <span className="pro-card-count">
                            {c.chats.length === 1 ? '1 chat' : `${c.chats.length} chats`}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pro-activity">
              <p className="pro-activity-label">Recent activity</p>
              <ul>
                {activity.slice(0, 3).map((item, index) => {
                  const source = CHATS[item.chat];
                  return (
                    <li key={item.chat} className={filed && index === 0 ? 'is-fresh' : ''}>
                      <button type="button" onClick={() => openChat(item.chat)}>
                        <Platform id={source.platform} compact />
                        <span className="pro-activity-text">
                          <strong>{source.title}</strong>
                          <span aria-hidden="true"> → </span>
                          {CARDS.find((c) => c.id === source.cardId).title}
                          <span className="pro-activity-change"> · {item.change}</span>
                        </span>
                        <span className="pro-activity-when">{source.when}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <section className="pro-detail" aria-live="polite" aria-label={chat ? 'Selected chat' : 'Selected card'}>
            {card ? (
              <>
                <p className="pro-detail-column">{COLUMNS.find((col) => col.id === card.column).label}</p>
                <h3 className="pro-detail-title">{card.title}</h3>
                <p className="pro-detail-summary">{card.summary}</p>
                {card.blocked ? <p className="pro-detail-blocked">{card.blocked}</p> : null}

                <p className="pro-detail-label">Next step</p>
                <p className={`pro-detail-next${card.fresh ? ' is-fresh' : ''}`}>{card.next.text}</p>
                <Quote item={card.next} />

                {card.decided.length ? (
                  <>
                    <p className="pro-detail-label">Decided</p>
                    <p className={`pro-detail-decision${card.fresh ? ' is-fresh' : ''}`}>{card.decided[0].text}</p>
                    <Quote item={card.decided[0]} />
                  </>
                ) : null}

                <p className="pro-detail-label">Linked chats</p>
                <ul className="pro-detail-chats">
                  {card.chats.slice(0, 4).map((id, index) => (
                    <li key={id} className={card.fresh && index === 0 ? 'is-fresh' : ''}>
                      <button type="button" onClick={() => openChat(id)}>
                        <Platform id={CHATS[id].platform} compact />
                        <span className="pro-detail-chat-title">{CHATS[id].title}</span>
                        <span className="pro-detail-chat-when">{CHATS[id].when}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="pro-detail-actions">
                  <button
                    type="button"
                    className={`pro-btn pro-btn--primary${step === 3 ? ' is-pulse' : ''}`}
                    onClick={() => setHandoff((open) => !open)}
                    aria-expanded={handoff}
                  >
                    Continue in {PLATFORMS[card.resume]}
                  </button>
                  <a className="pro-btn" href="#for-teams">Share with team</a>
                </div>

                {handoff ? (
                  <div className="pro-handoff" role="dialog" aria-label={`Continue in ${PLATFORMS[card.resume]}`}>
                    <div className="pro-handoff-head">
                      <strong>Continue in {PLATFORMS[card.resume]}</strong>
                      <button type="button" className="pro-handoff-close" onClick={() => setHandoff(false)} aria-label="Close">
                        ×
                      </button>
                    </div>
                    <p>{PLATFORMS[card.resume]} opens with this already filled in:</p>
                    <pre>
                      {`Project: Invoicing app\nWorking on: ${card.title}\n${card.decided[0] ? `Decided: ${card.decided[0].text}\n` : ''}Next: ${card.next.text}`}
                    </pre>
                  </div>
                ) : null}
              </>
            ) : null}

            {chat ? (
              <>
                <p className="pro-detail-column">Chat</p>
                <h3 className="pro-detail-title">
                  <Platform id={chat.platform} /> {chat.title}
                </h3>
                <p className="pro-detail-summary">
                  {chat.when} · filed to Invoicing app · linked to{' '}
                  <button type="button" className="pro-inline-link" onClick={() => openCard(chat.cardId)}>
                    {CARDS.find((c) => c.id === chat.cardId).title}
                  </button>
                </p>
                <div className="pro-transcript">
                  {chat.lines.map((line) => (
                    <div key={line.text} className={`pro-line${line.you ? ' pro-line--you' : ''}`}>
                      <span className="pro-line-who">{line.you ? 'You' : PLATFORMS[chat.platform]}</span>
                      <p>{withMarks(line.text, quotesFor(selected.id))}</p>
                    </div>
                  ))}
                </div>
                {quotesFor(selected.id).length ? (
                  <p className="pro-transcript-note">Highlighted: what the card quotes from this chat.</p>
                ) : null}
                <div className="pro-detail-actions">
                  <span className="pro-btn pro-btn--primary">Open in {PLATFORMS[chat.platform]}</span>
                  <button type="button" className="pro-btn" onClick={() => openCard(chat.cardId)}>
                    Back to card
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>

        {/* The new chat, as its own window, arriving and then filing itself away. */}
        <div className={`pro-incoming ${incomingState}`} aria-hidden={!incomingState}>
          <div className="pro-incoming-bar">
            <Platform id={incoming.platform} />
            <span>{incoming.title}</span>
            <span className="pro-incoming-folder">{incoming.folder}</span>
          </div>
          <div className="pro-incoming-body">
            {incoming.lines.map((line, index) => (
              <div
                key={line.text}
                className={`pro-line${line.you ? ' pro-line--you' : ''}${index < typed ? ' is-shown' : ''}`}
              >
                <span className="pro-line-who">{line.you ? 'You' : 'Codex'}</span>
                <p>{line.text}</p>
              </div>
            ))}
            {typed < incoming.lines.length && step === 0 ? (
              <div className="pro-typing" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>
          <div className="pro-incoming-foot">
            <span className="pro-save-dot" aria-hidden="true" />
            {step === 1 ? 'Filed to Invoicing app' : 'Saved by LLMnesia'}
          </div>
        </div>
      </div>
    </div>
  );
}
