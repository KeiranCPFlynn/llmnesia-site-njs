'use client';

import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from './pro-demo-data';
import { cardNow, DONE, IDLE, MATCH_CHATS, ProjectPage, UPDATING, UPDATING_TOPIC } from './pro-demo-board';
import { CardPage } from './pro-demo-card';
import { c } from './pro-demo-ui';
import './pro-projects-app.css';

// Interactive preview of Pro for /pro, built from the LLMnesia Projects app
// itself (prototypes/projects, the projects-next-experience build). The
// markup copies the app's own: the project list, the project page with its
// state counts and topic groups, the "Updating your board" panel, and the
// card page with Now, Next, "Keep working on this" and its chats. The styles
// are the app's stylesheet, scoped under .pjx and prefixed with pj- by
// scripts/build-projects-app-css.mjs so nothing leaks either way. All the
// content is made up (pro-demo-data.js).
//
// Three steps above the window tell the story: where every project stands,
// how it keeps itself up to date, and how you pick a card back up.

const STEPS = [
  {
    title: 'See where every project stands',
    body: 'Each project gets a board: what needs you, what’s in progress, what’s waiting and what’s done, sorted into topics.',
    hint: 'An example project. Click any card to open it, or pick another project on the left.'
  },
  {
    title: 'It keeps itself up to date',
    body: 'LLMnesia reads your new chats from ChatGPT, Claude, Claude Code and Codex, matches them to cards and rewrites them. No tagging or copying.',
    hint: 'Watch the two cards with new chat activity update from the latest chats.',
    doneHint: 'Both cards were rewritten from the new chats. Refund flow is now ready to check.'
  },
  {
    title: 'Pick up where you left off',
    body: 'Open any card to see where it stands and the chats behind it, then carry on in Claude Code, Codex or a web chat.',
    hint: 'Resume the latest session, or start a new chat that already knows this card.'
  }
];

// The card step 3 opens.
const FIRST_CARD = 'refunds';

export default function ProBoardDemo() {
  const [step, setStep] = useState(0);
  const [boardStep, setBoardStep] = useState(0);
  const [projectId, setProjectId] = useState('invoicing');
  const [cardId, setCardId] = useState(null);
  const [run, setRun] = useState(IDLE);
  const [scrollTarget, setScrollTarget] = useState(null);
  const mainRef = useRef(null);
  const project = PROJECTS.find((item) => item.id === projectId);
  const projectRun = projectId === 'invoicing' ? run : IDLE;

  // Step 2 plays the update run once: match the new chats, then rewrite the
  // cards they belong to.
  useEffect(() => {
    if (run.phase === 'idle' || run.phase === 'done') return undefined;
    const timer = setTimeout(() => {
      setRun((current) => {
        if (current.phase === 'matching') {
          return current.chats + 1 >= MATCH_CHATS ? { phase: 'rewriting', chats: MATCH_CHATS, cards: 0 } : { ...current, chats: current.chats + 1 };
        }
        return current.cards + 1 >= UPDATING.length ? DONE : { ...current, cards: current.cards + 1 };
      });
    }, run.phase === 'matching' ? 700 : 1300);
    return () => clearTimeout(timer);
  }, [run]);

  // The window keeps one size; each new view starts at its top.
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [step, projectId, cardId]);

  // Steps 2 and 3 then bring the part they are about into view: the cards
  // being rewritten (below the pinned "Updating your board" panel), or the
  // card's Now, Next and "Keep working on this".
  useEffect(() => {
    const main = mainRef.current;
    const target = scrollTarget && main?.querySelector(scrollTarget.selector);
    if (!target) return;
    const panel = main.querySelector('.pj-activity-card');
    const top = target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    main.scrollTo({ top: top - (panel ? panel.offsetHeight + 24 : 12), behavior: reduce ? 'auto' : 'smooth' });
  }, [scrollTarget]);

  // Reduced motion shows the finished result straight away.
  const startRun = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setRun(reduce ? DONE : { phase: 'matching', chats: 0, cards: 0 });
    setScrollTarget({ selector: `[data-topic="${UPDATING_TOPIC}"]` });
  };

  const show = (index) => {
    setStep(index);
    setProjectId('invoicing');
    if (index === 2) {
      setCardId(FIRST_CARD);
      setScrollTarget({ selector: '.pj-card-now-next' });
      return;
    }
    setCardId(null);
    setBoardStep(index);
    if (index === 0) setRun(IDLE);
    else startRun();
  };

  const openCard = (id) => {
    setCardId(id);
    setStep(2);
  };

  const backToBoard = () => {
    setCardId(null);
    setStep(boardStep);
  };

  const pickProject = (id) => {
    setProjectId(id);
    backToBoard();
  };

  const nextCard = () => {
    const ids = project.cards.map((item) => item.id);
    setCardId(ids[(ids.indexOf(cardId) + 1) % ids.length]);
  };

  const card = cardId ? cardNow(project.cards.find((item) => item.id === cardId), projectRun) : null;
  const last = step === STEPS.length - 1;
  const hint = step === 1 && run.phase === 'done' ? STEPS[1].doneHint : STEPS[step].hint;

  return (
    <div className="pro-demo">
      <ol className="pro-guide">
        {STEPS.map((item, index) => (
          <li key={item.title}>
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
          <span className="pro-app-name">LLMnesia Projects</span>
          <span className="pro-app-badge">Example data</span>
        </div>
        <div className="pjx">
          <header className={c('topbar')}>
            <div className={c('topbar-row')}>
              <div className={c('brand')}>
                <img className={c('brand-mark')} src="/assets/projects-icon.svg" width="28" height="28" alt="" />
                <span className={c('brand-word')}>LLMnesia <strong>Projects</strong></span>
              </div>
              <nav className={c('breadcrumb')} aria-label="Breadcrumb">
                <button type="button" className={c('crumb')} onClick={backToBoard}>Projects</button>
                <span className={c('crumb-sep')} aria-hidden="true">›</span>
                <span className={c('crumb-current')}>{project.name}</span>
              </nav>
              <div className={c('header-actions')}>
                <button type="button" className={c('icon-button')} aria-label="Help">?</button>
              </div>
            </div>
          </header>
          <div className={c('shell')}>
            <aside className={c('project-rail')} aria-label="Projects">
              <p className={c('rail-title')}>Projects</p>
              {PROJECTS.map((item) => (
                <div key={item.id} className={c('rail-project-row')}>
                  <button type="button" className={c(`rail-project${item.id === projectId ? ' current' : ''}`)} onClick={() => pickProject(item.id)}>
                    <span className={c('rail-name')}>{item.name}</span>
                    <span className={c('rail-goal')}>{item.goal}</span>
                    <span className={c('rail-meta')}>{item.cards.length + item.done.length} cards · {item.repo}</span>
                  </button>
                </div>
              ))}
            </aside>
            <main className={c('app')} ref={mainRef}>
              <div className="pjx-view" key={cardId || `${projectId}-${boardStep}`}>
                {card ? (
                  <CardPage project={project} card={card} onBack={backToBoard} onNext={nextCard} />
                ) : (
                  <ProjectPage project={project} run={projectRun} onOpen={openCard} />
                )}
              </div>
            </main>
          </div>
        </div>
        <div className="pro-app-foot">
          <span className="pro-app-hint" aria-live="polite">{hint}</span>
          <button type="button" className="pro-app-next" onClick={() => show(last ? 0 : step + 1)}>
            {last ? 'Start again' : 'Next'} <span aria-hidden="true">{last ? '↺' : '→'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
