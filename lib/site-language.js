export const LANGUAGE_PREFERENCE_KEY = 'llmnesia-site-language';

export function languageForPath(pathname = '/') {
  return /^\/de(?:\/|$)/.test(pathname) ? 'de' : 'en';
}

export function shouldSuggestGerman(pathname, preference, languages = []) {
  return pathname === '/' && preference !== 'en' &&
    (preference === 'de' || /^de(?:-|$)/i.test(languages[0] || ''));
}
