'use client';

import { useEffect, useRef, useState } from 'react';

// Interactive design preview of a Pro project board for /teams. Everything here
// is made-up content for a fictional invoicing app. It mirrors the real card
// shape in the Projects engine: a card has decisions and a next step, each
// quoting the chat it came from, plus the linked chats and a resume target.
//
// When the board scrolls into view it plays one "live update": a new coding
// session arrives and the matching card changes, to show the board keeping
// itself current. With reduced motion the update waits for the replay button.

const PLATFORMS = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  'claude-code': 'Claude Code',
  codex: 'Codex'
};

const CARDS = [
  {
    id: 'stripe',
    column: 'decided',
    title: 'Billing runs on Stripe',
    platforms: ['claude', 'chatgpt'],
    chats: 3,
    detail: {
      summary: 'Stripe Billing handles invoices and receipts. No custom ledger.',
      next: {
        text: 'Turn on Stripe Tax before the VAT work starts.',
        quote: 'Stripe Tax covers UK and EU VAT, so we don’t need our own rates table.',
        platform: 'claude',
        when: 'Tue'
      },
      decided: [
        {
          text: 'Use Stripe Billing, not a custom ledger',
          quote: 'A ledger is weeks of work we’d have to maintain forever. Stripe it is.',
          platform: 'chatgpt',
          when: 'Mon'
        }
      ],
      chats: [
        { platform: 'chatgpt', title: 'Billing provider shortlist', when: 'Mon' },
        { platform: 'claude', title: 'Stripe Billing vs a custom ledger', when: 'Mon' },
        { platform: 'claude', title: 'Stripe Tax and VAT', when: 'Tue' }
      ],
      resume: 'claude'
    }
  },
  {
    id: 'pdf',
    column: 'decided',
    title: 'Invoices go out as PDF and email',
    platforms: ['chatgpt', 'gemini'],
    chats: 2,
    detail: {
      summary: 'PDF attached to an email for every invoice. A customer portal waits until later.',
      next: {
        text: 'Design the invoice email template.',
        quote: 'Keep the email to three lines and put the PDF up front.',
        platform: 'gemini',
        when: 'Wed'
      },
      decided: [
        {
          text: 'No customer portal in the first release',
          quote: 'Portal can wait. PDF plus email covers every customer we have.',
          platform: 'chatgpt',
          when: 'Tue'
        }
      ],
      chats: [
        { platform: 'chatgpt', title: 'What do customers need from invoices?', when: 'Tue' },
        { platform: 'gemini', title: 'Invoice email layout ideas', when: 'Wed' }
      ],
      resume: 'gemini'
    }
  },
  {
    id: 'webhooks',
    column: 'progress',
    title: 'Retry failed payment webhooks',
    platforms: ['claude-code', 'chatgpt', 'claude'],
    chats: 4,
    detail: {
      summary: 'Failed Stripe webhooks retry with backoff. Waiting on the idempotency fix.',
      blocked: 'Idempotency test still failing',
      next: {
        text: 'Key retries on the Stripe event ID, then rerun the webhook tests.',
        quote: 'Use the event ID as the idempotency key so a replay can never charge twice.',
        platform: 'claude-code',
        when: '2h ago'
      },
      decided: [
        {
          text: 'Three attempts: after 1, 5 and 15 minutes',
          quote: 'Three tries with backoff is plenty. After that, alert someone.',
          platform: 'chatgpt',
          when: 'Yesterday'
        }
      ],
      chats: [
        { platform: 'claude-code', title: 'Webhook retry handler', when: '2h ago' },
        { platform: 'chatgpt', title: 'Webhook failure strategy', when: 'Yesterday' },
        { platform: 'claude', title: 'Idempotency keys explained', when: 'Mon' },
        { platform: 'claude-code', title: 'Webhook test fixtures', when: 'Mon' }
      ],
      resume: 'claude-code'
    },
    // What the card becomes after the simulated new Codex session.
    updated: {
      chats: 5,
      platforms: ['codex', 'claude-code', 'chatgpt'],
      summary: 'Failed Stripe webhooks retry with backoff. Idempotency fixed and tests pass.',
      blocked: null,
      next: {
        text: 'Deploy the retry handler to staging and watch one real failure.',
        quote: 'All webhook tests pass now. Next step is staging.',
        platform: 'codex',
        when: 'Just now'
      },
      newDecision: {
        text: 'Retries are keyed on the Stripe event ID',
        quote: 'Keyed on event ID. Replays are now a no-op.',
        platform: 'codex',
        when: 'Just now'
      },
      newChat: { platform: 'codex', title: 'Fix idempotency test', when: 'Just now' },
      resume: 'codex'
    }
  },
  {
    id: 'refunds',
    column: 'progress',
    title: 'Refund flow',
    platforms: ['claude-code', 'claude'],
    chats: 2,
    detail: {
      summary: 'Full refunds work end to end. Partial refunds are half built.',
      next: {
        text: 'Finish partial refunds and add a test for each case.',
        quote: 'Partial refunds need their own test, the rounding is easy to get wrong.',
        platform: 'claude-code',
        when: 'Yesterday'
      },
      decided: [
        {
          text: 'Refunds go back to the original card only',
          quote: 'Original payment method only. No store credit for now.',
          platform: 'claude',
          when: 'Mon'
        }
      ],
      chats: [
        { platform: 'claude', title: 'Refund policy options', when: 'Mon' },
        { platform: 'claude-code', title: 'Refund endpoint', when: 'Yesterday' }
      ],
      resume: 'claude-code'
    }
  },
  {
    id: 'vat',
    column: 'next',
    title: 'Add VAT to the invoice template',
    platforms: ['codex', 'claude'],
    chats: 2,
    detail: {
      summary: 'Show VAT lines on invoices using Stripe Tax amounts.',
      next: {
        text: 'Add the VAT line and registration number to the PDF.',
        quote: 'The PDF needs our VAT number in the footer to be valid in the UK.',
        platform: 'claude',
        when: 'Tue'
      },
      decided: [],
      chats: [
        { platform: 'claude', title: 'What a valid UK VAT invoice needs', when: 'Tue' },
        { platform: 'codex', title: 'Invoice PDF renderer', when: 'Wed' }
      ],
      resume: 'codex'
    }
  },
  {
    id: 'copy',
    column: 'next',
    title: 'Write the refund email copy',
    platforms: ['chatgpt'],
    chats: 1,
    detail: {
      summary: 'Short, friendly email confirming a refund and when it lands.',
      next: {
        text: 'Draft the email and the subject line.',
        quote: 'Tone: short and friendly, and say how many days the money takes.',
        platform: 'chatgpt',
        when: 'Wed'
      },
      decided: [],
      chats: [{ platform: 'chatgpt', title: 'Refund email tone', when: 'Wed' }],
      resume: 'chatgpt'
    }
  }
];

