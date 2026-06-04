const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = new Set([
  'website_homepage',
  'extension_onboarding',
  'extension_founding'
]);

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

function normalizeLeadBody(body) {
  return {
    email: body.email,
    source: body.source,
    context: body.context,
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

  const payload = {
    email,
    source: normalizeSource(lead.source),
    context: normalizeString(lead.context, 120),
    captured_at: normalizeString(lead.captured_at, 80) || new Date().toISOString(),
    install_id: normalizeString(lead.install_id, 120),
    install_ts: Number.isFinite(Number(lead.install_ts)) ? Math.floor(Number(lead.install_ts)) : 0,
    extension_version: normalizeString(lead.extension_version, 40),
    page_path: normalizeString(lead.page_path, 200),
    user_agent: normalizeString(request.headers.get('user-agent'), 300)
  };

  try {
    const result = await forwardLead(payload);
    if (!result.submitted) {
      return jsonResponse({
        success: false,
        error: result.reason === 'missing_webhook' ? 'Lead webhook is not configured.' : `Lead webhook failed: ${result.reason}.`
      }, 502);
    }

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse({ success: false, error: 'Lead submit failed.' }, 502);
  }
}
