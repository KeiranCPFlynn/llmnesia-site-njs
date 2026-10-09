import assert from 'node:assert/strict';
import { languageForPath, shouldSuggestGerman } from '../lib/site-language.js';

assert.equal(languageForPath('/de'), 'de');
assert.equal(languageForPath('/de/installation'), 'de');
assert.equal(languageForPath('/demo-preview'), 'en');
assert.equal(languageForPath('/open'), 'en');
assert.equal(shouldSuggestGerman('/', null, ['de-DE', 'en']), true);
assert.equal(shouldSuggestGerman('/', null, ['de-AT']), true);
assert.equal(shouldSuggestGerman('/', null, ['en', 'de']), false);
assert.equal(shouldSuggestGerman('/', 'en', ['de-DE']), false);
assert.equal(shouldSuggestGerman('/', 'de', ['en']), true);
assert.equal(shouldSuggestGerman('/de', null, ['de']), false);
assert.equal(shouldSuggestGerman('/open', 'de', ['de']), false);
assert.equal(shouldSuggestGerman('/blog', 'de', ['de']), false);
console.log('Language preference and private-route checks passed.');
