import assert from 'node:assert/strict';
import { languageForPath, shouldSuggestGerman, suggestedLanguage } from '../lib/site-language.js';

assert.equal(languageForPath('/de'), 'de');
assert.equal(languageForPath('/de/installation'), 'de');
assert.equal(languageForPath('/demo-preview'), 'en');
assert.equal(languageForPath('/open'), 'en');
assert.equal(shouldSuggestGerman('/', null, ['de-DE', 'en']), true);
assert.equal(shouldSuggestGerman('/', null, ['de-AT']), true);
assert.equal(shouldSuggestGerman('/', null, ['en', 'de']), false);
assert.equal(shouldSuggestGerman('/', 'en', ['de-DE']), false);
assert.equal(shouldSuggestGerman('/', 'de', ['en']), false);
assert.equal(shouldSuggestGerman('/', 'de', ['en-GB', 'de-DE']), false);
assert.equal(shouldSuggestGerman('/', 'de', ['fr-FR', 'de-DE']), false);
assert.equal(shouldSuggestGerman('/de', null, ['de']), false);
assert.equal(shouldSuggestGerman('/open', 'de', ['de']), false);
assert.equal(shouldSuggestGerman('/blog', 'de', ['de']), false);
assert.equal(languageForPath('/es'), 'es');
assert.equal(languageForPath('/es/installation'), 'es');
for (const browserLanguage of ['es-ES', 'es-MX', 'es-419']) assert.equal(suggestedLanguage('/', null, [browserLanguage])?.code, 'es');
assert.equal(suggestedLanguage('/', 'es', ['en']), null);
for (const preference of [null, 'en', 'de', 'es']) {
  for (const primary of ['en', 'en-GB', 'en-US']) {
    assert.equal(suggestedLanguage('/', preference, [primary, 'de-DE', 'es-ES']), null, `No prompt for ${primary} with saved ${preference}`);
  }
  assert.equal(suggestedLanguage('/', preference, []), null);
}
assert.equal(suggestedLanguage('/', 'de', ['es-MX'])?.code, 'es');
assert.equal(suggestedLanguage('/', 'es', ['de-DE'])?.code, 'de');
assert.equal(suggestedLanguage('/', 'en', ['es-MX']), null);
assert.equal(suggestedLanguage('/', null, ['en', 'es']), null);
assert.equal(suggestedLanguage('/open', 'es', ['es']), null);
assert.equal(suggestedLanguage('/es', null, ['es']), null);
console.log('Language preference and private-route checks passed.');
