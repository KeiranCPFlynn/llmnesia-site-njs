/**
 * Leads webhook for llmnesia.com (Google Apps Script, bound to the leads
 * spreadsheet). Deployed as a web app; `api/leads.js` on the site POSTs here.
 *
 * This file is the source of truth. Edit it here, then paste into the Apps
 * Script editor, so the script is never only in Google's editor.
 *
 * CONSENT MODEL — the reason for the tab split, read before changing routing:
 *
 *   Sheet1  general / outreach leads. The capture copy for these sources
 *           promises "the occasional feature preview" and similar, so these
 *           are marketable contacts.
 *   Vault   Vault waitlist. Copy promised "a note or two about Vault, then we
 *           tell you when it's ready" — consent is scoped to Vault.
 *   Mobile  mobile install-link requests. The form says "Email me the link" /
 *           "No spam. Just the install link." That is single-purpose
 *           transactional consent plus an explicit counter-promise, so these
 *           addresses are NOT marketable unless the row's `marketing_opt_in`
 *           is TRUE.
 *
 * Mobile gets its own tab specifically so a marketing export cannot sweep
 * these addresses up by accident. Before this split they landed in Sheet1
 * relabelled as `website_homepage`, indistinguishable from real homepage
 * signups by source alone. Do not route them back into Sheet1.
 */

const SHEET_NAME = 'Sheet1';        // general / outreach leads
const VAULT_SHEET_NAME = 'Vault';   // Vault waitlist interest (same spreadsheet, separate tab)
const MOBILE_SHEET_NAME = 'Mobile'; // mobile install-link requests (transactional consent only)

const ALLOWED_SOURCES = [
  'extension_onboarding',
  'website_homepage',
  'extension_founding',
  'website_vault_waitlist',
  'extension_vault_waitlist',
  'blog_mobile_capture'
];

