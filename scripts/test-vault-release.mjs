import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

const [purchase, pricing, account, vault, sitemap, readme, leads, homepage, behavior, privacy] = await Promise.all([
  source('app/components/vault-purchase.js'),
  source('app/pricing/page.js'),
  source('app/account/page.js'),
  source('app/vault/page.js'),
  source('app/sitemap.js'),
  source('README.md'),
  source('api/leads.js'),
  source('content/index.template.html'),
  source('app/components/site-behavior.js'),
  source('content/privacy-policy.template.html')
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

assert.match(pricing, /NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true'[\s\S]*NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true'/);
assert.match(account, /NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true'[\s\S]*NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true'/);
assert.match(pricing, /robots: \{ index: false, follow: false \}/);
assert.match(account, /robots: \{ index: false, follow: false \}/);
assert.match(sitemap, /NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true'[\s\S]*NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true'[\s\S]*path: '\/pricing'/);
assert.equal(/path: '\/account'/.test(sitemap), false, 'account route must remain outside the sitemap');

assert.match(purchase, /accountOnly\s*\? 'Signed in\. Checking your Vault status\.'/);
assert.match(purchase, /entitled === true \|\| billingDetected \|\| accountOnly/);
assert.match(purchase, /manage billing below while activation catches up/i);
assert.match(
  purchase,
  /vault-purchase-signed-in[\s\S]*checkoutReturn === 'success'[\s\S]*Checkout is complete/,
  'signed-in Checkout returns must show an explicit confirmation'
);

assert.equal(
  /restore.{0,100}without an active subscription|existing Vault stays available.{0,100}restore|only new uploads stop/is.test(pricing),
  false,
  'pricing must not promise remote Vault access after lapse'
);
assert.match(pricing, /Sync and restore from the encrypted Vault pause when the subscription ends/);
assert.match(pricing, /Conversations already on each device stay searchable/);

assert.match(privacy, /Last updated: 3 September 2026/);
assert.match(privacy, /Every remote Vault operation/);
assert.match(privacy, /cannot be\s+synced or restored until you renew/);
assert.match(privacy, /Payments are handled by Stripe/);
assert.match(privacy, /There is currently no self-service whole-Vault deletion button/);
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
assert.match(homepage, /id="email-capture-label"/);
assert.match(homepage, /id="email-capture-success-title"/);
assert.match(behavior, /isVaultUpdatesLanding/);
assert.match(behavior, /You’re on the Vault updates list\./);
assert.match(behavior, /encrypted sync and backup are ready\./);

const combined = [purchase, pricing, account, vault].join('\n');
assert.equal(/PROTECTED_ACCEPTANCE_PREVIEW/.test(combined), false, 'preview bypass leaked into production source');
assert.equal(/otp.{0,40}(log|debug|diagnostic)/i.test(combined), false, 'OTP diagnostic copy leaked into production source');

process.stdout.write('Vault release-contract checks passed.\n');
