'use client';

import { useState } from 'react';

// Pro (Projects and Teams) waitlist form. Email first, nothing else in the
// way; two optional questions appear only after the signup has landed. Mirrors
// the Vault waitlist pattern: the email is POSTed to /api/leads with its own
// source, the follow-up answers go in a second POST for the same email, and
// PostHog only ever sees anonymous counters with the enum answers, never the
// email or the free-text answer.
//
// The consent line promises Pro email only, so this list must never be used for
// general marketing.
//
// Values are fixed enums that MUST match ALLOWED_TEAM_SIZE and ALLOWED_TOOLS in
// api/leads.js; anything off-enum is dropped server-side.
const TEAM_SIZE_OPTIONS = [
  { value: 'just_me', label: 'Just me' },
  { value: '2_5', label: '2 to 5 people' },
  { value: '6_20', label: '6 to 20' },
  { value: 'more_20', label: 'More than 20' }
];
// The tools most project work happens in. Anything else goes in "Other", which
// tells us which platforms early users still need.
const TOOL_OPTIONS = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'claude_code', label: 'Claude Code' },
  { value: 'codex', label: 'Codex' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'github_copilot', label: 'GitHub Copilot' },
  { value: 'perplexity', label: 'Perplexity' }
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function postLead(body) {
  return fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'website_pro_early_access',
      captured_at: new Date().toISOString(),
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/pro',
      ...body
    })
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    return response.ok && data.success !== false;
  });
}

function capture(event, properties) {
  try {
    if (typeof window !== 'undefined' && window.posthog) window.posthog.capture(event, properties);
  } catch (phError) {
    console.error('[pro] PostHog capture failed:', phError);
  }
}

function Pills({ id, question, options, isSelected, onToggle, disabled }) {
  return (
    <div className="vault-form-pill-group" role="group" aria-labelledby={id}>
      <span className="vault-form-feedback-label" id={id}>{question}</span>
      <div className="vault-form-pills">
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={`vault-form-pill${selected ? ' selected' : ''}`}
              aria-pressed={selected}
              onClick={() => onToggle(option.value)}
              disabled={disabled}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Shown after a successful signup. Skipping it loses nothing.
function FollowUp({ email, context }) {
  const [teamSize, setTeamSize] = useState('');
  const [tools, setTools] = useState([]);
  const [toolsOther, setToolsOther] = useState('');
  const [state, setState] = useState('idle'); // idle | submitting | done | error

  const busy = state === 'submitting';
  const hasAnswer = teamSize || tools.length || toolsOther.trim();

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy || !hasAnswer) return;
    setState('submitting');
    const answers = {
      ...(teamSize ? { team_size: teamSize } : {}),
      ...(tools.length ? { tools: tools.join(',') } : {}),
      ...(toolsOther.trim() ? { tools_other: toolsOther.trim().slice(0, 120) } : {})
    };
    try {
      const ok = await postLead({ email, context: `${context}_answers`, ...answers });
      if (!ok) {
        setState('error');
        return;
      }
      setState('done');
      // Enum answers only: the free-text tools answer never goes to PostHog.
      const { tools_other: _omit, ...enumAnswers } = answers;
      capture('pro_early_access_answers', { context, ...enumAnswers });
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return <p className="vault-form-success-copy pro-followup-thanks">Thanks, that really helps.</p>;
  }

  return (
    <form className="pro-followup" onSubmit={handleSubmit}>
      <p className="pro-followup-title">
        Two quick questions to help us build it <span>(optional)</span>
      </p>
      <Pills
        id={`pro-team-size-${context}`}
        question="Who would use it?"
        options={TEAM_SIZE_OPTIONS}
        isSelected={(value) => teamSize === value}
        onToggle={(value) => setTeamSize(teamSize === value ? '' : value)}
        disabled={busy}
      />
      <Pills
        id={`pro-tools-${context}`}
        question="Which AI tools do you use for project work?"
        options={TOOL_OPTIONS}
        isSelected={(value) => tools.includes(value)}
        onToggle={(value) =>
          setTools((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]))
        }
        disabled={busy}
      />
      <label className="visually-hidden" htmlFor={`pro-tools-other-${context}`}>
        Other AI tools you use
      </label>
      <input
        id={`pro-tools-other-${context}`}
        className="teams-form-other"
        type="text"
        maxLength={120}
        placeholder="Other tools?"
        value={toolsOther}
        onChange={(event) => setToolsOther(event.target.value)}
        disabled={busy}
      />
      <div className="pro-followup-actions">
        <button className="button" type="submit" disabled={busy || !hasAnswer}>
          {busy ? 'Sending…' : 'Send answers'}
        </button>
        {state === 'error' ? (
          <span className="vault-form-error" role="alert">Something went wrong. Please try again.</span>
        ) : null}
      </div>
    </form>
  );
}

export default function ProEarlyAccessForm({ context = 'pro_page' }) {
  const [email, setEmail] = useState('');
  // Kept after a successful signup so the follow-up answers attach to it.
  const [joinedEmail, setJoinedEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const busy = state === 'submitting';

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Please enter a valid email address.');
      setState('error');
      return;
    }

    setState('submitting');
    setError('');

    try {
      const ok = await postLead({ email: trimmed, context });
      if (!ok) {
        setError('Something went wrong. Please try again.');
        setState('error');
        return;
      }
      // Mark success before analytics so a PostHog failure can never mask a
      // completed signup.
      setJoinedEmail(trimmed);
      setState('success');
      setEmail('');
      capture('pro_early_access_joined', { context });
    } catch {
      setError('Something went wrong. Please try again.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="vault-form vault-form-success" role="status">
        <p className="vault-form-success-title">You’re on the waitlist.</p>
        <p className="vault-form-success-copy">
          We’ll email you when Pro opens, plus the occasional update while we build it. Nothing to pay now.
        </p>
        <FollowUp email={joinedEmail} context={context} />
      </div>
    );
  }

  return (
    <form className="vault-form teams-form" onSubmit={handleSubmit} noValidate>
      <div className="vault-form-row">
        <label className="visually-hidden" htmlFor={`pro-email-${context}`}>
          Email address
        </label>
        <input
          id={`pro-email-${context}`}
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
          disabled={busy}
          required
        />
        <button className="button button-large" type="submit" disabled={busy}>
          {busy ? 'Joining…' : 'Join the waitlist'}
        </button>
      </div>
      {state === 'error' && error ? (
        <p className="vault-form-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="vault-form-note">
          We’ll only email you about Pro and its launch. Nothing else.
        </p>
      )}
    </form>
  );
}
