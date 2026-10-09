import { contentGroupFromPath } from './site.js';
import { isProductionAnalyticsHost } from './analytics-host.js';
import { SITE_LANGUAGES, languageForPath } from './site-language.js';

export function analyticsProperties(pathname, params = {}, browserLanguage = '') {
  const route = pathname.replace(/\/$/, '') || '/';
  const homepage = SITE_LANGUAGES.some(item => item.path === route);
  const guide = SITE_LANGUAGES.some(item => item.guidePath === route);
  // Primary language only: compare de-DE/de-AT with the German page without
  // collecting the visitor's entire language list or adding a user identifier.
  const primaryLanguage = /^[a-z]{2,3}(?:-|$)/i.test(browserLanguage) ? browserLanguage.split('-')[0].toLowerCase() : 'unknown';
  return {
    content_group: contentGroupFromPath(pathname),
    page_path: pathname,
    site_language: languageForPath(pathname),
    browser_language: primaryLanguage,
    page_type: homepage ? 'homepage' : guide ? 'installation_guide' : 'other',
    ...params
  };
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !isProductionAnalyticsHost(window.location.hostname)) {
    return;
  }

  const pathname = window.location.pathname;
  if (/^\/open\/?$/.test(pathname)) return;
  const enriched = analyticsProperties(pathname, params, window.navigator.language);

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, enriched);
  }

  // Mirror the same events into PostHog when it has been initialised (only when
  // NEXT_PUBLIC_POSTHOG_KEY is set). This is how experiment metrics such as
  // cta_install_click reach PostHog for analysis.
  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(eventName, enriched);
  }
}
