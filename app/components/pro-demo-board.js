import { useState } from 'react';
import { c, Fresh, STATUS, TALLY } from './pro-demo-ui';

// The project page from the Projects app: the freshness line, the counts by
// state, cards grouped into topics, and the "Updating your board" panel that
// shows while new chats are matched to cards and the cards rewritten.

const ORDER = { reported_complete: 0, active: 1, waiting: 2, parked: 3 };

// The update run in step 2: three new chats are matched, then these cards rewritten.
export const UPDATING = ['refunds', 'pdf'];
export const UPDATING_TOPIC = 'billing';
export const MATCH_CHATS = 3;
export const IDLE = { phase: 'idle', chats: 0, cards: 0 };
export const DONE = { phase: 'done', chats: MATCH_CHATS, cards: UPDATING.length };

const isRunning = (run) => run.phase === 'matching' || run.phase === 'rewriting';

// A card as it stands at this point of the update run.
export function cardNow(card, run) {
  if (!UPDATING.includes(card.id) || run.phase === 'idle') return card;
  const index = UPDATING.indexOf(card.id);
  if (run.phase === 'done' || (run.phase === 'rewriting' && index < run.cards)) {
    return { ...card, ...card.updated, fresh: { tone: 'green', text: 'Updated just now', recent: true } };
  }
  const updatingNow = run.phase === 'rewriting' && index === run.cards;
  return { ...card, fresh: { tone: 'blue', text: updatingNow ? 'Updating now' : 'Update queued' } };
}

function tally(cards, doneCount) {
  const counts = { verified_complete: doneCount };
  for (const card of cards) {
    counts[card.status] = (counts[card.status] || 0) + 1;
    if (card.ask) counts.needs = (counts.needs || 0) + 1;
  }
  return counts;
}

function RowAsk({ ask, onOpen }) {
  return (
    <div className={c('need-item row-ask')}>
      <p className={c(`row-ask-tag need-tag need-tag-${ask.kind}`)}>{ask.tag}</p>
      <p className={c('need-question')}>
        <strong>Your next step: </strong>
        {ask.question}
      </p>
      <details className={c('need-detail')}>
        <summary>Why this needs you</summary>
        <p className={c('need-basis')}>{ask.why}</p>
      </details>
      <div className={c('need-actions')}>
        <button type="button" className={c('button button-primary button-small')} onClick={onOpen} data-live>Review</button>
        <button type="button" className={c('button button-small')}>Not now</button>
        <button type="button" className={c('text-button')}>Not relevant</button>
      </div>
    </div>
  );
}

// The whole row opens the card, except the row's own buttons and disclosures.
function CardRow({ card, onOpen }) {
  const paused = card.status === 'parked';
  const openFromRow = (event) => {
    if (!event.target.closest('button, summary, details')) onOpen(card.id);
  };
  return (
    <article className={c(`card-row open-row border-${card.status}${card.ask ? ' needs-you-row' : ''}${paused ? ' card-row-paused' : ''}`)} onClick={openFromRow} data-live>
      <div className={c('card-row-head')}>
        <button type="button" className={c('work-link')} onClick={() => onOpen(card.id)} data-live>{card.title}</button>
        {card.ask
          ? <span className={c('pill pill-needs-you')}>Needs you</span>
          : <span className={c(`pill pill-${card.status}`)}>{STATUS[card.status]}</span>}
      </div>
      <p className={c('card-row-text')}>{card.text}</p>
      {card.ask ? <RowAsk ask={card.ask} onOpen={() => onOpen(card.id)} /> : null}
      {!card.ask && card.next && !paused ? (
        <p className={c('card-row-next')}>
          <span className={c('card-row-next-label')}>Next </span>
          <span>{card.next}</span>
        </p>
      ) : null}
      <Fresh {...card.fresh} />
    </article>
  );
}

function TopicGroup({ topic, index, cards, onOpen }) {
  const counts = tally(cards, 0);
  const sorted = [...cards].sort((a, b) => (b.ask ? 1 : 0) - (a.ask ? 1 : 0) || ORDER[a.status] - ORDER[b.status]);
  return (
    <section className={c(`overview-group overview-subject topic-c${index % 6}`)} aria-label={topic.name} data-topic={topic.id}>
      <div className={c('overview-group-head topic-head')}>
        <h2 className={c('overview-group-title')}>
          <span>{topic.name}</span>
          <span className={c('overview-group-count')}>{cards.length}</span>
        </h2>
        <span className={c('topic-mix')}>
          {TALLY.filter(([key]) => key !== 'needs' && counts[key]).map(([key, label]) => (
            <span key={key} className={c(`topic-mix-item tally-${key}`)}>
              <span className={c('topic-mix-dot')} aria-hidden="true" />
              <span>{counts[key]} {label.toLowerCase()}</span>
            </span>
          ))}
        </span>
        <button type="button" className={c('text-button subject-rename')}>Rename</button>
      </div>
      {sorted.map((card) => <CardRow key={card.id} card={card} onOpen={onOpen} />)}
    </section>
  );
}

