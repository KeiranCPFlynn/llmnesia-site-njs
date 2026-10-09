import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import parser from 'next/dist/compiled/node-html-parser/index.js';
import { SITE_LANGUAGES, LOCALIZED_CORE_PAGES, localizedHref, localizeHtmlLinks, languagePickerHtml, languageCampaign } from '../lib/site-language.js';
import { SITE_CATALOGS, siteHtml, clientCopy } from '../lib/site-copy.js';

const readPage = async route => parser.parse(await readFile(new URL(`../out${route}.html`, import.meta.url), 'utf8'));
const skeleton = root => root.querySelector('main').querySelectorAll('*').map(node => [node.tagName, node.getAttribute('class') || '', node.getAttribute('id') || '']);
const sitemap = await readFile(new URL('../out/sitemap.xml', import.meta.url), 'utf8');
for (const page of LOCALIZED_CORE_PAGES) {
  const original = await readPage(`/${page}`);
  for (const {code} of SITE_LANGUAGES) {
    const route = localizedHref(`/${page}`, code);
    const root = await readPage(route);
    assert.equal(root.querySelector('html').getAttribute('lang'), code, `${route}: document language`);
    const prerendered = parser.parse(await readFile(new URL(`../.next/server/app${route}.html`, import.meta.url), 'utf8'));
    assert.equal(prerendered.querySelector('html').getAttribute('lang'), code, `${route}: Vercel prerendered document language`);
    // The Vercel adapter runs inside next build and creates its own HTML copy.
    let deploymentHtml;
    try { deploymentHtml = await readFile(new URL(`../.next/output/static${route}.html`, import.meta.url), 'utf8'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (deploymentHtml) assert.equal(parser.parse(deploymentHtml).querySelector('html').getAttribute('lang'), code, `${route}: Vercel adapter document language`);
    assert.deepEqual(skeleton(root), skeleton(original), `${route}: design differs from English`);
    assert.equal(root.querySelectorAll('h1').length, 1, `${route}: one page heading`);
    assert.equal(root.querySelector('link[rel="canonical"]').getAttribute('href'), `https://www.llmnesia.com${route}`);
    for (const {code: target} of SITE_LANGUAGES) {
      assert.equal(root.querySelector(`a[data-site-language="${target}"]`).getAttribute('href'), localizedHref(`/${page}`, target), `${route}: picker must preserve the page`);
      assert.equal(root.querySelector(`link[hreflang="${target}"]`).getAttribute('href'), `https://www.llmnesia.com${localizedHref(`/${page}`, target)}`);
    }
    assert.ok(sitemap.includes(`<loc>https://www.llmnesia.com${route}</loc>`), `${route}: missing from sitemap`);
    assert.equal(/\{\{(?:t:|[A-Z_])/.test(root.querySelector('main').toString()), false, `${route}: unresolved copy`);
    if (code !== 'en') {
      const storeLinks = root.querySelectorAll('a[href]').filter(anchor => /^https:\/\/(chromewebstore\.google\.com|microsoftedge\.microsoft\.com)\//.test(anchor.getAttribute('href')));
      assert.ok(storeLinks.length, `${route}: missing store links`);
      for (const anchor of storeLinks) {
        const params = new URL(anchor.getAttribute('href')).searchParams;
        for (const [key, value] of Object.entries(languageCampaign(code))) {
          assert.equal(params.get(key), value, `${route}: store link lost ${key}`);
        }
      }
    }
    for (const anchor of root.querySelector('main').querySelectorAll('a[href^="#"]')) {
      assert.ok(root.querySelector(`[id="${anchor.getAttribute('href').slice(1)}"]`), `${route}: broken in-page link`);
    }
    if (page === 'vault' || page === 'pricing') {
      for (const price of ['£8', '£88', '£7.33']) assert.ok(root.querySelector('main').textContent.includes(price), `${route}: changed price ${price}`);
      assert.equal(root.querySelectorAll('.faq-list details').length, page === 'vault' ? 7 : 10);
    }
    if (page === 'privacy-policy') {
      const codes = node => node.querySelectorAll('main code').map(code => code.textContent);
      assert.deepEqual(codes(root), codes(original), `${route}: changed technical identifiers`);
      const content = root.querySelector('main').textContent;
      for (const term of ['30', '2026', 'AES-256-GCM', '180', '12', '13', 'OpenAI', 'Anthropic', 'OpenRouter']) assert.ok(content.includes(term), `${route}: missing policy detail ${term}`);
      for (const permission of ['Storage', 'Unlimited storage', 'Tabs', 'Active Tab', 'Scripting', 'Offscreen', 'Alarms', 'Native messaging']) assert.ok(root.querySelectorAll('main strong').some(node => node.textContent === permission), `${route}: changed permission ${permission}`);
    }
  }
}
// A page-wide link rewrite must never collapse the three language choices.
for (const {code} of SITE_LANGUAGES) {
  const picker = parser.parse(localizeHtmlLinks(languagePickerHtml(code, '/pricing'), code));
  assert.equal(new Set(picker.querySelectorAll('a').map(a => a.getAttribute('href'))).size, 3);
  assert.equal(localizedHref('/pricing?checkout=cancelled#vault-purchase', code), `${code === 'en' ? '' : `/${code}`}/pricing?checkout=cancelled#vault-purchase`);
  assert.equal(localizedHref('/blog/example', code), '/blog/example');
  assert.equal(localizedHref('https://vault.llmnesia.com', code), 'https://vault.llmnesia.com');
  assert.ok(clientCopy('purchase', code)['Please enter a valid email address.']);
  assert.ok(siteHtml('vault.copy034', code, {VALUE_A: '<unsafe>', VALUE_B: '£8'}).includes('&lt;unsafe&gt;'), 'Dynamic copy must be escaped');
  for (const [id, source] of Object.entries(SITE_CATALOGS.en)) {
    if (!/^(vault|mcp|pricing|about|privacy)\./.test(id)) continue;
    const codeText = text => parser.parse(text).querySelectorAll('code').map(node => node.textContent);
    assert.deepEqual(codeText(SITE_CATALOGS[code][id]), codeText(source), `${code}: translated code in ${id}`);
  }
}
console.log('Core localization checks passed: 15 pages, shared designs, equivalent-page switching, metadata, anchors, prices and policy details.');
