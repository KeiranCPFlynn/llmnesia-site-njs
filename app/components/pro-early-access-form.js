'use client';

import { useState } from 'react';

// Pro (Projects and Teams) early-access form. Mirrors the Vault waitlist
// pattern: the email is POSTed to /api/leads with its own source, and PostHog
// only ever sees an anonymous counter carrying the enum answers, never the email.
//
// The consent line promises Pro email only, so this list must never be used for
// general marketing.
//
// Values are fixed enums that MUST match ALLOWED_TEAM_SIZE, ALLOWED_TOOLS and
// ALLOWED_MODEL_ACCESS in api/leads.js; anything off-enum is dropped server-side.
const TEAM_SIZE_OPTIONS = [
  { value: 'just_me', label: 'Just me' },
  { value: '2_5', label: '2 to 5 people' },
  { value: '6_20', label: '6 to 20' },
  { value: 'more_20', label: 'More than 20' }
];
const TOOL_OPTIONS = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'claude_code', label: 'Claude Code' },
  { value: 'codex', label: 'Codex' },
  { value: 'other', label: 'Other' }
];
const MODEL_ACCESS_OPTIONS = [
  { value: 'api_key', label: 'I have an API key' },
  { value: 'coding_agent', label: 'I use Claude Code or Codex' },
  { value: 'neither', label: 'Neither yet' },
  { value: 'not_sure', label: 'Not sure' }
];

function PillGroup({ id, question, hint, options, isSelected, onToggle, disabled }) {
  return (
    <div className="vault-form-pill-group" role="group" aria-labelledby={id}>
      <span className="vault-form-feedback-label" id={id}>
        {question}
        {hint ? <span className="teams-form-hint"> {hint}</span> : null}
      </span>
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

export default function ProEarlyAccessForm({ context = 'teams_page' }) {
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [tools, setTools] = useState([]);
  const [modelAccess, setModelAccess] = useState('');
  const [state, setState] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const busy = state === 'submitting';

  function toggleTool(value) {
    setTools((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;

    if (!teamSize) {
      setError('Please tell us who would use it.');
      setState('error');
      return;
    }

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      setState('error');
      return;
    }

    setState('submitting');
    setError('');

    const answers = {
      team_size: teamSize,
      ...(tools.length ? { tools: tools.join(',') } : {}),
      ...(modelAccess ? { model_access: modelAccess } : {})
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          source: 'website_pro_early_access',
          context,
          ...answers,
          captured_at: new Date().toISOString(),
          page_path: typeof window !== 'undefined' ? window.location.pathname : '/teams'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        setError('Something went wrong. Please try again.');
        setState('error');
        return;
      }

      // Mark success before analytics so a PostHog failure can never mask a
      // completed signup.
      setState('success');
      setEmail('');

      try {
        if (typeof window !== 'undefined' && window.posthog) {
          window.posthog.capture('pro_early_access_joined', { context, ...answers });
        }
      } catch (phError) {
        console.error('[pro] PostHog capture failed:', phError);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="vault-form vault-form-success" role="status">
        <p className="vault-form-success-title">You’re on the early-access list.</p>
        <p className="vault-form-success-copy">
          Thanks! We’ll email you when your spot opens, plus the occasional update while we build
          it.
        </p>
      </div>
    );
  }

  return (
    <form className="vault-form teams-form" onSubmit={handleSubmit} noValidate>
      <div className="vault-form-questions">
        <PillGroup
          id={`pro-team-size-${context}`}
          question="Who would use it?"
          options={TEAM_SIZE_OPTIONS}
          isSelected={(value) => teamSize === value}
          onToggle={(value) => {
            setTeamSize(teamSize === value ? '' : value);
            if (state === 'error') setState('idle');
          }}
          disabled={busy}
        />
        <PillGroup
          id={`pro-tools-${context}`}
          question="Which do you use for project work?"
          hint="Pick any."
          options={TOOL_OPTIONS}
          isSelected={(value) => tools.includes(value)}
          onToggle={toggleTool}
          disabled={busy}
        />
        <PillGroup
          id={`pro-model-${context}`}
          question="How would you power board updates?"
          options={MODEL_ACCESS_OPTIONS}
          isSelected={(value) => modelAccess === value}
          onToggle={(value) => setModelAccess(modelAccess === value ? '' : value)}
          disabled={busy}
        />
      </div>
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
          {busy ? 'Joining…' : 'Join early access'}
        </button>
      </div>
      {state === 'error' && error ? (
        <p className="vault-form-error" role="alert">
          {error}
        </p>
      ) : (
        <p className="vault-form-note">
          We’ll only email you about Pro early access and launch. Nothing else.
        </p>
      )}
    </form>
  );
}
