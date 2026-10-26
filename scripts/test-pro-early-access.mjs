import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Exercises api/leads.js with a stubbed webhook so no real sheet row is written.
process.env.LEADS_WEBHOOK_URL = 'https://webhook.invalid/leads';
delete process.env.LEADS_WEBHOOK_KEY;

const { POST } = await import('../api/leads.js');

async function submit(body) {
  const sent = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    sent.push({ url: String(url), payload: JSON.parse(init.body) });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  };
  try {
    const response = await POST(new Request('http://localhost/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }));
    return { status: response.status, data: await response.json(), sent };
  } finally {
    globalThis.fetch = realFetch;
  }
}

test('Pro early-access answers are forwarded as enums, tagged so they can be told apart', async () => {
  const { status, data, sent } = await submit({
    email: 'Synthetic.Test@example.com',
    source: 'website_pro_early_access',
    context: 'teams_page',
    team_size: '2_5',
    tools: 'chatgpt,claude_code,codex',
    model_access: 'api_key'
  });
  assert.equal(status, 200);
  assert.equal(data.success, true);
  assert.equal(sent.length, 1);
  const payload = sent[0].payload;
  assert.equal(payload.email, 'synthetic.test@example.com');
  // The Apps Script does not accept the new source yet, so it rides as
  // website_homepage with the true source in context.
  assert.equal(payload.source, 'website_homepage');
  assert.equal(payload.context, 'website_pro_early_access:teams_page');
  assert.equal(payload.team_size, '2_5');
  assert.equal(payload.tools, 'chatgpt,claude_code,codex');
  assert.equal(payload.model_access, 'api_key');
  assert.equal(payload.feedback, 'team_size=2_5; tools=chatgpt,claude_code,codex; model_access=api_key');
});

test('off-enum and duplicate answers never reach the sheet as free text', async () => {
  const { sent } = await submit({
    email: 'synthetic@example.com',
    source: 'website_pro_early_access',
    context: 'teams_page',
    team_size: 'a hundred',
    tools: 'codex,<script>,codex, gemini ',
    model_access: 'yes please',
    tools_other: '  Lovable and Bolt  ',
    feedback: 'ignored free text'
  });
  const payload = sent[0].payload;
  assert.equal(payload.team_size, '');
  assert.equal(payload.tools, 'codex,gemini');
  assert.equal(payload.model_access, '');
  assert.equal(payload.tools_other, 'Lovable and Bolt');
  assert.equal(payload.feedback, 'tools=codex,gemini; tools_other=Lovable and Bolt');
});

test('other sources are unchanged and carry no Pro fields', async () => {
  const { sent } = await submit({
    email: 'synthetic@example.com',
    source: 'website_vault_waitlist',
    context: 'vault_page',
    team_size: '2_5',
    feedback: 'phone sync'
  });
  const payload = sent[0].payload;
  assert.equal(payload.source, 'website_vault_waitlist');
  assert.equal(payload.feedback, 'phone sync');
  assert.equal('team_size' in payload, false);
});

test('the /teams page copy has no em dashes and no banned claims', () => {
  const files = ['app/teams/page.js', 'app/components/pro-early-access-form.js', 'app/components/pro-board-demo.js'];
  for (const file of files) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.equal(text.includes(String.fromCharCode(0x2014)), false, `${file} contains an em dash`);
    for (const banned of [/the only\b/i, /no api key needed/i, /SOC ?2/i, /enterprise-grade/i]) {
      assert.equal(banned.test(text), false, `${file} matches ${banned}`);
    }
  }
});
