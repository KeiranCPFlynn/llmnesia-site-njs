import { sendInstallLinkEmail } from '../../../lib/install-email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set([
  'website_homepage',
  'extension_onboarding',
  'extension_founding',
  'extension_vault_waitlist',
  'website_vault_waitlist',
  'blog_mobile_capture'
]);

// Fixed-enum segmentation answers captured on the Vault waitlist confirmation
// ("Who would use this?" / "Where do you want to search from?"). Normalized to a
// known value or '' so a spoofed value can never reach the sheet as free text.
const ALLOWED_AUDIENCE = new Set(['just_me', 'my_team', 'a_community', 'not_sure']);
const ALLOWED_SEARCH_FROM = new Set(['desktop', 'phone', 'browser', 'all']);

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function normalizeString(value, maxLength = 200) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function normalizeEmail(value) {
  return normalizeString(value, 320).toLowerCase();
}

function normalizeSource(value) {
  const source = normalizeString(value, 80);
  return ALLOWED_SOURCES.has(source) ? source : 'website_homepage';
}

// Optional enum fields normalize to '' (not a fallback) when off-enum: an absent
// answer is meaningful, so it is forwarded empty rather than coerced to a guess.
function normalizeEnum(value, allowed) {
  const normalized = normalizeString(value, 40);
  return allowed.has(normalized) ? normalized : '';
}

// The upstream Apps Script keeps its own source allowlist that lags behind
// ALLOWED_SOURCES above — blog_mobile_capture is valid here but the script
// rejects it with `invalid_source`, so every mobile lead was silently lost.
// Until the script's allowlist is updated in the Google editor, forward these
// sources under one it accepts; the true source is preserved in `variant` for
// sheet-side segmentation. Remove an entry once the script accepts it.
const WEBHOOK_SOURCE_FALLBACK = {
  blog_mobile_capture: 'website_homepage'
};

// Sources whose form copy promises the reader an email ("Email me the link").
// Only these trigger a send; every other source is list capture only.
const EMAIL_LINK_SOURCES = new Set(['blog_mobile_capture']);

// Sending mail to an address supplied by an unauthenticated caller needs a cap,
// or the endpoint becomes a way to mail strangers on our domain's reputation.
// The message body is fixed and carries no caller-supplied content, so the worst
// case is repetition — this throttle is about volume, not content.
//
// In-memory means the window is per function instance rather than global. That
// is enough to stop a naive loop; a distributed flood needs a shared store.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_SENDS = 5;
const sendHistory = new Map();

