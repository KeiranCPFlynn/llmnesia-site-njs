import { analyticsProperties } from './analytics.js';
import { isProductionAnalyticsHost } from './analytics-host.js';

// Each provider gets its own delivery flag. Loading PostHog after GA4 (or the
// reverse) must neither lose the funnel denominator nor send it twice.
export function observePageAnalytics(browserWindow, { gaId, pathname, pagePath }) {
  if (!isProductionAnalyticsHost(browserWindow.location.hostname) || /^\/open\/?$/.test(pathname)) return () => {};
  const properties = analyticsProperties(pathname, {}, browserWindow.navigator.language);
  const localizedSurface = properties.page_type !== 'other';
  let gaSent = false;
  let posthogSent = false;
  let stopped = false;
  const send = () => {
    if (stopped) return;
    if (!gaSent && gaId && typeof browserWindow.gtag === 'function') {
      gaSent = true;
      browserWindow.gtag('event', 'page_view', { ...properties, page_path: pagePath });
      if (localizedSurface) browserWindow.gtag('event', 'localized_page_viewed', properties);
    }
    if (!posthogSent && localizedSurface && typeof browserWindow.posthog?.capture === 'function') {
      posthogSent = true;
      browserWindow.posthog.capture('localized_page_viewed', properties);
    }
  };
  browserWindow.addEventListener('ga:ready', send);
  browserWindow.addEventListener('posthog:ready', send);
  send();
  return () => {
    stopped = true;
    browserWindow.removeEventListener('ga:ready', send);
    browserWindow.removeEventListener('posthog:ready', send);
  };
}
