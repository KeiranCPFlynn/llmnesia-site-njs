export function normalizeVaultEmail(value) {
  return value.trim().toLowerCase();
}

export function normalizeVaultCode(value) {
  return value.replace(/\s/g, '');
}

export function vaultAuthMessage(error, operation = 'send') {
  if (error?.code === 'over_email_send_rate_limit' || error?.code === 'over_request_rate_limit' || error?.status === 429) {
    return 'Too many attempts. Wait a few minutes before trying again. If a code has already arrived, use the most recent one.';
  }
  if (error?.code === 'email_address_invalid') return 'Check your email address for a typo, then try again.';
  if (error?.code === 'otp_disabled') {
    return 'Use the email for your existing Vault account. If you are new to Vault, start on the pricing page to create your account.';
  }
  if (operation === 'verify' && (error?.code === 'otp_expired' || error?.code === 'access_denied')) {
    return 'That code did not work. Use the most recent code sent to this email, or request a new one below.';
  }
  return operation === 'verify'
    ? 'We could not check that code right now. Check your connection and try again. You do not need to request another code yet.'
    : 'We could not send a code right now. Check your connection and try again in a few minutes. If this keeps happening, contact us below.';
}
