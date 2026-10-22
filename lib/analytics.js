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

export function trackEvent(eventName, params = {}, { beforeNavigation = false, waitForReady = false } = {}) {
  if (typeof window === 'undefined' || !isProductionAnalyticsHost(window.location.hostname)) {
    return;
  }

  const pathname = window.location.pathname;
  if (/^\/open\/?$/.test(pathname)) return;
  const enriched = analyticsProperties(pathname, params, window.navigator.language);

  let gaSent = false;
  let posthogSent = false;
  let timer;
  const stop = () => {
    window.removeEventListener('ga:ready', send);
    window.removeEventListener('posthog:ready', send);
    window.removeEventListener('pagehide', stop);
    if (timer) window.clearTimeout(timer);
  };
  const send = () => {
    // Tracking is optional. A blocked or broken SDK must never break checkout,
    // and one provider failing must not prevent delivery to the other.
    try {
      if (!gaSent && typeof window.gtag === 'function') {
        window.gtag('event', eventName, beforeNavigation ? { ...enriched, transport_type: 'beacon' } : enriched);
        gaSent = true;
      }
    } catch {}
    try {
      if (!posthogSent && typeof window.posthog?.capture === 'function') {
        if (beforeNavigation) {
          window.posthog.capture(eventName, enriched, { transport: 'sendBeacon', send_instantly: true });
        } else {
          window.posthog.capture(eventName, enriched);
        }
        posthogSent = true;
      }
    } catch {}
    if (gaSent && posthogSent) stop();
  };
  if (waitForReady) {
    window.addEventListener('ga:ready', send);
    window.addEventListener('posthog:ready', send);
    window.addEventListener('pagehide', stop, { once: true });
    timer = window.setTimeout(stop, 10000);
  }
  send();
}
