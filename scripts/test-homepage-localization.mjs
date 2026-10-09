import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import parser from 'next/dist/compiled/node-html-parser/index.js';
import { SITE_CATALOGS, inlineMarkupTokens, translationSource } from '../lib/site-copy.js';
import { SITE_LANGUAGES, languagePickerHtml, languageCampaign } from '../lib/site-language.js';

const template = await readFile(new URL('../content/index.template.html', import.meta.url), 'utf8');
const ids = [...template.matchAll(/\{\{t:([\w.-]+)\}\}/g)].map(match => match[1]);
const english = SITE_CATALOGS.en;
for (const {code} of SITE_LANGUAGES) {
  const catalog = SITE_CATALOGS[code];
  assert.ok(catalog, `${code} has no catalog`);
  for (const id of ids) assert.ok(catalog[id]?.trim(), `${code}: missing ${id}`);
  const record = code === 'en' ? null : JSON.parse(await readFile(new URL(`../content/locales/${code}.translation.json`, import.meta.url), 'utf8'));
  for (const [id, source] of Object.entries(english)) {
    assert.ok(catalog[id]?.trim(), `${code}: missing ${id}`);
    assert.deepEqual(inlineMarkupTokens(catalog[id]), inlineMarkupTokens(source), `${code}: changed design markup or template bindings in ${id}`);
    const keyLabels = text => text.match(/<kbd\b[^>]*>.*?<\/kbd>/g) || [];
    assert.deepEqual(keyLabels(catalog[id]), keyLabels(source), `${code}: changed keyboard labels in ${id}`);
    if (record) {
      assert.equal(record.entries[id]?.sourceHash, createHash('sha256').update(translationSource(id, source, code)).digest('hex'), `${code}: outdated ${id}`);
      assert.equal(record.entries[id]?.reviewedHash, createHash('sha256').update(catalog[id]).digest('hex'), `${code}: unreviewed ${id}`);
    }
  }
  const picker = parser.parse(languagePickerHtml(code));
  assert.equal(picker.querySelectorAll('summary').length, 1);
  assert.equal(picker.querySelectorAll('a').length, SITE_LANGUAGES.length);
  assert.equal(picker.querySelector('a[aria-current="page"]').getAttribute('lang'), code);
}

function designSkeleton(html) {
  const root = parser.parse(html);
  // The locale disclosure is an intentional addition to the original support copy.
  root.querySelectorAll('.site-language-note').forEach(node => node.remove());
  return root.querySelector('main').querySelectorAll('*').map(node => [node.tagName, node.getAttribute('class') || '', node.getAttribute('id') || '']);
}
const englishHtml = await readFile(new URL('../out/index.html', import.meta.url), 'utf8');
for (const {code, path} of SITE_LANGUAGES) {
  const html = code === 'en' ? englishHtml : await readFile(new URL(`../out/${path.slice(1)}.html`, import.meta.url), 'utf8');
  assert.deepEqual(designSkeleton(html), designSkeleton(englishHtml), `${code}: homepage drifted from the English page design`);
  assert.equal(/\{\{(?:t:|[A-Z_])/.test(html), false, 'Unresolved page copy');
  const root = parser.parse(html);
  assert.equal(root.querySelectorAll('main > section').length, 18, 'Homepage sections were removed');
  assert.ok(root.querySelector('.hero-demo .kinetic-panel [data-kp-input]'), 'Kinetic animation hook is missing');
  assert.ok(root.querySelector('.feature-overlay .kinetic-panel'), 'Feature overlay is missing');
  assert.ok(root.querySelector('.hero-grid .hero-support'), 'Shared hero alignment is missing');
  assert.ok(root.querySelector('.hero h1 .text-gradient'), 'Headline emphasis is missing');
  assert.equal(root.querySelectorAll('#primary-nav .language-picker').length, 0, 'Language picker takes up a main menu item');
  assert.ok(root.querySelector('.header-inner > .language-picker'), 'Compact language picker is missing');
}
console.log(`Shared homepage design and catalog checks passed for ${SITE_LANGUAGES.length} languages and ${ids.length} copy slots.`);

const localizedGuides = SITE_LANGUAGES.filter(item => item.guidePath);
let guideSkeleton;
for (const {code, guidePath} of localizedGuides) {
  const html = await readFile(new URL(`../out/${guidePath.slice(1)}.html`, import.meta.url), 'utf8');
  const root = parser.parse(html);
  assert.equal(root.querySelector('html').getAttribute('lang'), code);
  const skeleton = root.querySelector('main').querySelectorAll('*').map(node => [node.tagName, node.getAttribute('class') || '']);
  if (guideSkeleton) assert.deepEqual(skeleton, guideSkeleton, `${code}: installation guide design drifted`);
  guideSkeleton = skeleton;
  for (const store of ['chrome', 'edge']) {
    const link = root.querySelector(`a[data-install-position="guide_${store}"]`);
    assert.ok(link, `${code}: missing ${store} guide link`);
    const url = new URL(link.getAttribute('href'));
    assert.equal(url.searchParams.get('utm_campaign'), languageCampaign(code).utm_campaign);
    assert.equal(url.searchParams.get('utm_content'), `guide_${store}`);
  }
}
console.log(`Shared installation guide checks passed for ${localizedGuides.length} languages.`);
