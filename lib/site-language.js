export const LANGUAGE_PREFERENCE_KEY = 'llmnesia-site-language';
export const SITE_LANGUAGES = [
  { code: 'en', label: 'English', path: '/', locale: 'en_US', chooserLabel: 'Choose language' },
  { code: 'de', campaignPrefix: 'german', label: 'Deutsch', sourceLanguageName: 'German', path: '/de', guidePath: '/de/installation', locale: 'de_DE', chooserLabel: 'Sprache wählen', viewLabel: 'Auf Deutsch ansehen', suggestionLabel: 'German website and installation guide' },
  { code: 'es', campaignPrefix: 'spanish', label: 'Español', sourceLanguageName: 'Spanish', path: '/es', guidePath: '/es/installation', locale: 'es_ES', chooserLabel: 'Elegir idioma', viewLabel: 'Ver en español', suggestionLabel: 'Spanish website and installation guide' }
];

export function languageForPath(pathname = '/') {
  return SITE_LANGUAGES.find(({ code, path }) => code !== 'en' && (pathname === path || pathname.startsWith(`${path}/`)))?.code || 'en';
}

export function shouldSuggestGerman(pathname, preference, languages = []) {
  return suggestedLanguage(pathname, preference, languages)?.code === 'de';
}

export function suggestedLanguage(pathname, preference, languages = []) {
  if (pathname !== '/' || preference === 'en') return null;
  return SITE_LANGUAGES.find(item => item.code !== 'en' && item.code === preference) ||
    SITE_LANGUAGES.find(item => item.code !== 'en' && item.code === (languages[0] || '').split('-')[0].toLowerCase()) || null;
}

export const LOCALIZED_CORE_PAGES = ['vault', 'mcp', 'pricing', 'about', 'privacy-policy'];

export function basePagePath(pathname = '/') {
  const language = languageForPath(pathname);
  const prefix = SITE_LANGUAGES.find(item => item.code === language)?.path;
  return language === 'en' ? pathname : pathname.slice(prefix.length) || '/';
}

// Only route pages with an actual translation. Other documentation stays on
// its existing English URL; external sites and application routes stay intact.
export function localizedHref(href, language = 'en') {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  const pathname = basePagePath(match[1].replace(/\/$/, '') || '/');
  if (pathname !== '/' && !LOCALIZED_CORE_PAGES.includes(pathname.slice(1))) return href;
  const prefix = language === 'en' ? '' : SITE_LANGUAGES.find(item => item.code === language)?.path;
  if (prefix === undefined) throw new Error(`Unknown site language: ${language}`);
  return `${pathname === '/' ? (prefix || '/') : prefix + pathname}${match[2]}`;
}

export function localizeHtmlLinks(html, language) {
  return html.replace(/<a\b[^>]*>/g, (anchor) => anchor.includes('data-site-language=') ? anchor
    : anchor.replace(/href="(\/[^"\s]*)"/, (_, href) => `href="${localizedHref(href, language)}"`));
}

export function languageAlternates(origin, pagePath = '/') {
  return { ...Object.fromEntries(SITE_LANGUAGES.map(({code}) => [code, `${origin}${localizedHref(pagePath, code) === '/' ? '' : localizedHref(pagePath, code)}`])), 'x-default': `${origin}${pagePath === '/' ? '' : pagePath}` };
}

export function languagePickerHtml(language, pagePath = '/') {
  const label = SITE_LANGUAGES.find(item => item.code === language)?.chooserLabel || SITE_LANGUAGES[0].chooserLabel;
  return `<details class="language-picker" data-language-picker>
    <summary aria-label="${label}" title="${label}"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18z"/></svg><span>${language.toUpperCase()}</span><svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m3 4 3 3 3-3"/></svg></summary>
    <nav class="language-picker-options" aria-label="${label}">${SITE_LANGUAGES.map(({code,label}) => `<a href="${localizedHref(pagePath, code)}" lang="${code}" hreflang="${code}" data-site-language="${code}"${code === language ? ' aria-current="page"' : ''}>${label}${code === language ? '<span aria-hidden="true">✓</span>' : ''}</a>`).join('')}</nav>
  </details>`;
}

export function languageCampaign(language) {
  const config = SITE_LANGUAGES.find(item => item.code === language);
  if (!config?.campaignPrefix) return {};
  return { utm_source: `${config.campaignPrefix}_page`, utm_medium: 'cta', utm_campaign: `${config.campaignPrefix}_pilot` };
}