// Header row, written ONLY when a tab has to be created from scratch.
// (Your existing Sheet1 headers are never modified.) The Vault tab also gets
// 'feedback', 'variant', 'audience', and 'search_from' columns, and the Mobile
// tab gets 'marketing_opt_in', all added lazily by ensureColumn() below so an
// existing tab is upgraded in place without manual editing.
const HEADERS = [
  'captured_at',
  'email',
  'source',
  'context',
  'install_id',
  'install_ts',
  'extension_version',
  'page_path',
  'user_agent'
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function doPost(e) {
  let lock = null;

  try {
    const secret = PropertiesService
      .getScriptProperties()
      .getProperty('LLMNESIA_WEBHOOK_KEY') || '';

    const providedKey = e && e.parameter && e.parameter.key
      ? String(e.parameter.key)
      : '';

    if (secret && providedKey !== secret) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const raw = e && e.postData && e.postData.contents
      ? e.postData.contents
      : '';

    const body = raw ? JSON.parse(raw) : {};

    const email = String(body.email || '').trim().toLowerCase();
    const source = String(body.source || '').trim();
    const context = String(body.context || '').trim();

    if (!EMAIL_RE.test(email)) {
      return jsonResponse({ ok: false, error: 'invalid_email' });
    }

    if (!ALLOWED_SOURCES.includes(source)) {
      return jsonResponse({ ok: false, error: 'invalid_source' });
    }

    // Route vault interest and mobile install-link requests to their own tabs;
    // everything else to the main sheet.
    const sheetName = sheetNameForSource(source);
    const isVault = sheetName === VAULT_SHEET_NAME;
    const isMobile = sheetName === MOBILE_SHEET_NAME;
    const sheet = getOrCreateSheet(sheetName);

    lock = LockService.getScriptLock();
    lock.waitLock(5000);

    // The follow-up answer arrives as a SEPARATE POST (same email) after signup,
    // so the site never blocks the signup on the question. Detect that here.
    // A pill-only answer (audience/search_from, no free text) still counts as
    // a follow-up — the extension and site both fire this POST on any of the
    // three being present, not just free text.
    const feedback = String(body.feedback || '').trim();
    const variant = String(body.variant || '').trim();
    const audience = String(body.audience || '').trim();
    const searchFrom = String(body.search_from || '').trim();
    const hasFeedback = feedback !== '';
    const hasFollowUp = hasFeedback || audience !== '' || searchFrom !== '';

    // Marketing consent is a hard boolean and defaults to false. Anything that
    // is not an explicit affirmative is no consent, so a malformed body, a
    // missing field, or an older cached client can never manufacture an opt-in.
    const marketingOptIn = normalizeOptIn(body.marketing_opt_in);

    // Ensure the Vault tab has feedback/variant/audience/search_from columns,
    // and the Mobile tab a marketing_opt_in column (added on first use).
    let feedbackCol = 0;
    let variantCol = 0;
    let audienceCol = 0;
    let searchFromCol = 0;
    let optInCol = 0;
    if (isVault) {
      feedbackCol = ensureColumn(sheet, 'feedback');
      variantCol = ensureColumn(sheet, 'variant');
      audienceCol = ensureColumn(sheet, 'audience');
      searchFromCol = ensureColumn(sheet, 'search_from');
    }
    if (isMobile) {
      optInCol = ensureColumn(sheet, 'marketing_opt_in');
    }

    const lastRow = sheet.getLastRow();

    // Dedupe by email in column B — per tab, so the same person can appear on
    // both the outreach list and the Vault list, but never twice in one tab.
    let existingRow = -1;
    if (lastRow > 1) {
      const emails = sheet
        .getRange(2, 2, lastRow - 1, 1)
        .getValues();

      for (let i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).trim().toLowerCase() === email) {
          existingRow = i + 2; // +2: row 1 is headers, range starts at row 2
          break;
        }
      }
    }

    if (existingRow > -1) {
      // Mobile: someone asking for the link again, having now ticked the box,
      // is a fresh consent event, so upgrade the stored value.
      //
      // Deliberately one-way. An unticked repeat request is NOT a withdrawal:
      // withdrawing consent is what the unsubscribe link is for, and someone
      // who just wants the install link again should not silently lose a
      // choice they made earlier. Only ever false -> true here.
      if (isMobile && optInCol > 0) {
        if (marketingOptIn) {
          sheet.getRange(existingRow, optInCol).setValue(true);
          return jsonResponse({ ok: true, updated: true });
        }
        return jsonResponse({ ok: true, deduped: true });
      }

      // Email already on this tab. If this POST carries a follow-up answer
      // (free text and/or either pill), MERGE it onto the existing row
      // instead of deduping the request away.
      if (hasFollowUp && feedbackCol > 0) {
        if (hasFeedback) {
          sheet.getRange(existingRow, feedbackCol).setValue(feedback);
        }
        if (variant && variantCol > 0) {
          sheet.getRange(existingRow, variantCol).setValue(variant);
        }
        if (audience && audienceCol > 0) {
          sheet.getRange(existingRow, audienceCol).setValue(audience);
        }
        if (searchFrom && searchFromCol > 0) {
          sheet.getRange(existingRow, searchFromCol).setValue(searchFrom);
        }
        return jsonResponse({ ok: true, updated: true });
      }
      // A genuine duplicate signup (no new answer) is still deduped.
      return jsonResponse({ ok: true, deduped: true });
    }

    // New email → append a full row, including feedback/variant/audience/
    // search_from or marketing_opt_in when present.
    const row = [
      body.captured_at || new Date().toISOString(),
      email,
      source,
      context,
      body.install_id || '',
      body.install_ts || '',
      body.extension_version || '',
      body.page_path || '',
      body.user_agent || ''
    ];

    if (isVault) {
      row[feedbackCol - 1] = feedback;
      row[variantCol - 1] = variant;
      row[audienceCol - 1] = audience;
      row[searchFromCol - 1] = searchFrom;
    }

    if (isMobile) {
      // Written as a real boolean so the column filters as TRUE/FALSE rather
      // than as text that looks like it.
      row[optInCol - 1] = marketingOptIn;
    }

    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: String(err && err.message ? err.message : err)
    });
  } finally {
    if (lock) {
      try {
        lock.releaseLock();
      } catch (err) {
        // Ignore lock release errors.
      }
    }
  }
}

// Mobile install-link requests go to their own tab (see the consent model at
// the top of this file). Any source containing "vault"
// (website_vault_waitlist, extension_vault_waitlist) goes to the Vault tab;
// all other sources go to the main sheet.
function sheetNameForSource(source) {
  if (source === 'blog_mobile_capture') {
    return MOBILE_SHEET_NAME;
  }
  return source.indexOf('vault') !== -1 ? VAULT_SHEET_NAME : SHEET_NAME;
}

// Only an explicit affirmative counts. Everything else, including undefined,
// '', 'false', 0, and 'no', is no consent.
function normalizeOptIn(value) {
  return value === true || value === 'true' || value === 'yes';
}

// Returns the named tab, creating it with a header row if it doesn't exist yet.
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

// Returns the 1-based index of the column with the given header, adding it as a
// new trailing column (and writing its header) if it doesn't exist yet. Lets an
// existing tab gain feedback/variant/audience/search_from or marketing_opt_in
// columns without manual editing.
function ensureColumn(sheet, headerName) {
  const target = String(headerName).trim().toLowerCase();
  const lastCol = sheet.getLastColumn();

  if (lastCol > 0) {
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    for (let i = 0; i < headers.length; i++) {
      if (String(headers[i]).trim().toLowerCase() === target) {
        return i + 1;
      }
    }
  }

  const newCol = lastCol + 1;
  sheet.getRange(1, newCol).setValue(headerName);
  return newCol;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