function ActivityStep({ number, title, done, total, count, note, state }) {
  return (
    <div className={c(`activity-step activity-${state}`)}>
      <span className={c('activity-number')} aria-hidden="true">{number}</span>
      <div className={c('activity-body')}>
        <div className={c('activity-head')}>
          <span className={c('activity-label')}>{title}</span>
          <span className={c('activity-count')}>{count}</span>
        </div>
        <progress className={c('activity-bar')} max={Math.max(1, total)} value={done} aria-label={title} />
        {note ? <p className={c('activity-note')}>{note}</p> : null}
      </div>
    </div>
  );
}

function ActivityCard({ run }) {
  const matching = run.phase === 'matching';
  const rewritten = matching ? 0 : run.cards;
  return (
    <div className={c('activity-card')} role="status">
      <p className={c('activity-title')}>Updating your board</p>
      {matching ? (
        <ActivityStep number={1} title="Matching recent chats to cards" done={run.chats} total={MATCH_CHATS}
          count={`${run.chats} of ${MATCH_CHATS} chats`} note="Runs first, so each card is rewritten from the right chats." state="running" />
      ) : null}
      <ActivityStep number={matching ? 2 : 1} title="Rewriting cards" done={rewritten} total={UPDATING.length}
        count={`${rewritten} of ${UPDATING.length} cards updated`}
        note={matching ? 'Waiting for the chat matching above.' : `${UPDATING.length - rewritten} to go.`}
        state={matching ? 'waiting' : 'running'} />
    </div>
  );
}

function FreshnessLine({ run, behind }) {
  if (isRunning(run)) {
    return (
      <p className={c('project-freshness')}>
        <span className={c('status-dot status-dot-blue')} aria-hidden="true" />
        <span>Updating {UPDATING.length - (run.phase === 'rewriting' ? run.cards : 0)} cards…</span>
      </p>
    );
  }
  if (behind) {
    return (
      <p className={c('project-freshness')}>
        <span className={c('status-dot status-dot-amber')} aria-hidden="true" />
        <button type="button" className={c('text-button count-link')}>{behind} cards have new chat activity</button>
      </p>
    );
  }
  return (
    <p className={c('project-freshness')}>
      <span className={c('status-dot status-dot-green')} aria-hidden="true" />
      <span>All cards are up to date</span>
    </p>
  );
}

export function ProjectPage({ project, run, onOpen }) {
  const cards = project.cards.map((card) => cardNow(card, run));
  const counts = tally(cards, project.done.length);
  const needs = cards.filter((card) => card.ask).length;
  const behind = cards.filter((card) => card.fresh.tone === 'amber').length;
  const [showDone, setShowDone] = useState(false);

  return (
    <section className={c('level')}>
      {isRunning(run) ? <ActivityCard run={run} /> : null}
      <div className={c('home-head')}>
        <div className={c('home-title-row')}>
          <h1>{project.name}</h1>
          <button type="button" className={c('icon-button settings-button')}><span>⚙</span><span>Settings</span></button>
        </div>
        <FreshnessLine run={run} behind={behind} />
        <div className={c('goal-row')}>
          <p className={c('goal-text')}>{project.goal}</p>
          <button type="button" className={c('text-button')} aria-label="Edit goal">✎</button>
        </div>
        <p className={c('repo-line')}>Repository: {project.repo} (verified)</p>
        <div className={c('home-toolbar')}>
          <button type="button" className={c('text-button list-link')}>Search and sort as a list</button>
        </div>
      </div>
      <div className={c('overview-grid')}>
        <section className={c(`needs-you needs-summary${needs ? ' has-items' : ''}`)} aria-label="Needs you">
          {needs ? (
            <p className={c('needs-heading')}>
              <span className={c('status-callout-icon')} aria-hidden="true">!</span>
              <span>{needs === 1 ? '1 card needs you. You’ll find it at the top of its topic.' : `${needs} cards need you. You’ll find them at the top of their topics.`}</span>
            </p>
          ) : (
            <p className={c('needs-none')}>
              <span className={c('status-dot status-dot-green')} aria-hidden="true" />
              <span>Nothing needs you right now</span>
            </p>
          )}
        </section>
        <section className={c('overview-cards')}>
          <div className={c('board-tally')} role="list" aria-label="Cards by state">
            {TALLY.filter(([key]) => counts[key]).map(([key, label]) => (
              <span key={key} className={c(`tally-chip tally-${key}`)} role="listitem">
                <strong>{counts[key]}</strong>
                <span> {label}</span>
              </span>
            ))}
          </div>
          {project.topics.map((topic, index) => (
            <TopicGroup key={topic.id} topic={topic} index={index} cards={cards.filter((card) => card.topic === topic.id)} onOpen={onOpen} />
          ))}
          <section className={c(`overview-group overview-group-verified_complete${showDone ? '' : ' overview-group-folded'}`)}>
            <div className={c('overview-group-head')}>
              <h2 className={c('overview-group-title')}>
                <span>Done</span>
                <span className={c('overview-group-count')}>{project.done.length}</span>
              </h2>
              <button type="button" className={c('text-button')} onClick={() => setShowDone(!showDone)} data-live>{showDone ? 'Hide' : 'Show'}</button>
            </div>
            {showDone ? project.done.map((title) => (
              <article key={title} className={c('card-row open-row border-verified_complete')}>
                <div className={c('card-row-head')}>
                  <span className={c('work-link')}>{title}</span>
                  <span className={c('pill pill-verified_complete')}>Done</span>
                </div>
              </article>
            )) : null}
          </section>
        </section>
      </div>
    </section>
  );
}
