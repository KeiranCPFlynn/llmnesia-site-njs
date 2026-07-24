// Sends the install-link email the mobile blog CTA promises ("Email me the
// link"). Before this existed the CTA only wrote the address to the leads
// sheet, so the success copy was a claim we never kept.
//
// Delivery goes through Resend's REST API over plain fetch — no SDK dependency,
// and nothing here is Resend-specific beyond `sendViaResend()`, so swapping
// providers means rewriting one function.
//
// Required env:
//   RESEND_API_KEY   Resend API key (re_...). Absent = emails are skipped, the
//                    lead is still captured, and the caller is told `sent:false`
//                    so the UI can fall back to honest copy instead of lying.
// Optional env:
//   LEADS_FROM_EMAIL Verified sender, e.g. "LLMnesia <hello@llmnesia.com>".
//                    Must be on a domain verified in Resend or sends 403.
//   LEADS_REPLY_TO   Reply-to address for replies to the install email.
import { CHROME_WEB_STORE_URL } from './site';
import { PLATFORM_COUNT } from './platforms';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'LLMnesia <hello@llmnesia.com>';
const SUBJECT = 'Your LLMnesia install link';

// The lead POST waits on this, so it has to fail fast rather than hold the
// request open until the platform's own function timeout.
const SEND_TIMEOUT_MS = 8000;

// Store URL tagged so installs that came from this email are separable from the
// desktop inline-CTA installs in GA (which use utm_medium=inline_cta).
export function installLinkUrl() {
  const url = new URL(CHROME_WEB_STORE_URL);
  url.searchParams.set('utm_source', 'email');
  url.searchParams.set('utm_medium', 'install_email');
  url.searchParams.set('utm_campaign', 'mobile_install_link');
  return url.toString();
}

function buildText(link) {
  return [
    'Here is your LLMnesia install link:',
    '',
    link,
    '',
    'Open it on your computer — LLMnesia is a free Chrome extension for desktop.',
    '',
    `Once it is installed it keeps a private, searchable copy of your chats across ${PLATFORM_COUNT} AI platforms, including ChatGPT, Claude and Gemini. Everything is indexed locally on your own device. Nothing is uploaded.`,
    '',
    'You are receiving this because you asked for the install link at www.llmnesia.com.',
    ''
  ].join('\n');
}

function buildHtml(link) {
  // Inline styles only, no external assets: email clients strip <style> blocks
  // and block remote images by default.
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6f6f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e1;border-radius:12px;padding:28px;">
      <p style="margin:0 0 20px;font-size:16px;line-height:1.55;">Here is your LLMnesia install link.</p>
      <p style="margin:0 0 24px;">
        <a href="${link}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 20px;border-radius:8px;">Add LLMnesia to Chrome — free</a>
      </p>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.55;">Open it on your computer. LLMnesia is a free Chrome extension for desktop.</p>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.55;">Once it is installed it keeps a private, searchable copy of your chats across ${PLATFORM_COUNT} AI platforms, including ChatGPT, Claude and Gemini. Everything is indexed locally on your own device. Nothing is uploaded.</p>
      <p style="margin:0 0 4px;font-size:13px;line-height:1.5;color:#6b6b66;">If the button does not work, paste this into Chrome:</p>
      <p style="margin:0 0 24px;font-size:13px;line-height:1.5;word-break:break-all;"><a href="${link}" style="color:#6b6b66;">${link}</a></p>
      <p style="margin:0;padding-top:16px;border-top:1px solid #e5e5e1;font-size:12px;line-height:1.5;color:#6b6b66;">You are receiving this because you asked for the install link at <a href="https://www.llmnesia.com" style="color:#6b6b66;">www.llmnesia.com</a>.</p>
    </div>
  </body>
</html>`;
}

async function sendViaResend(apiKey, message) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS)
  });

  if (response.ok) {
    return { sent: true };
  }

  // Resend returns {name, message} on failure; `name` is the stable machine
  // code (validation_error, missing_api_key, ...) worth putting in the log.
  let reason = `http_${response.status}`;
  try {
    const body = await response.json();
    if (body && typeof body.name === 'string') {
      reason = body.name;
    }
  } catch {
    // Non-JSON error body — the status code is enough to act on.
  }

  return { sent: false, reason };
}

// Sends the install link to `email`. Never throws: the caller must still be able
// to capture the lead when delivery fails.
export async function sendInstallLinkEmail(email) {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    return { sent: false, reason: 'not_configured' };
  }

  const link = installLinkUrl();
  const replyTo = (process.env.LEADS_REPLY_TO || '').trim();
  const message = {
    from: (process.env.LEADS_FROM_EMAIL || '').trim() || DEFAULT_FROM,
    to: [email],
    subject: SUBJECT,
    text: buildText(link),
    html: buildHtml(link),
    ...(replyTo && { reply_to: replyTo })
  };

  try {
    return await sendViaResend(apiKey, message);
  } catch (error) {
    return { sent: false, reason: error?.name === 'TimeoutError' ? 'timeout' : 'network_error' };
  }
}
