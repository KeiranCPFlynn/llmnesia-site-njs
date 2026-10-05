'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { normalizeVaultCode, normalizeVaultEmail, vaultAuthMessage } from '../../lib/vault-sign-in';
import {
  billingMessage,
  getVaultBillingClient,
  vaultFunctionError
} from '../../lib/vault-billing-client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function VaultPurchase({
  monthlyLabel = '£8',
  annualLabel = '£88',
  annualMonthlyLabel = '£7.33',
  accountOnly = false
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
  const [checkoutReturn, setCheckoutReturn] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);
  const [statusError, setStatusError] = useState('');
  const [statusRevision, setStatusRevision] = useState(0);
  const working = useRef(false);

  useEffect(() => {
    if (!resendSeconds) return undefined;
    const timer = window.setTimeout(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  function startWork(kind) {
    if (working.current || !supabase) return false;
    working.current = true;
    clearFeedback();
    setBusy(kind);
    return true;
  }

  function finishWork() {
    working.current = false;
    setBusy('');
  }

  const supabase = useMemo(() => {
    try {
      return getVaultBillingClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    setCheckoutReturn(new URLSearchParams(window.location.search).get('checkout') || '');
  }, []);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      setError('Vault checkout is not configured yet.');
      return undefined;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) throw sessionError;
      if (!mounted) return;
      setSession(data.session ?? null);
      setReady(true);
    }).catch(() => {
      if (!mounted) return;
      setReady(true);
      setError('We could not restore your sign-in. You can request a new code below.');
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
      return undefined;
    }
    let mounted = true;
    let retryTimer;
    let attempts = 0;
    setEntitled(null);
    setStatusError('');
    setBillingDetected(false);

    async function checkEntitlement() {
      try {
        const { data, error: lookupError } = await supabase.rpc('vault_entitlement');
        if (lookupError || typeof data?.entitled !== 'boolean') throw lookupError || new Error('status_unavailable');
        if (!mounted) return;
        const active = data.entitled;
        setEntitled(active);
        attempts += 1;
        if (checkoutReturn === 'success' && !active && attempts < 8) {
          retryTimer = window.setTimeout(checkEntitlement, 1500);
        }
      } catch {
        if (mounted) setStatusError('We could not check your subscription right now. You are still signed in.');
      }
    }

    checkEntitlement();
    return () => {
      mounted = false;
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [checkoutReturn, session, supabase, statusRevision]);

  function clearFeedback() {
    setError('');
    setMessage('');
  }

  async function sendCode(event) {
    event.preventDefault();
    if (working.current) return;
    clearFeedback();
    const normalized = normalizeVaultEmail(email);
    if (!EMAIL_RE.test(normalized)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!startWork('email')) return;
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalized,
        options: { shouldCreateUser: !accountOnly }
      });
      if (authError) throw authError;
      setEmail(normalized);
      setPendingEmail(normalized);
      setCode('');
      setStep('code');
      setResendSeconds(60);
      setMessage('Code sent. Check your inbox and spam folder.');
    } catch (authError) {
      setError(vaultAuthMessage(authError));
    } finally {
      finishWork();
    }
  }

  async function resendCode() {
    if (!pendingEmail || resendSeconds || !startWork('resend')) return;
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: pendingEmail, options: { shouldCreateUser: !accountOnly }
      });
      if (authError) throw authError;
      setCode('');
      setResendSeconds(60);
      setMessage('New code sent. Use the code in the most recent email.');
    } catch (authError) {
      setError(vaultAuthMessage(authError));
      if (authError?.status === 429) setResendSeconds(60);
    } finally {
      finishWork();
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    if (working.current) return;
    clearFeedback();
    const token = normalizeVaultCode(code);
    if (!/^\d{6,8}$/.test(token)) {
      setError('Enter the code from your email.');
      return;
    }
    if (!startWork('code')) return;
    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({ email: pendingEmail, token, type: 'email' });
      if (authError) throw authError;
      if (!data.session) throw new Error('session_missing');
      setSession(data.session);
      setCode('');
      setMessage('Email confirmed. Checking your Vault account so you can continue.');
    } catch (authError) {
      setError(vaultAuthMessage(authError, 'verify'));
    } finally {
      finishWork();
    }
  }

  async function startCheckout() {
    if (!startWork('checkout')) return;
    try {
      const requestId = crypto.randomUUID();
      const { data, error: functionError } = await supabase.functions.invoke('vault-create-checkout', {
        body: { plan, requestId }
      });
      if (functionError || typeof data?.url !== 'string') {
        const code = await vaultFunctionError(functionError, 'checkout_unavailable');
        if (code === 'subscription_already_exists') setBillingDetected(true);
        setError(billingMessage(code));
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError(billingMessage('checkout_unavailable'));
    } finally {
      finishWork();
    }
  }

  async function openPortal() {
    if (!startWork('portal')) return;
    try {
      const { data, error: functionError } = await supabase.functions.invoke('vault-create-portal');
      if (functionError || typeof data?.url !== 'string') {
        const code = await vaultFunctionError(functionError, 'portal_unavailable');
        setError(billingMessage(code));
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError(billingMessage('portal_unavailable'));
    } finally {
      finishWork();
    }
  }

  async function signOut() {
    if (!startWork('signout')) return;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setStep('email');
      setPendingEmail('');
      setSession(null);
      setCode('');
      setBillingDetected(false);
    } catch {
      setError('We could not sign you out. Check your connection and try again.');
    } finally {
      finishWork();
    }
  }

  if (!ready) return <p className="vault-purchase-loading">Checking your Vault account…</p>;

  if (!session) {
    return (
      <div id="vault-purchase" className="vault-purchase" tabIndex={-1}>
        <h3>{accountOnly ? 'Sign in to manage Vault' : 'Get started with Vault'}</h3>
        <p className="vault-purchase-intro">
          {accountOnly
            ? 'Use the same email as your extension. You can then view your Vault status and manage billing, invoices, or cancellation.'
            : 'New to Vault? Enter the email you want to use. Already use Vault in the extension? Use that same email. We will send a sign-in code, then you can choose your plan.'}
        </p>
        {checkoutReturn === 'success' && !accountOnly ? (
          <div className="vault-purchase-success" role="status">
            <span className="vault-purchase-success-icon" aria-hidden="true">✓</span>
            <div>
              <span className="vault-purchase-success-kicker">Back from checkout</span>
              <strong>Confirm your Vault subscription.</strong>
              <p>
                Sign in with the email you used at checkout so we can check your subscription.
                After activation, finish setup in LLMnesia Settings on your computer.
              </p>
            </div>
          </div>
        ) : checkoutReturn === 'cancelled' ? (
          <p className="vault-purchase-message" role="status">
            Checkout was cancelled. No charge was made.
          </p>
        ) : null}
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
              {busy === 'email' ? 'Sending…' : 'Email me a code'}
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
              placeholder="8-digit code"
              required
            />
            <button className="button" type="submit" disabled={busy !== ''}>
              {busy === 'code' ? 'Checking…' : 'Verify and continue'}
            </button>
            <button
              className="vault-purchase-link"
              type="button"
              onClick={resendCode}
              disabled={busy !== '' || resendSeconds > 0}
            >
              {busy === 'resend' ? 'Sending…' : resendSeconds > 0 ? `Send another code in ${resendSeconds}s` : 'Send another code'}
            </button>
            <button
              className="vault-purchase-link"
              type="button"
              onClick={() => { setStep('email'); setCode(''); clearFeedback(); }}
              disabled={busy !== ''}
            >
              Use a different email
            </button>
          </form>
        )}
        {message ? <p className="vault-purchase-message" role="status">{message}</p> : null}
        {error ? <p className="vault-purchase-error" role="alert">{error}</p> : null}
        <p className="vault-purchase-note">Need a hand? <a href="/contact">Contact us</a>.</p>
      </div>
    );
  }

  return (
    <div id="vault-purchase" className="vault-purchase vault-purchase-signed-in" tabIndex={-1}>
      {checkoutReturn === 'success' && !accountOnly ? (
        <div className="vault-purchase-success" role="status">
          <span className="vault-purchase-success-icon" aria-hidden="true">✓</span>
          <div>
            <span className="vault-purchase-success-kicker">Back from checkout</span>
            <strong>{entitled === true ? 'You’re subscribed to Vault.' : 'Confirming your Vault subscription.'}</strong>
            <p>
              Next, go back to LLMnesia Settings on this computer. The Vault panel confirms your
              subscription automatically, then you create or unlock your private Vault. If it
              hasn’t appeared yet, click “I’ve subscribed, check again”.
            </p>
          </div>
        </div>
      ) : null}
      <div className="vault-purchase-account">
        <span>Signed in as</span>
        <strong>{session.user.email}</strong>
      </div>
      {checkoutReturn === 'cancelled' ? (
        <p className="vault-purchase-message" role="status">
          Checkout was cancelled. No charge was made.
        </p>
      ) : null}
      {statusError ? (
        <div role="alert">
          <p className="vault-purchase-error">{statusError}</p>
          <button className="vault-purchase-link" type="button" onClick={() => setStatusRevision((value) => value + 1)}>Check again</button>
        </div>
      ) : entitled === null ? (
        <p className="vault-purchase-loading">Checking your Vault status…</p>
      ) : entitled === true ? (
        <div className="vault-purchase-active" role="status">
          <strong>Vault is active on this account.</strong>
          <span>Manage payment details, invoices, or cancellation in Stripe.</span>
        </div>
      ) : billingDetected ? (
        <div className="vault-purchase-active" role="status">
          <strong>A Vault subscription already exists for this account.</strong>
          <span>Manage billing below to check its payment and subscription status.</span>
        </div>
      ) : checkoutReturn === 'success' ? (
        <div className="vault-purchase-active" role="status">
          <strong>Your subscription is not confirmed yet.</strong>
          <span>We have not confirmed an active subscription for this email yet. Make sure this is the email you used at checkout.</span>
        </div>
      ) : accountOnly ? (
        <div className="vault-purchase-active" role="status">
          <strong>Vault is not active on this account yet.</strong>
          <span>
            If you already subscribed, manage billing below while activation catches up. Otherwise,
            visit the <a href="/pricing">Vault pricing page</a>.
          </span>
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
          <p className="vault-purchase-note">Your email is confirmed. Your subscription starts after you complete payment in Stripe. Plus applicable tax. Cancel any time through the billing portal.</p>
        </>
      )}
      <div className="vault-purchase-utilities">
        {entitled === false && (accountOnly || checkoutReturn === 'success') ? (
          <button className="vault-purchase-link" type="button" onClick={() => setStatusRevision((value) => value + 1)} disabled={busy !== ''}>Check subscription again</button>
        ) : null}
        {entitled === true || billingDetected || accountOnly || checkoutReturn === 'success' ? (
          <button
            className={checkoutReturn === 'success' ? 'button vault-purchase-billing' : 'vault-purchase-link'}
            type="button"
            onClick={openPortal}
            disabled={busy !== ''}
          >
            {busy === 'portal' ? 'Opening Stripe…' : 'Manage subscription in Stripe'}
          </button>
        ) : null}
        <button className="vault-purchase-link" type="button" onClick={signOut} disabled={busy !== ''}>
          Sign out
        </button>
      </div>
      {message ? <p className="vault-purchase-message" role="status">{message}</p> : null}
      {error ? <p className="vault-purchase-error" role="alert">{error}</p> : null}
      {error || statusError ? <p className="vault-purchase-note">Need a hand? <a href="/contact">Contact us</a>.</p> : null}
    </div>
  );
}