function clientKey(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  return forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

function withinSendLimit(key) {
  const now = Date.now();

  // Piggyback eviction on the write path — no timer to leak in a serverless
  // instance that may be frozen between requests.
  for (const [entryKey, timestamps] of sendHistory) {
    const live = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (live.length === 0) {
      sendHistory.delete(entryKey);
    } else {
      sendHistory.set(entryKey, live);
    }
  }

  const recent = sendHistory.get(key) || [];
  if (recent.length >= RATE_LIMIT_MAX_SENDS) {
    return false;
  }

  sendHistory.set(key, [...recent, now]);
  return true;
}

function normalizeLeadBody(body) {
  return {
    email: body.email,
    source: body.source,
    context: body.context,
    variant: body.variant,
    feedback: body.feedback,
    audience: body.audience,
    search_from: body.search_from,
    captured_at: body.captured_at,
    install_id: body.install_id,
    install_ts: body.install_ts,
    extension_version: body.extension_version,
    page_path: body.page_path
  };
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function forwardLead(payload) {
  const webhookUrl = (process.env.LEADS_WEBHOOK_URL || '').trim();
  if (!webhookUrl) {
    return { submitted: false, reason: 'missing_webhook' };
  }

  const headers = {
    'Content-Type': 'text/plain;charset=utf-8'
  };
  const webhookKey = (process.env.LEADS_WEBHOOK_KEY || '').trim();
  if (webhookKey) {
    headers['x-llmnesia-key'] = webhookKey;
  }

  let targetUrl = webhookUrl;
  if (webhookKey) {
    try {
      const url = new URL(webhookUrl);
      url.searchParams.set('key', webhookKey);
      targetUrl = url.toString();
    } catch {
      targetUrl = webhookUrl;
    }
  }

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return { submitted: false, reason: 'webhook_error' };
  }

  const responseText = await response.text();
  if (responseText) {
    try {
      const data = JSON.parse(responseText);
      if (data && typeof data === 'object') {
        if (data.success === false || data.ok === false) {
          return {
            submitted: false,
            reason: normalizeString(data.error, 120) || 'webhook_rejected'
          };
        }
        if (data.success === true || data.ok === true) {
          return { submitted: true };
        }
      }
    } catch {
      return { submitted: false, reason: 'invalid_webhook_response' };
    }
  }

  return { submitted: true };
}

export async function OPTIONS() {
  return jsonResponse({ ok: true });
}

export async function POST(request) {
  const body = await readJson(request);
  if (!body || typeof body !== 'object') {
    return jsonResponse({ success: false, error: 'Invalid JSON body.' }, 400);
  }

  const lead = normalizeLeadBody(body);
  const email = normalizeEmail(lead.email);
  if (!EMAIL_RE.test(email)) {
    return jsonResponse({ success: false, error: 'Please enter a valid email address.' }, 400);
  }

  const requestedSource = normalizeSource(lead.source);
  const fallbackSource = WEBHOOK_SOURCE_FALLBACK[requestedSource];
  const requestedContext = normalizeString(lead.context, 120);

  const payload = {
    email,
    source: fallbackSource || requestedSource,
    // When we fall back the source, prefix the true source into context so the
    // sheet can still identify mobile-capture leads; variant keeps the family.
    context: fallbackSource
      ? normalizeString(`${requestedSource}:${requestedContext}`, 120)
      : requestedContext,
    variant: normalizeString(lead.variant, 40),
    feedback: normalizeString(lead.feedback, 2000),
    audience: normalizeEnum(lead.audience, ALLOWED_AUDIENCE),
    search_from: normalizeEnum(lead.search_from, ALLOWED_SEARCH_FROM),
    captured_at: normalizeString(lead.captured_at, 80) || new Date().toISOString(),
    install_id: normalizeString(lead.install_id, 120),
    install_ts: Number.isFinite(Number(lead.install_ts)) ? Math.floor(Number(lead.install_ts)) : 0,
    extension_version: normalizeString(lead.extension_version, 40),
    page_path: normalizeString(lead.page_path, 200),
    user_agent: normalizeString(request.headers.get('user-agent'), 300)
  };

  const promisesEmail = EMAIL_LINK_SOURCES.has(requestedSource);

  try {
    // Independent of each other on purpose: a reader who was promised the link
    // should get it even if the sheet is down, and a lead should still land if
    // the mail provider is down. The response reports each outcome separately.
    const [leadResult, emailResult] = await Promise.all([
      forwardLead(payload).catch(() => ({ submitted: false, reason: 'webhook_exception' })),
      promisesEmail
        ? withinSendLimit(clientKey(request))
          ? sendInstallLinkEmail(email)
          : Promise.resolve({ sent: false, reason: 'rate_limited' })
        : Promise.resolve({ sent: false, reason: 'not_requested' })
    ]);

    if (promisesEmail && !emailResult.sent) {
      // Surfaces in Vercel runtime logs. `not_configured` here means
      // RESEND_API_KEY is unset — see lib/install-email.js.
      console.error(`[leads] install email not sent (${emailResult.reason})`);
    }

    if (!leadResult.submitted) {
      console.error(`[leads] webhook failed (${leadResult.reason})`);

      // The email is the thing the reader was promised. If it went out, the
      // request succeeded from their side and the lost row is ours to chase.
      if (!emailResult.sent) {
        return jsonResponse({
          success: false,
          error: leadResult.reason === 'missing_webhook' ? 'Lead webhook is not configured.' : `Lead webhook failed: ${leadResult.reason}.`
        }, 502);
      }
    }

    // `emailed` drives which success copy the client shows, so the UI never
    // claims an inbox delivery that did not happen.
    return jsonResponse({ success: true, emailed: emailResult.sent });
  } catch {
    return jsonResponse({ success: false, error: 'Lead submit failed.' }, 502);
  }
}