// Which chat changed which card, newest first. The live update prepends one.
const ACTIVITY = [
  { platform: 'claude-code', chat: 'Webhook retry handler', cardId: 'webhooks', change: 'new next step', when: '2h ago' },
  { platform: 'codex', chat: 'Invoice PDF renderer', cardId: 'vat', change: 'linked', when: 'Wed' },
  { platform: 'gemini', chat: 'Invoice email layout ideas', cardId: 'pdf', change: 'new next step', when: 'Wed' }
];
const LIVE_ACTIVITY = { platform: 'codex', chat: 'Fix idempotency test', cardId: 'webhooks', change: 'new decision', when: 'Just now' };

const COLUMNS = [
  { id: 'decided', label: 'Decided' },
  { id: 'progress', label: 'In progress' },
  { id: 'next', label: 'Next' }
];

function Platform({ id, compact = false }) {
  return (
    <span className={`pro-chip${compact ? ' pro-chip--dot' : ''}`} data-platform={id}>
      {compact ? <span className="visually-hidden">{PLATFORMS[id]}</span> : PLATFORMS[id]}
    </span>
  );
}

function Quote({ item }) {
  return (
    <blockquote className="pro-quote">
      <p>“{item.quote}”</p>
      <footer>
        <Platform id={item.platform} /> <span>{item.when}</span>
      </footer>
    </blockquote>
  );
}

