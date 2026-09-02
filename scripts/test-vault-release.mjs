import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

const [purchase, pricing, account, vault, sitemap, readme] = await Promise.all([
  source('app/components/vault-purchase.js'),
  source('app/pricing/page.js'),
  source('app/account/page.js'),
  source('app/vault/page.js'),
  source('app/sitemap.js'),
  source('README.md')
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

const combined = [purchase, pricing, account, vault].join('\n');
assert.equal(/PROTECTED_ACCEPTANCE_PREVIEW/.test(combined), false, 'preview bypass leaked into production source');
assert.equal(/otp.{0,40}(log|debug|diagnostic)/i.test(combined), false, 'OTP diagnostic copy leaked into production source');

process.stdout.write('Vault release-contract checks passed.\n');
