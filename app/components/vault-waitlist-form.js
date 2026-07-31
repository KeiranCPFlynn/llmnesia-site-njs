'use client';

import { useState } from 'react';

// Vault founding-member waitlist form. Mirrors the site's existing lead-capture
// pattern: the email is POSTed to /api/leads (which forwards to the Google Sheet
// webhook) tagged with a dedicated source so Vault interest lands on its own tab,
// never mixed into the general outreach list. PostHog only ever sees an anonymous
// counter event — no email, no PII — so the privacy promise holds.
export default function VaultWaitlistForm({ context = 'vault_page', compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');
  // Retained after a successful join so the follow-up feedback POST attaches to
  // the same lead row. Never rendered back to the user.
  const [joinedEmail, setJoinedEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackState, setFeedbackState] = useState('idle'); // idle | submitting | done

  async function handleSubmit(event) {
    event.preventDefault();
    if (state === 'submitting') return;

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      setState('error');
      return;
    }

    setState('submitting');
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          source: 'website_vault_waitlist',
          context,
          captured_at: new Date().toISOString(),
          page_path: typeof window !== 'undefined' ? window.location.pathname : '/vault'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        setError(data.error || 'Something went wrong. Please try again.');
        setState('error');
        return;
      }

      // Server confirmed the signup — mark success before the PostHog call so
      // an analytics failure can never mask a completed signup with an error.
      setJoinedEmail(trimmed);
      setState('success');
      setEmail('');

      // Anonymous funnel counter only — deliberately no email/identity attached.
      // Own try/catch so a PostHog SDK error (seen on some Windows Chrome
      // builds) never swallows a signup that already succeeded server-side.
      try {
        if (typeof window !== 'undefined' && window.posthog) {
          window.posthog.capture('vault_waitlist_joined', {
            source: 'website_vault_waitlist',
            context
          });
        }
      } catch (phError) {
        console.error('[vault] PostHog capture failed:', phError);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setState('error');
    }
  }

  // Optional one-question survey shown after joining. Forwards free-text intent
  // against the same lead so we learn which Vault capability actually pulls,
  // without gating the signup on it. Anonymous counter only in PostHog.
  async function handleFeedbackSubmit(event) {
    event.preventDefault();
    if (feedbackState === 'submitting') return;

    const trimmed = feedback.trim();
    if (!trimmed) return;

    setFeedbackState('submitting');

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: joinedEmail,
          source: 'website_vault_waitlist',
          context: `${context}_feedback`,
          feedback: trimmed,
          captured_at: new Date().toISOString(),
          page_path: typeof window !== 'undefined' ? window.location.pathname : '/vault'
        })
      });

      try {
        if (typeof window !== 'undefined' && window.posthog) {
          window.posthog.capture('vault_waitlist_feedback', {
            source: 'website_vault_waitlist',
            context
          });
        }
      } catch (phError) {
        console.error('[vault] PostHog feedback capture failed:', phError);
      }
    } catch {
      // Feedback is best-effort; the signup already succeeded either way.
    }

    setFeedback('');
    setFeedbackState('done');
  }

  if (state === 'success') {
    return (
      <div className={`vault-form vault-form-success${compact ? ' vault-form-compact' : ''}`} role="status">
        <p className="vault-form-success-title">You’re on the list.</p>
        <p className="vault-form-success-copy">
          We’ll email you the moment Vault opens — with your founding price locked in.
        </p>

        {feedbackState === 'done' ? (
          <p className="vault-form-success-copy vault-form-feedback-thanks">
            Thanks — that helps us build the right thing.
          </p>
        ) : (
          <form className="vault-form-feedback" onSubmit={handleFeedbackSubmit}>
            <label className="vault-form-feedback-label" htmlFor={`vault-feedback-${context}`}>
              One quick thing — what would you most use Vault for?
            </label>
            <textarea
              id={`vault-feedback-${context}`}
              className="vault-form-feedback-input"
              rows={2}
              placeholder="e.g. picking up a ChatGPT thread on my phone"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              disabled={feedbackState === 'submitting'}
            />
            <button
              className="button button-small"
              type="submit"
              disabled={feedbackState === 'submitting' || !feedback.trim()}
            >
              {feedbackState === 'submitting' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <form className={`vault-form${compact ? ' vault-form-compact' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="vault-form-row">
        <label className="visually-hidden" htmlFor={`vault-email-${context}`}>
          Email address
        </label>
        <input
          id={`vault-email-${context}`}
          className="vault-form-input"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === 'error') setState('idle');
          }}
          disabled={state === 'submitting'}
          required
        />
        <button className="button button-large" type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Joining…' : 'Get founding access'}
        </button>
      </div>
      {state === 'error' && error ? (
        <p className="vault-form-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="vault-form-note">
          No spam. A note or two about Vault, then we tell you when it’s ready.
        </p>
      )}
    </form>
  );
}
