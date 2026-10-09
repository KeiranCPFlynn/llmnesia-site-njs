import english from '../content/locales/en.json' with { type: 'json' };
import german from '../content/locales/de.json' with { type: 'json' };
import spanish from '../content/locales/es.json' with { type: 'json' };
import { SITE_LANGUAGES, localizeHtmlLinks } from './site-language.js';

// Add a reviewed catalog here and a language in SITE_LANGUAGES to extend the site.
export const SITE_CATALOGS = { en: english, de: german, es: spanish };

// Adapt only the original pilot's language-specific disclosures. Ordinary
// shared marketing copy remains the same source for every locale.
const LOCALE_DISCLOSURES = new Set(['home.metaDescription', 'home.languageNotice', 'guide.metaTitle', 'guide.metaDescription', 'guide.intro', 'guide.troubleshootBody', 'guide.back', 'listing.summary', 'listing.description', 'homepage.languageNotice', 'homepage.guideLink']);
export function translationSource(id, source, language) {
  if (!LOCALE_DISCLOSURES.has(id) || language === 'en') return source;
  const config = SITE_LANGUAGES.find(item => item.code === language);
  if (!config) throw new Error(`Unknown translation language: ${language}`);
  return source.replaceAll('German', config.sourceLanguageName || config.label)
    .replaceAll('https://www.llmnesia.com/de', `https://www.llmnesia.com${config.path}`);
}

export function siteText(id, language = 'en') {
  const text = SITE_CATALOGS[language]?.[id];
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error(`Missing ${language} site translation: ${id}`);
  }
  return text;
}

export function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function formatSiteText(id, language = 'en', values = {}) {
  return siteText(id, language).replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Missing ${id} binding: ${key}`);
    return String(values[key]);
  });
}

// HTML comes only from checked-in catalogs whose tags, attributes and bindings
// must match English at build time. Dynamic prices/platform names are escaped.
export function siteHtml(id, language = 'en', values = {}) {
  return localizeHtmlLinks(formatSiteText(id, language, Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, escapeHtml(String(value))])
  )), language);
}

export function clientCopy(prefix, language) {
  return Object.fromEntries(Object.entries(english).filter(([id]) => id.startsWith(`${prefix}.`))
    .map(([id, source]) => [source, siteText(id, language)]));
}

// Inline emphasis/icons stay part of the shared design. Translations may change
// words, but not tags, attributes, URLs, classes, keyboard labels or bindings.
export function inlineMarkupTokens(text) {
  return text.match(/<[^>]*>|\{\{[A-Z_]+\}\}/g) || [];
}
