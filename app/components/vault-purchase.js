'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  billingMessage,
  getVaultBillingClient,
  vaultFunctionError
} from '../../lib/vault-billing-client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function VaultPurchase({
  monthlyLabel = '£8',
  annualLabel = '£88',
  annualMonthlyLabel = '£7.33'
}) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [entitled, setEntitled] = useState(null);
  const [billingDetected, setBillingDetected] = useState(false);
  const [plan, setPlan] = useState('annual');

  const supabase = useMemo(() => {
    try {
      return getVaultBillingClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      setError('Vault checkout is not configured yet.');
      return undefined;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) {
      setEntitled(null);
      return;
    }
    let mounted = true;
    supabase.rpc('vault_entitlement').then(({ data }) => {
      if (mounted) setEntitled(data?.entitled === true);
    });
    return () => { mounted = false; };
  }, [session, supabase]);

  function clearFeedback() {
    setError('');
    setMessage('');
  }

  async function sendCode(event) {
    event.preventDefault();
    clearFeedback();
    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      setError('Please enter a valid email address.');
      return;
    }
    setBusy('email');
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { shouldCreateUser: true }
    });
    setBusy('');
    if (authError) {
      // Temporary acceptance-preview diagnostic. The customer-facing copy stays
      // generic, while the protected browser console reveals the provider reason.
      console.error(
        `[vault] OTP request failed: message=${authError.message}; status=${authError.status ?? 'none'}; code=${authError.code ?? 'none'}`
      );
      setError('We could not send the sign-in code. Please try again.');
      return;
    }
    setPendingEmail(normalized);
    setStep('code');
    setMessage('We sent a sign-in code to your email.');
  }

  async function verifyCode(event) {
    event.preventDefault();
    clearFeedback();
    const token = code.replace(/\s/g, '');
    if (!/^\d{6,8}$/.test(token)) {
      setError('Enter the code from your email.');
      return;
    }
    setBusy('code');
    const { data, error: authError } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token,
      type: 'email'
    });
    setBusy('');
    if (authError || !data.session) {
      setError('That code did not work or has expired. Request a new one and try again.');
      return;
    }
    setSession(data.session);
    setCode('');
    setMessage('Signed in. Choose your Vault plan below.');
  }

  async function startCheckout() {
    clearFeedback();
    setBusy('checkout');
    const requestId = crypto.randomUUID();
    const { data, error: functionError } = await supabase.functions.invoke('vault-create-checkout', {
      body: { plan, requestId }
    });
    setBusy('');
    if (functionError || typeof data?.url !== 'string') {
      const code = await vaultFunctionError(functionError, 'checkout_unavailable');
      if (code === 'subscription_already_exists') setBillingDetected(true);
      setError(billingMessage(code));
      return;
    }
    window.location.assign(data.url);
  }

  async function openPortal() {
    clearFeedback();
    setBusy('portal');
    const { data, error: functionError } = await supabase.functions.invoke('vault-create-portal');
    setBusy('');
    if (functionError || typeof data?.url !== 'string') {
      const code = await vaultFunctionError(functionError, 'portal_unavailable');
      setError(billingMessage(code));
      return;
    }
    window.location.assign(data.url);
  }

  async function signOut() {
    clearFeedback();
    setBusy('signout');
    await supabase.auth.signOut();
    setBusy('');
    setStep('email');
    setPendingEmail('');
    setSession(null);
  }

  if (!ready) return <p className="vault-purchase-loading">Checking your Vault account…</p>;

  if (!session) {
    return (
      <div id="vault-purchase" className="vault-purchase">
        <h3>Start with your Vault email</h3>
        <p className="vault-purchase-intro">
          Sign in first so Stripe can activate the same account your extension uses.
        </p>
        {step === 'email' ? (
          <form onSubmit={sendCode} className="vault-purchase-form" noValidate>
            <label htmlFor="vault-purchase-email">Email address</label>
            <input
              id="vault-purchase-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={busy !== '' || !supabase}
              placeholder="you@example.com"
              required
            />
            <button className="button" type="submit" disabled={busy !== '' || !supabase}>
              {busy === 'email' ? 'Sending…' : 'Continue with email'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="vault-purchase-form" noValidate>
            <label htmlFor="vault-purchase-code">Code sent to {pendingEmail}</label>
            <input
              id="vault-purchase-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              disabled={busy !== ''}
              placeholder="123456"
              required
            />
            <button className="button" type="submit" disabled={busy !== ''}>
              {busy === 'code' ? 'Checking…' : 'Verify and continue'}
            </button>
            <button
              className="vault-purchase-link"
              type="button"
              onClick={() => { setStep('email'); clearFeedback(); }}
              disabled={busy !== ''}
            >
              Use a different email
            </button>
          </form>
        )}
        {message ? <p className="vault-purchase-message" role="status">{message}</p> : null}
        {error ? <p className="vault-purchase-error" role="alert">{error}</p> : null}
      </div>
    );
  }

  return (
    <div id="vault-purchase" className="vault-purchase vault-purchase-signed-in">
      <div className="vault-purchase-account">
        <span>Signed in as</span>
        <strong>{session.user.email}</strong>
      </div>
      {entitled === null ? (
        <p className="vault-purchase-loading">Checking your Vault status…</p>
      ) : entitled === true ? (
        <div className="vault-purchase-active" role="status">
          <strong>Vault is active on this account.</strong>
          <span>Manage payment details, invoices, or cancellation in Stripe.</span>
        </div>
      ) : billingDetected ? (
        <div className="vault-purchase-active" role="status">
          <strong>Your Vault subscription is active in Stripe.</strong>
          <span>Manage billing below. If Vault has not unlocked yet, refresh this page in a moment.</span>
        </div>
      ) : (
        <>
          <fieldset className="vault-plan-picker">
            <legend>Choose billing frequency</legend>
            <label className={plan === 'annual' ? 'selected' : ''}>
              <input
                type="radio"
                name="vault-billing-frequency"
                value="annual"
                checked={plan === 'annual'}
                onChange={() => setPlan('annual')}
                disabled={busy !== ''}
              />
              <span>
                <strong>{annualLabel}/year</strong>
                <small>Works out to {annualMonthlyLabel}/month · One month free</small>
              </span>
            </label>
            <label className={plan === 'monthly' ? 'selected' : ''}>
              <input
                type="radio"
                name="vault-billing-frequency"
                value="monthly"
                checked={plan === 'monthly'}
                onChange={() => setPlan('monthly')}
                disabled={busy !== ''}
              />
              <span>
                <strong>{monthlyLabel}/month</strong>
                <small>Billed monthly</small>
              </span>
            </label>
          </fieldset>
          <button className="button vault-purchase-primary" type="button" onClick={startCheckout} disabled={busy !== ''}>
            {busy === 'checkout' ? 'Opening secure checkout…' : 'Start Vault securely'}
          </button>
          <p className="vault-purchase-note">Plus applicable tax. Payment is handled by Stripe, and you can cancel from the billing portal at any time.</p>
        </>
      )}
      <div className="vault-purchase-utilities">
        {entitled === true || billingDetected ? (
          <button className="vault-purchase-link" type="button" onClick={openPortal} disabled={busy !== ''}>
            {busy === 'portal' ? 'Opening…' : 'Manage billing'}
          </button>
        ) : null}
        <button className="vault-purchase-link" type="button" onClick={signOut} disabled={busy !== ''}>
          Sign out
        </button>
      </div>
      {message ? <p className="vault-purchase-message" role="status">{message}</p> : null}
      {error ? <p className="vault-purchase-error" role="alert">{error}</p> : null}
    </div>
  );
}
