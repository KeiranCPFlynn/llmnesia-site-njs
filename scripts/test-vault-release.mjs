import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

const [purchase, accountExperience, pricing, account, vault, sitemap, readme, leads, homepage, behavior, privacy, vercelConfigText, about, foundationalArticle, llms, llmsFull, globals, platforms] = await Promise.all([
  source('app/components/vault-purchase.js'),
  source('app/components/vault-account-experience.js'),
  source('app/pricing/page.js'),
  source('app/account/page.js'),
  source('app/vault/page.js'),
  source('app/sitemap.js'),
  source('README.md'),
  source('api/leads.js'),
  source('content/index.template.html'),
  source('app/components/site-behavior.js'),
  source('content/privacy-policy.template.html'),
  source('vercel.json'),
  source('app/about/page.js'),
  source('content/blog/what-is-llmnesia.mdx'),
  source('app/llms.txt/route.js'),
  source('app/llms-full.txt/route.js'),
  source('app/globals.css'),
  source('lib/platforms.js')
]);

for (const [name, text] of Object.entries({ purchase, pricing, vault, readme })) {
  assert.equal(/£80|£6\.67/.test(text), false, `${name} contains stale Vault pricing`);
}

assert.match(purchase, /annualLabel = '£88'/);
assert.match(purchase, /annualMonthlyLabel = '£7\.33'/);
assert.match(pricing, /NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL \|\| '£88'/);
assert.match(pricing, /NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL \|\| '£7\.33'/);
assert.match(vault, /NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL \|\| '£88'/);
assert.match(vault, /NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL \|\| '£7\.33'/);
assert.doesNotMatch(homepage, /Coming soon · LLMnesia Vault/);
assert.doesNotMatch(homepage, /Get founding access/);
assert.match(homepage, /Now available · LLMnesia Vault/);
assert.match(homepage, /href="\/pricing#vault-purchase">Subscribe to Vault/);
assert.doesNotMatch(homepage, /Nothing is uploaded, synced, or sent to the cloud\. Ever\./);
assert.doesNotMatch(homepage, />0 bytes leave your device</);
assert.match(homepage, /Vault data encrypted before upload/);
assert.match(homepage, /end-to-end encrypted backup that we cannot read/);
assert.doesNotMatch(homepage, /history together for local MCP search/);
assert.match(homepage, /Vault web app beta/);
assert.match(homepage, /Ask Vault is a built-in beta feature/);

