// Shared pieces for the /pro demo, matching the Projects app's markup. Every
// class goes through c(), which adds the pj- prefix the scoped copy of the
// app's stylesheet (pro-projects-app.css) uses.

export const c = (names) => names.split(' ').filter(Boolean).map((name) => `pj-${name}`).join(' ');

export const STATUS = { active: 'In progress', waiting: 'Waiting', reported_complete: 'Ready to check', parked: 'Paused', verified_complete: 'Done' };

export const TALLY = [
  ['needs', 'Needs you'], ['active', 'In progress'], ['waiting', 'Waiting'],
  ['reported_complete', 'Ready to check'], ['parked', 'Paused'], ['verified_complete', 'Done']
];

export const ICONS = {
  play: 'M5 3.5v9l7-4.5z',
  plus: 'M8 3.5v9M3.5 8h9',
  out: 'M6 3.5h6.5V10M12.5 3.5 5 11',
  copy: 'M5.5 5.5h7v7h-7zM3.5 10.5v-7h7',
  pen: 'M10.5 3.5l2 2-6.5 6.5H4v-2z',
  more: 'M4 8h.01M8 8h.01M12 8h.01'
};

export function Icon({ name }) {
  return (
    <span className={c('icon')}>
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ICONS[name]} />
      </svg>
    </span>
  );
}

// The coloured dot and sentence saying how current a card is. The app hides
// the green line on board rows; the demo still shows it on a card it has just
// rewritten (recent), so the update is visible.
export function Fresh({ tone, text, recent }) {
  return (
    <p className={`${c(`freshness freshness-${tone}`)}${recent ? ' pjx-recent' : ''}`}>
      <span className={c(`status-dot status-dot-${tone}`)} aria-hidden="true" />
      <span>{text}</span>
    </p>
  );
}
