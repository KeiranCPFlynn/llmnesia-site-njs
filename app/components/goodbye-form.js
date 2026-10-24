'use client';

import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/analytics';
import {
  GOODBYE_REASONS,
  cleanGoodbyeComment,
  isGoodbyeReason,
  parseGoodbyeParams
} from '../../lib/goodbye';

// One tap records one anonymous event with the reason, the extension version and
// the install-age bucket from the URL. Nothing here identifies a person. The
// optional note goes to PostHog only (never Google Analytics, which must not
// receive free text) and is a separate event so the one-tap answer stands alone.
export default function GoodbyeForm() {
  const [context, setContext] = useState({ extension_version: 'unknown', install_age: 'unknown' });
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [noteSent, setNoteSent] = useState(false);

  useEffect(() => {
    setContext(parseGoodbyeParams(window.location.search));
  }, []);

  function choose(id) {
    if (reason || !isGoodbyeReason(id)) return;
    setReason(id);
    trackEvent('uninstall_reason', { reason: id, ...context }, { waitForReady: true });
  }

  function sendNote(event) {
    event.preventDefault();
    const note = cleanGoodbyeComment(comment);
    if (!note || noteSent) return;
    setNoteSent(true);
    const capture = () => {
      try {
        window.posthog?.capture?.('uninstall_comment', { reason, comment: note, ...context });
      } catch {}
    };
    if (typeof window.posthog?.capture === 'function') {
      capture();
    } else {
      window.addEventListener('posthog:ready', capture, { once: true });
    }
  }

  return (
    <>
      <header className="content-header">
        <h1>Thanks for <span className="text-gradient">trying LLMnesia</span></h1>
        <p className="answer-first">
          {reason
            ? 'Thank you, that really helps.'
            : 'If you have a few seconds, one tap tells us what to improve. There is nothing to sign up for.'}
        </p>
      </header>

      <div className="content-body">
        {!reason && (
          <>
            <h2>What was the main reason?</h2>
            <ul className="goodbye-reasons" style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
              {GOODBYE_REASONS.map((item) => (
                <li key={item.id}>
                  <button className="button" type="button" onClick={() => choose(item.id)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {reason && !noteSent && (
          <form onSubmit={sendNote}>
            <label htmlFor="goodbye-note">Anything else you would like us to know? (optional)</label>
            <textarea
              id="goodbye-note"
              name="note"
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              style={{ display: 'block', width: '100%', margin: '0.5rem 0 0.75rem' }}
            />
            <p>Please leave out personal details. We read every note.</p>
            <button className="button" type="submit" disabled={!cleanGoodbyeComment(comment)}>
              Send note
            </button>
          </form>
        )}

        {reason && noteSent && <p>Got it. Thanks for taking the time.</p>}

        <p>
          If something was broken, you can email <a href="mailto:hello@llmnesia.com">hello@llmnesia.com</a>.
        </p>
      </div>
    </>
  );
}