export default function ProBoardDemo() {
  const rootRef = useRef(null);
  const [selectedId, setSelectedId] = useState('webhooks');
  const [updated, setUpdated] = useState(false);
  const [toast, setToast] = useState(false);
  const timers = useRef([]);

  function clearTimers() {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  }

  function playUpdate() {
    clearTimers();
    setUpdated(false);
    setToast(false);
    setSelectedId('webhooks');
    timers.current.push(setTimeout(() => setToast(true), 400));
    timers.current.push(setTimeout(() => setUpdated(true), 1500));
    timers.current.push(setTimeout(() => setToast(false), 4800));
  }

  useEffect(() => {
    const node = rootRef.current;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!node || reduceMotion || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          timers.current.push(setTimeout(playUpdate, 1600));
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimers();
    };
    // playUpdate only touches state setters and the timer ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const view = (card) => {
    if (!(updated && card.updated)) return { ...card, ...card.detail, fresh: false };
    const u = card.updated;
    return {
      ...card,
      ...card.detail,
      chats: [u.newChat, ...card.detail.chats],
      chatCount: u.chats,
      platforms: u.platforms,
      summary: u.summary,
      blocked: u.blocked,
      next: u.next,
      decided: [u.newDecision, ...card.detail.decided],
      resume: u.resume,
      fresh: true
    };
  };

  const selected = view(CARDS.find((card) => card.id === selectedId));
  const linkedTotal = updated ? 15 : 14;

  return (
    <div className="pro-app" ref={rootRef}>
      <div className="pro-app-bar">
        <span className="pro-app-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="pro-app-name">LLMnesia · Projects</span>
        <button type="button" className="pro-replay" onClick={playUpdate}>
          Replay live update
        </button>
        <span className="pro-app-badge">Design preview</span>
      </div>

      <div className="pro-app-body">
        <aside className="pro-app-side" aria-label="Projects">
          <p className="pro-side-label">Projects</p>
          <ul className="pro-side-list">
            <li className="is-active">
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
                  <span>{CARDS.filter((card) => card.column === column.id).length}</span>
                </p>
                {CARDS.filter((card) => card.column === column.id).map((card) => {
                  const c = view(card);
                  return (
                    <button
                      type="button"
                      key={card.id}
                      className={`pro-card${selectedId === card.id ? ' is-selected' : ''}${c.fresh ? ' is-fresh' : ''}`}
                      onClick={() => setSelectedId(card.id)}
                      aria-pressed={selectedId === card.id}
                    >
                      <span className="pro-card-title">{c.title}</span>
                      {c.blocked ? <span className="pro-card-flag">Blocked</span> : null}
                      {c.fresh ? <span className="pro-card-flag pro-card-flag--fresh">Updated</span> : null}
                      <span className="pro-card-foot">
                        <span className="pro-card-platforms">
                          {c.platforms.map((p) => (
                            <Platform id={p} compact key={p} />
                          ))}
                        </span>
                        <span className="pro-card-count">{(c.chatCount || c.chats.length) === 1 ? '1 chat' : `${c.chatCount || c.chats.length} chats`}</span>
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
              {(updated ? [LIVE_ACTIVITY, ...ACTIVITY] : ACTIVITY).slice(0, 3).map((item, index) => (
                <li key={`${item.chat}-${item.when}`} className={updated && index === 0 ? 'is-fresh' : ''}>
                  <button type="button" onClick={() => setSelectedId(item.cardId)}>
                    <Platform id={item.platform} compact />
                    <span className="pro-activity-text">
                      <strong>{item.chat}</strong>
                      <span aria-hidden="true"> → </span>
                      {CARDS.find((card) => card.id === item.cardId).title}
                      <span className="pro-activity-change"> · {item.change}</span>
                    </span>
                    <span className="pro-activity-when">{item.when}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="pro-detail" aria-live="polite" aria-label="Selected card">
          <p className="pro-detail-column">{COLUMNS.find((col) => col.id === selected.column).label}</p>
          <h3 className="pro-detail-title">{selected.title}</h3>
          <p className="pro-detail-summary">{selected.summary}</p>
          {selected.blocked ? <p className="pro-detail-blocked">{selected.blocked}</p> : null}

          <p className="pro-detail-label">Next step</p>
          <p className={`pro-detail-next${selected.fresh ? ' is-fresh' : ''}`}>{selected.next.text}</p>
          <Quote item={selected.next} />

          {selected.decided.length ? (
            <>
              <p className="pro-detail-label">Decided</p>
              {selected.decided.slice(0, 1).map((item) => (
                <div key={item.text} className={selected.fresh ? 'is-fresh' : ''}>
                  <p className="pro-detail-decision">{item.text}</p>
                  <Quote item={item} />
                </div>
              ))}
            </>
          ) : null}

          <p className="pro-detail-label">Linked chats</p>
          <ul className="pro-detail-chats">
            {selected.chats.slice(0, 4).map((chat, index) => (
              <li key={`${chat.title}-${chat.when}`} className={selected.fresh && index === 0 ? 'is-fresh' : ''}>
                <Platform id={chat.platform} compact />
                <span className="pro-detail-chat-title">{chat.title}</span>
                <span className="pro-detail-chat-when">{chat.when}</span>
              </li>
            ))}
          </ul>

          <div className="pro-detail-actions">
            <span className="pro-btn pro-btn--primary">Continue in {PLATFORMS[selected.resume]}</span>
            <span className="pro-btn">Share with team</span>
          </div>
        </section>
      </div>

      <div className={`pro-toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">
        <Platform id="codex" compact />
        <span>
          <strong>New Codex session</strong> “Fix idempotency test” · updating your board
        </span>
      </div>

    </div>
  );
}
