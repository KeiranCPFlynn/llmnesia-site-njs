export const LANGUAGE_PREFERENCE_KEY = 'llmnesia-site-language';
export const SITE_LANGUAGES = [
  { code: 'en', label: 'English', path: '/', locale: 'en_US', chooserLabel: 'Choose language' },
  { code: 'de', label: 'Deutsch', path: '/de', guidePath: '/de/installation', locale: 'de_DE', chooserLabel: 'Sprache wählen' }
];

export function languageForPath(pathname = '/') {
  return SITE_LANGUAGES.find(({ code, path }) => code !== 'en' && (pathname === path || pathname.startsWith(`${path}/`)))?.code || 'en';
}

export function shouldSuggestGerman(pathname, preference, languages = []) {
  return pathname === '/' && preference !== 'en' &&
    (preference === 'de' || /^de(?:-|$)/i.test(languages[0] || ''));
}

export function languageAlternates(origin) {
  return { ...Object.fromEntries(SITE_LANGUAGES.map(({code,path}) => [code, `${origin}${path === '/' ? '' : path}`])), 'x-default': origin };
}

export function languagePickerHtml(language) {
  const label = SITE_LANGUAGES.find(item => item.code === language)?.chooserLabel || SITE_LANGUAGES[0].chooserLabel;
  return `<details class="language-picker" data-language-picker>
    <summary aria-label="${label}" title="${label}"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18z"/></svg><span>${language.toUpperCase()}</span><svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m3 4 3 3 3-3"/></svg></summary>
    <nav class="language-picker-options" aria-label="${label}">${SITE_LANGUAGES.map(({code,label,path}) => `<a href="${path}" lang="${code}" hreflang="${code}" data-site-language="${code}"${code === language ? ' aria-current="page"' : ''}>${label}${code === language ? '<span aria-hidden="true">✓</span>' : ''}</a>`).join('')}</nav>
  </details>`;
}
