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
// Every assistant LLMnesia saves today, plus common coding tools it does not
// support yet, so the answers show exactly which platforms early users need.
const TOOL_GROUPS = [
  {
    label: 'Chat assistants',
    options: [
      { value: 'chatgpt', label: 'ChatGPT' },
      { value: 'claude', label: 'Claude' },
      { value: 'gemini', label: 'Gemini' },
      { value: 'google_ai_mode', label: 'Google AI Mode' },
      { value: 'ai_studio', label: 'Google AI Studio' },
      { value: 'copilot', label: 'Microsoft Copilot' },
      { value: 'perplexity', label: 'Perplexity' },
      { value: 'grok', label: 'Grok' },
      { value: 'deepseek', label: 'DeepSeek' },
      { value: 'mistral', label: 'Mistral Le Chat' },
      { value: 'meta_ai', label: 'Meta AI' },
      { value: 'qwen', label: 'Qwen' },
      { value: 'kimi', label: 'Kimi' },
      { value: 'zai', label: 'Z.ai' }
    ]
  },
  {
    label: 'Coding tools',
    options: [
      { value: 'claude_code', label: 'Claude Code' },
      { value: 'codex', label: 'Codex' },
      { value: 'zcode', label: 'ZCode' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'github_copilot', label: 'GitHub Copilot' },
      { value: 'windsurf', label: 'Windsurf' },
      { value: 'gemini_cli', label: 'Gemini CLI' }
    ]
  }
];
const MODEL_ACCESS_OPTIONS = [
  { value: 'api_key', label: 'I have an API key' },
  { value: 'coding_agent', label: 'I use Claude Code, Codex or ZCode' },
  { value: 'neither', label: 'Neither yet' },
  { value: 'not_sure', label: 'Not sure' }
];

function PillGroup({ id, question, hint, note, options, isSelected, onToggle, disabled }) {
  return (
    <div className="vault-form-pill-group" role="group" aria-labelledby={id}>
      <span className="vault-form-feedback-label" id={id}>
        {question}
        {hint ? <span className="teams-form-hint"> {hint}</span> : null}
      </span>
      {note ? <p className="teams-form-note">{note}</p> : null}
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

export default function ProEarlyAccessForm({ context = 'pro_page' }) {
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [tools, setTools] = useState([]);
  const [toolsOther, setToolsOther] = useState('');
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
      ...(toolsOther.trim() ? { tools_other: toolsOther.trim().slice(0, 120) } : {}),
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
          page_path: typeof window !== 'undefined' ? window.location.pathname : '/pro'
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
          // Enum answers only: the free-text tools answer never goes to PostHog.
          const { tools_other: _omit, ...enumAnswers } = answers;
          window.posthog.capture('pro_early_access_joined', { context, ...enumAnswers });
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
        <div className="vault-form-pill-group" role="group" aria-labelledby={`pro-tools-${context}`}>
          <span className="vault-form-feedback-label" id={`pro-tools-${context}`}>
            Which AI tools do you use for project work?
            <span className="teams-form-hint"> Pick all that apply.</span>
          </span>
          {TOOL_GROUPS.map((group) => (
            <div className="teams-tool-group" key={group.label}>
              <span className="teams-tool-group-label">{group.label}</span>
              <div className="vault-form-pills">
                {group.options.map((option) => {
                  const selected = tools.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`vault-form-pill${selected ? ' selected' : ''}`}
                      aria-pressed={selected}
                      onClick={() => toggleTool(option.value)}
                      disabled={busy}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <label className="visually-hidden" htmlFor={`pro-tools-other-${context}`}>
            Any other AI tools you use
          </label>
          <input
            id={`pro-tools-other-${context}`}
            className="teams-form-other"
            type="text"
            maxLength={120}
            placeholder="Anything else? Tell us which tools"
            value={toolsOther}
            onChange={(event) => setToolsOther(event.target.value)}
            disabled={busy}
          />
        </div>
        <PillGroup
          id={`pro-model-${context}`}
          question="Which AI would write your boards?"
          note="Pro needs an AI to turn your chats into boards: an OpenAI, Anthropic or OpenRouter API key, or a coding agent you already use. You pay them directly."
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
