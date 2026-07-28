'use client';

import { useEffect, useRef } from 'react';

/*
 * KineticDemo — a self-contained, embeddable version of the homepage hero's
 * animated search panel. It reuses the global .kp-* styles for its look, but
 * runs its own animation loop scoped to component refs (no data-kp-* hooks),
 * so the global SiteBehavior script never touches it and multiple instances
 * can coexist on one page.
 *
 * Props (all optional except `scenes`):
 *   scenes      Array<{ query: string, rows: Array<{
 *                 platform, title, snippet, date }> }>
 *               Each scene is one typed query + its result rows. One scene
 *               loops on itself; several scenes cycle in order.
 *   placeholder Empty-input placeholder text.
 *   brand       Header label (default "LLMnesia").
 *   kbd         Header shortcut chip (default "⌘ ⇧ 9").
 *   hint        Left side of the input hint row (default "30 indexed").
 *   holdMs      How long results stay before the next cycle (default 6200).
 *
 * The first scene is rendered statically as a poster frame, so with JS or
 * animation unavailable (or prefers-reduced-motion) the panel still shows a
 * complete, readable result set.
 */

const LABELS = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  perplexity: 'Perplexity',
  deepseek: 'DeepSeek',
  copilot: 'Copilot',
  grok: 'Grok',
  mistral: 'Mistral',
  characterai: 'Character.AI'
};

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlight = (text, query) => {
  const words = query.split(/\s+/).filter((word) => word.length > 1);
  const escaped = escapeHtml(text);
  if (words.length === 0) {
    return escaped;
  }
  const matcher = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
  return escaped.replace(matcher, '<mark>$1</mark>');
};

const label = (platform) => LABELS[platform] || platform;

const countLabel = (n) => `${n} result${n === 1 ? '' : 's'}`;

export default function KineticDemo({
  scenes,
  placeholder = 'Search your AI history...',
  brand = 'LLMnesia',
  kbd = '⌘ ⇧ 9',
  hint = '30 indexed',
  holdMs = 6200
}) {
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const countRef = useRef(null);

  const first = scenes[0];

  useEffect(() => {
    const panel = panelRef.current;
    const input = inputRef.current;
    const results = resultsRef.current;
    const count = countRef.current;
    if (!panel || !input || !results || !count) {
      return undefined;
    }

    // Respect reduced-motion: leave the static poster frame in place.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const timeouts = [];
    let paused = true;
    let started = false;
    let queryIndex = 0;

    const setTimer = (callback, delay) => {
      const id = window.setTimeout(callback, delay);
      timeouts.push(id);
      return id;
    };

    const setHasQuery = (value) => {
      panel.classList.toggle('kd-has-query', value);
    };

    const renderEmpty = () => {
      results.innerHTML =
        '<div class="kp-empty">Type to search across your AI history.</div>';
      count.textContent = '—';
      setHasQuery(false);
    };

    const renderResults = (query, rows) => {
      results.innerHTML = '';
      rows.forEach((row, index) => {
        const node = document.createElement('div');
        node.className = 'kp-res';
        node.setAttribute('data-p', row.platform);
        node.innerHTML = `
          <div class="kp-title">${highlight(row.title, query)}</div>
          <div class="kp-snippet">${highlight(row.snippet, query)}</div>
          <div class="kp-meta">
            <span class="kp-pill">${escapeHtml(label(row.platform))}</span>
            <span class="kp-date">${escapeHtml(row.date)}</span>
          </div>
        `;
        results.appendChild(node);
        setTimer(() => node.classList.add('on'), 60 + index * 90);
      });
      count.textContent = countLabel(rows.length);
    };

    const typeQuery = (query, done) => {
      let charIndex = 0;
      input.textContent = '';
      const step = () => {
        if (paused) {
          setTimer(step, 200);
          return;
        }
        charIndex += 1;
        input.textContent = query.slice(0, charIndex);
        if (charIndex === 1) {
          setHasQuery(true);
        }
        if (charIndex < query.length) {
          setTimer(step, 38 + Math.random() * 42);
          return;
        }
        done();
      };
      step();
    };

    const cycle = () => {
      renderEmpty();
      const item = scenes[queryIndex % scenes.length];
      queryIndex += 1;
      typeQuery(item.query, () => {
        setTimer(() => renderResults(item.query, item.rows), 180);
        setTimer(cycle, holdMs);
      });
    };

    // Lazy-render: only run while the panel is on screen; pause when it leaves.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        paused = !entry.isIntersecting;
        if (entry.isIntersecting && !started) {
          started = true;
          setTimer(cycle, 500);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(panel);

    return () => {
      observer.disconnect();
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [scenes, holdMs]);

  return (
    <div className="kd-demo">
      <div className="kd-frame">
        <div className="kd-panel kd-has-query" ref={panelRef}>
          <div className="kp-header">
            <span className="kp-dot" />
            <span className="kp-brand">{brand}</span>
            <span className="kp-kbd">{kbd}</span>
          </div>
          <div className="kp-input-wrap">
            <div className="kp-input-row">
              <div className="kp-input" ref={inputRef} data-placeholder={placeholder}>
                {first.query}
              </div>
              <div className="kp-tools">
                <button className="kp-tool" type="button" aria-label="History" title="Recent searches">
                  <svg viewBox="0 0 16 16" width="13" height="13" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.25" />
                    <path d="M8 4.25v4L10.75 9.5" strokeLinecap="round" />
                  </svg>
                </button>
                <button className="kp-tool" type="button" aria-label="Filters" title="Filters">
                  <svg viewBox="0 0 16 16" width="13" height="13" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="3" y1="4.5" x2="13" y2="4.5" />
                    <line x1="4.75" y1="8" x2="11.25" y2="8" />
                    <line x1="6.25" y1="11.5" x2="9.75" y2="11.5" />
                  </svg>
                </button>
                <button className="kp-tool kp-tool-clear" type="button" aria-label="Clear search" title="Clear">
                  <svg viewBox="0 0 16 16" width="12" height="12" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                    <path d="M4.25 4.25l7.5 7.5M11.75 4.25l-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="kp-hint">
              {hint} <span className="dot-sep">·</span> <kbd>↑</kbd> for previous
            </div>
          </div>
          <div className="kp-results" ref={resultsRef}>
            {first.rows.map((row, index) => (
              <div className="kp-res on" data-p={row.platform} key={index}>
                <div
                  className="kp-title"
                  dangerouslySetInnerHTML={{ __html: highlight(row.title, first.query) }}
                />
                <div
                  className="kp-snippet"
                  dangerouslySetInnerHTML={{ __html: highlight(row.snippet, first.query) }}
                />
                <div className="kp-meta">
                  <span className="kp-pill">{label(row.platform)}</span>
                  <span className="kp-date">{row.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="kp-footer">
            <span className="kp-count" ref={countRef}>
              {countLabel(first.rows.length)}
            </span>
            <span>
              <kbd>↵</kbd> to open
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
