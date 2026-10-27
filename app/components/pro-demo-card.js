import { useState } from 'react';
import { PLATFORMS } from './pro-demo-data';
import { c, Fresh, Icon, STATUS } from './pro-demo-ui';

// The card page from the Projects app: topic, status, goal and approach,
// Now and Next, "Keep working on this", what happened and the chats.

const TASKS = [
  ['Find where it’s up to', 'Reads the newest chats and git history, then reports back. Changes nothing.'],
  ['Advise me', 'Reads the card and its chats, then suggests what to do next. Changes nothing.'],
  ['Carry on', 'Picks up the next step from where the chats left off.']
];
const AGENTS = [['claude_code', 'CC', 'Claude Code'], ['codex', 'Cx', 'Codex'], ['zcode', 'Z', 'ZCode']];

function KeepWorking({ card }) {
  const [latest, ...related] = card.chats;
  const [task, setTask] = useState(0);
  return (
    <section className={c('continue-options')}>
      <div className={c('continue-head')}>
        <h2 className={c('continue-heading')}>Keep working on this</h2>
        <div className={c('open-in')} role="group" aria-label="Open in">
          <span className={c('open-in-label')}>Open in</span>
          <button type="button" className={c('open-in-choice open-in-current')}>Desktop app</button>
          <button type="button" className={c('open-in-choice')}>Terminal</button>
        </div>
      </div>
      <div className={c('continue-block continue-resume')}>
        <p className={c('continue-kicker')}>Pick up your latest session</p>
        <ul className={c('continue-list')}>
          <li className={c('continue-row continue-row-primary')}>
            <span className={c('continue-row-text')}>
              <span className={c('chat-title')}>{latest.title}</span>
              <span className={c('chat-meta')}>{PLATFORMS[latest.platform]} · last active {latest.when === 'Today' ? 'today' : latest.when}</span>
            </span>
            <button type="button" className={c('button button-primary button-large has-icon')}>
              <Icon name="play" />
              <span className={c('btn-label')}>Resume in {PLATFORMS[latest.platform]}</span>
            </button>
          </li>
        </ul>
      </div>
      {related.length ? (
        <details className={c('continue-related')}>
          <summary>Related source chats ({related.length})</summary>
          <ul className={c('continue-list')}>
            {related.map((chat) => (
              <li key={chat.title} className={c('continue-row')}>
                <span className={c('continue-row-text')}>
                  <span className={c('chat-title')}>{chat.title}</span>
                  <span className={c('chat-meta')}>{PLATFORMS[chat.platform]} · last active {chat.when}</span>
                </span>
                <span className={c('button button-small')}>Open source ↗</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      <div className={c('continue-block continue-new-chat')}>
        <p className={c('continue-kicker')}>Or start a new chat with this card’s context</p>
        <div className={c('task-picker')} role="group" aria-label="What the new chat should do">
          {TASKS.map(([label], index) => (
            <button key={label} type="button" className={c(`task-choice${task === index ? ' task-choice-current' : ''}`)} onClick={() => setTask(index)} data-live>{label}</button>
          ))}
        </div>
        <p className={c('task-hint')}>{TASKS[task][1]}</p>
        <div className={c('agent-tiles')}>
          {AGENTS.map(([id, mark, name]) => (
            <button key={id} type="button" className={c(`agent-tile agent-${id}`)}>
              <span className={c('agent-mark')}>{mark}</span>
              <span className={c('agent-text')}><span className={c('agent-name btn-label')}>{name}</span><span className={c('agent-sub')}>New session in the app</span></span>
              <Icon name="plus" />
            </button>
          ))}
        </div>
        <div className={c('continue-web-row')}>
          <span className={c('continue-web-label')}>Web chat:</span>
          {['ChatGPT', 'Claude', 'Gemini'].map((name) => (
            <button key={name} type="button" className={c('chip-button')}><span className={c('btn-label')}>{name}</span><Icon name="out" /></button>
          ))}
          <button type="button" className={c('chip-button chip-quiet has-icon')}><Icon name="copy" /><span className={c('btn-label')}>Copy the prompt</span></button>
        </div>
        <p className={c('qualification')}>The new chat gets this card and the ids of its source chats, so it can check them before acting.</p>
      </div>
    </section>
  );
}

export function CardPage({ project, card, onBack, onNext }) {
  return (
    <section className={c('story-panel')}>
      <div className={c('panel-crumb-row')}>
        <button type="button" className={c('text-button back-link')} onClick={onBack} data-live>← Back to {project.name}</button>
        <button type="button" className={c('button button-small next-card')} onClick={onNext} data-live>Next card →</button>
      </div>
      <div className={c('story-main card-page')}>
        <header className={c('card-head')}>
          <div className={c('card-kicker')}>
            <div className={c('subject-line')}>
              <span className={c('subject-label')}>Topic</span>
              <select className={c('subject-select')} value={card.topic} aria-label="Topic" onChange={() => {}} onMouseDown={(event) => event.preventDefault()}>
                {project.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
              </select>
            </div>
          </div>
          <h1>{card.title}</h1>
          <div className={c('status-line')}><Fresh {...card.fresh} /></div>
          <div className={c('status-switch')} role="group" aria-label="Status">
            <span className={c('status-switch-label')}>Status</span>
            {Object.entries(STATUS).map(([key, label]) => key === card.status
              ? <span key={key} className={c(`status-choice status-choice-current status-choice-${key}`)}>{label}</span>
              : <button key={key} type="button" className={c(`status-choice status-choice-${key}`)}>{label}</button>)}
          </div>
        </header>
        <dl className={c('card-about')}>
          <div className={c('about-row about-goal')}><dt>Goal</dt><dd className={c('card-goal')}>{card.goal}</dd></div>
          <div className={c('about-row about-approach')}><dt>Approach</dt><dd className={c('card-approach')}>{card.approach}</dd></div>
        </dl>
        {card.status === 'reported_complete' ? (
          <section className={c('state-banner state-check')} role="status">
            <p className={c('state-title')}><span className={c('state-icon')}>?</span><span>Ready to check</span></p>
            <p className={c('state-text')}>An assistant reported this finished. Check the result, then confirm it.</p>
            <div className={c('state-actions')}>
              <button type="button" className={c('button button-primary')}>Yes, it’s done</button>
              <button type="button" className={c('button')}>Not yet</button>
            </div>
          </section>
        ) : null}
        {card.ask ? (
          <section className={c('needs-you has-items card-need')}>
            <h2 className={c('needs-heading')}><span className={c('status-callout-icon')}>!</span><span>Needs you</span></h2>
            <article className={c('ask')}>
              <p className={c('need-tag')}>{card.ask.tag}</p>
              <p className={c('need-question')}>{card.ask.question}</p>
              <div className={c('need-actions')}>
                <button type="button" className={c('button button-small button-primary')}>Add a note</button>
                <button type="button" className={c('button button-small')}>Not now</button>
                <button type="button" className={c('text-button')}>Not relevant</button>
              </div>
            </article>
          </section>
        ) : null}
        <section className={c('now-next card-now-next')}>
          <div className={c('card-flow')}>
            <div className={c('card-block flow-step flow-now')}>
              <span className={c('flow-marker')} />
              <div className={c('flow-body')}><h2>Now</h2><p className={c('card-big')}>{card.text}</p></div>
            </div>
            <div className={c('card-block next-line flow-step flow-next')}>
              <span className={c('flow-marker')}>→</span>
              <div className={c('flow-body')}>
                <h2>Next</h2>
                <p className={c('card-big next-text')}>{card.next || 'No next step yet.'}</p>
                {card.origin ? (
                  <p className={c('card-source next-origin')}>
                    <span className={c('origin-pill')}>{card.origin}</span>
                    <button type="button" className={c('text-button')}>See where</button>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className={c('actions now-actions')}>
            <button type="button" className={c('button button-primary has-icon')}><Icon name="pen" /><span className={c('btn-label')}>Add a note</span></button>
            <button type="button" className={c('button has-icon')}><Icon name="more" /><span className={c('btn-label')}>More</span></button>
          </div>
          <KeepWorking card={card} />
        </section>
        <section className={c('card-section card-timeline')}>
          <h2>What happened</h2>
          <ol className={c('timeline')}>
            {card.history.map((entry) => (
              <li key={entry.text}><span className={c('timeline-date')}>{entry.date}</span><span className={c('timeline-text')}>{entry.text}</span></li>
            ))}
          </ol>
        </section>
        <section className={c('card-section card-chats rail-section')}>
          <h2>Chats</h2>
          <ul className={c('chat-list')}>
            {card.chats.map((chat) => (
              <li key={chat.title} className={c('chat-row')}>
                <span className={c('chat-title')}>{chat.title}</span>
                <span className={c('chat-meta')}>{PLATFORMS[chat.platform]} · {chat.when}</span>
                <span className={c('chat-actions')}><button type="button" className={c('text-button')}>Read</button></span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
