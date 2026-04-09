import { contentGroupFromPath } from './site';

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  if (typeof window.gtag !== 'function') {
    return;
  }

  const pathname = window.location.pathname;
  window.gtag('event', eventName, {
    content_group: contentGroupFromPath(pathname),
    page_path: pathname,
    ...params
  });
}
