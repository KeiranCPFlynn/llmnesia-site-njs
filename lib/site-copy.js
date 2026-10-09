import english from '../content/locales/en.json' with { type: 'json' };
import german from '../content/locales/de.json' with { type: 'json' };

// Add a reviewed catalog here and a language in SITE_LANGUAGES to extend the site.
export const SITE_CATALOGS = { en: english, de: german };

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

// Inline emphasis/icons stay part of the shared design. Translations may change
// words, but not tags, attributes, URLs, classes, keyboard labels or bindings.
export function inlineMarkupTokens(text) {
  return text.match(/<[^>]*>|\{\{[A-Z_]+\}\}/g) || [];
}
