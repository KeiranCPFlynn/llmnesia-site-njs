import { contentGroupFromPath } from './site';

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const pathname = window.location.pathname;
  const enriched = {
    content_group: contentGroupFromPath(pathname),
    page_path: pathname,
    ...params
  };

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