assert.doesNotMatch(vault, /MCP uses your local history on your desktop/);
assert.doesNotMatch(vault, /Point your AI at your own history/);
assert.doesNotMatch(vault, /One library, every AI/);
assert.doesNotMatch(vault, /Coming soon|when Vault opens|VaultWaitlistForm/);
assert.doesNotMatch(vault, /PURCHASE_PUBLIC|NEXT_PUBLIC_VAULT_PRICING_PUBLIC/);
assert.match(vault, /Available now · LLMnesia Vault/);
assert.match(vault, /Vault web app beta/);
assert.match(vault, /Your synced history, on any screen\./);
assert.match(vault, /Search your archive\./);
assert.match(vault, /Illustrative sample only\. No customer or personal data\./);
assert.doesNotMatch(vault, /beta launch|Mobile Vault release|privacy flow/);
assert.match(vault, /Also in the web app beta/);
assert.match(vault, /Think of it as the mobile, built-in counterpart to MCP/);
assert.match(vault, /get an answer grounded in your conversations/);
assert.doesNotMatch(vault, /review the evidence|provider destination|confirmed request/);
assert.match(vault, /What is Ask Vault\?/);
const vaultHero = vault.slice(
  vault.indexOf('<section className="section vault-hero">'),
  vault.indexOf('<section className="section vault-spotlight">')
);
assert.doesNotMatch(vaultHero, /Ask Vault|read and Ask/, 'Ask Vault must not replace sync and backup as the hero proposition');
assert.match(vault, /How is Vault different from free LLMnesia\?/);
assert.match(vault, /import \{ platformListSentence \} from '\.\.\/\.\.\/lib\/platforms';/);
assert.match(vault, /Vault syncs the history LLMnesia indexes from \$\{platformListSentence\(\)\}/);
assert.match(vault, /Local Claude Code and Codex sessions are a separate source type/);
assert.doesNotMatch(vault, /including ChatGPT, Claude, Gemini, Perplexity, Microsoft Copilot, DeepSeek, Grok, Mistral, Kimi and Qwen/);
assert.match(platforms, /'Google AI Mode'/);
assert.match(platforms, /'Meta AI'/);
assert.match(platforms, /'Z\.ai'/);
assert.match(about, /platformListSentence\(\)/);
assert.doesNotMatch(foundationalArticle, /does not currently support Meta AI/);
assert.match(vault, /Do I need Vault to use MCP\?/);
assert.match(vault, /MCP is a separate free feature/);
assert.doesNotMatch(pricing, /MCP answers from all of it/);
assert.doesNotMatch(pricing, /NEXT_PUBLIC_VAULT_MOBILE_READY/);
assert.doesNotMatch(pricing, /Coming soon|when Vault opens|VaultWaitlistForm|PRICING_PUBLIC/);
assert.match(pricing, /Installable Vault web app beta/);
assert.match(pricing, /Ask Vault with linked source conversations/);
assert.match(pricing, /className="vault-purchase-fallback"/);
assert.match(globals, /\.vault-price-card > \.button,[\s\S]*\.vault-purchase-fallback \{[\s\S]*margin-top: var\(--s-3\)/);
assert.match(globals, /\.vault-pricing,[\s\S]*\.vault-purchase-fallback \{[\s\S]*scroll-margin-top: 6rem/);
assert.match(globals, /\.vault-closing-inner \.vault-hero-actions \{[\s\S]*justify-content: center;[\s\S]*gap: var\(--s-3\)/);

for (const [name, text] of Object.entries({ about, foundationalArticle, llms, llmsFull })) {
  assert.doesNotMatch(text, /No cloud sync|completely free to use|no paid tier/i, `${name} blurs the free local product with optional Vault`);
  assert.match(text, /optional[^.]*Vault|Vault is a separate, optional paid service|Vault is a separate optional paid service/i);
}

assert.doesNotMatch(pricing, /NEXT_PUBLIC_VAULT_PRICING_PUBLIC/);
assert.doesNotMatch(account, /NEXT_PUBLIC_VAULT_PRICING_PUBLIC|notFound\(/);
assert.match(pricing, /canonicalPath: '\/pricing'/);
assert.match(account, /robots: \{ index: false, follow: false \}/);
assert.match(sitemap, /path: '\/pricing'/);
assert.doesNotMatch(sitemap, /NEXT_PUBLIC_VAULT_PRICING_PUBLIC/);
assert.equal(/path: '\/account'/.test(sitemap), false, 'account route must remain outside the sitemap');

const vercelConfig = JSON.parse(vercelConfigText);
const successRedirect = vercelConfig.redirects.find((rule) =>
  rule.source === '/pricing' && rule.has?.some((condition) =>
    condition.type === 'query' && condition.key === 'checkout' && condition.value === 'success'
  )
);
assert.equal(successRedirect?.destination, '/account?checkout=success');
assert.equal(successRedirect?.permanent, false);
assert.match(account, /Suspense[\s\S]*VaultAccountExperience/);
assert.match(accountExperience, /searchParams\.get\('checkout'\) === 'success'/);
assert.match(accountExperience, /You’re subscribed to Vault\./);
assert.match(accountExperience, /What to do next/);
assert.match(accountExperience, /I’ve subscribed, check again/);
assert.match(accountExperience, /Vault subscription active/);

assert.match(purchase, /accountOnly\s*\? 'Signed in\. Checking your Vault status\.'/);
assert.match(purchase, /entitled === true \|\| billingDetected \|\| accountOnly/);
assert.match(purchase, /manage billing below while activation catches up/i);
assert.match(
  purchase,
  /vault-purchase-signed-in[\s\S]*checkoutReturn === 'success'[\s\S]*You’re subscribed to Vault\./,
  'signed-in Checkout returns must show an explicit confirmation'
);
assert.match(purchase, /purchase\?\.scrollIntoView\(\{ block: 'start' \}\)/);
assert.match(purchase, /You’re subscribed to Vault\./);
assert.match(purchase, /I’ve subscribed, check again/);
assert.match(purchase, /accountOnly \|\| checkoutReturn === 'success'/);
assert.match(purchase, /checkoutReturn === 'success'[\s\S]*Vault activation is still syncing\./);

assert.equal(
  /restore.{0,100}without an active subscription|existing Vault stays available.{0,100}restore|only new uploads stop/is.test(pricing),
  false,
  'pricing must not promise remote Vault access after lapse'
);
assert.match(pricing, /Sync and restore from the encrypted Vault pause when the subscription ends/);
assert.match(pricing, /Conversations already on each device stay searchable/);

assert.match(privacy, /Last updated: 21 September 2026/);
assert.match(privacy, /Every remote Vault operation/);
assert.match(privacy, /cannot be\s+synced or restored until you renew/);
assert.match(privacy, /Payments are handled by Stripe/);
assert.match(privacy, /There is currently no self-service whole-Vault deletion button/);
assert.match(privacy, /Vault web app beta and Ask/);
assert.match(privacy, /https:\/\/vault\.llmnesia\.com\//);
assert.match(privacy, /OpenAI, Anthropic, Google, or\s+OpenRouter/);
assert.match(privacy, /When the user taps Ask/);
assert.match(privacy, /Ask does not send the whole Vault/);
assert.doesNotMatch(privacy, /shows the exact question and selected conversation excerpts before sending|Only after confirmation|explicitly confirms an Ask request/);
assert.match(privacy, /does not include PostHog analytics or a crash-reporting SDK/);
for (const permission of ['Unlimited storage', 'Offscreen', 'Alarms', 'Native messaging']) {
  assert.match(privacy, new RegExp(`<strong>${permission}</strong>`));
}
assert.equal(
  /only new uploads stop|restore.{0,100}without an active subscription|currently in early access/is.test(privacy),
  false,
  'privacy policy contains superseded Vault access language'
);

assert.match(leads, /'extension_vault_updates'/);
assert.match(leads, /extension_vault_updates: 'extension_vault_waitlist'/);
assert.match(leads, /marketing_consent: lead\.marketing_consent === true/);
assert.match(leads, /consent_copy_version: normalizeString\(lead\.consent_copy_version, 80\)/);
assert.match(homepage, /id="email-capture-label"/);
assert.match(homepage, /id="email-capture-success-title"/);
assert.match(behavior, /isVaultUpdatesLanding/);
assert.match(behavior, /You’re on the Vault updates list\./);
assert.match(behavior, /encrypted sync and backup are ready\./);

const combined = [purchase, pricing, account, vault].join('\n');
assert.equal(/PROTECTED_ACCEPTANCE_PREVIEW/.test(combined), false, 'preview bypass leaked into production source');
assert.equal(/otp.{0,40}(log|debug|diagnostic)/i.test(combined), false, 'OTP diagnostic copy leaked into production source');

process.stdout.write('Vault release-contract checks passed.\n');
