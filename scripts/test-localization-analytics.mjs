import assert from 'node:assert/strict';
import { analyticsProperties, trackEvent } from '../lib/analytics.js';
import { observePageAnalytics } from '../lib/localization-analytics.js';

function fakeBrowser(hostname = 'www.llmnesia.com', pathname = '/de') {
  const events = new EventTarget();
  return {
    location: { hostname, pathname }, navigator: { language: 'de-AT' },
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events)
  };
}
const browser = fakeBrowser();
const ga = [], posthog = [];
const stop = observePageAnalytics(browser, { gaId: 'test-only', pathname: '/de', pagePath: '/de' });
assert.equal(ga.length, 0);
browser.posthog = { capture: (...args) => posthog.push(args) };
browser.dispatchEvent(new Event('posthog:ready'));
browser.dispatchEvent(new Event('posthog:ready'));
assert.equal(posthog.length, 1, 'Async PostHog initialization must produce one denominator');
browser.gtag = (...args) => ga.push(args);
browser.dispatchEvent(new Event('ga:ready'));
browser.dispatchEvent(new Event('ga:ready'));
browser.dispatchEvent(new Event('posthog:ready'));
assert.deepEqual(ga.map(args => args[1]), ['page_view', 'localized_page_viewed']);
assert.equal(posthog.length, 1, 'The second provider must not duplicate the first');
assert.equal(posthog[0][1].site_language, 'de');
assert.equal(posthog[0][1].browser_language, 'de');
assert.equal(posthog[0][1].page_type, 'homepage');
stop();
browser.dispatchEvent(new Event('ga:ready'));
assert.equal(ga.length, 2);

// A page abandoned before either SDK becomes available must not count later.
const abandoned = fakeBrowser();
const cancel = observePageAnalytics(abandoned, { gaId: 'test-only', pathname: '/de', pagePath: '/de' });
cancel();
abandoned.gtag = (...args) => ga.push(args);
abandoned.posthog = { capture: (...args) => posthog.push(args) };
abandoned.dispatchEvent(new Event('ga:ready'));
abandoned.dispatchEvent(new Event('posthog:ready'));
assert.equal(ga.length, 2);
assert.equal(posthog.length, 1);

const gaFirst = fakeBrowser();
const immediateGa = [], delayedPosthog = [];
gaFirst.gtag = (...args) => immediateGa.push(args);
const stopGaFirst = observePageAnalytics(gaFirst, { gaId: 'test-only', pathname: '/de', pagePath: '/de' });
assert.equal(immediateGa.length, 2);
gaFirst.posthog = { capture: (...args) => delayedPosthog.push(args) };
gaFirst.dispatchEvent(new Event('posthog:ready'));
gaFirst.dispatchEvent(new Event('ga:ready'));
assert.equal(immediateGa.length, 2, 'Late PostHog must not send another GA4 page view');
assert.equal(delayedPosthog.length, 1);
stopGaFirst();

// PostHog does not depend on a GA key, including the English comparison page.
const english = fakeBrowser('llmnesia.com', '/');
english.posthog = { capture: (...args) => posthog.push(args) };
observePageAnalytics(english, { pathname: '/', pagePath: '/' })();
assert.equal(posthog.at(-1)[1].site_language, 'en');
assert.equal(posthog.at(-1)[1].browser_language, 'de');
assert.equal(analyticsProperties('/de/installation/').page_type, 'installation_guide');
assert.equal(analyticsProperties('/es/installation/').page_type, 'installation_guide');
assert.equal(analyticsProperties('/es', {}, 'es-MX').site_language, 'es');
assert.equal(analyticsProperties('/es', {}, 'es-MX').browser_language, 'es');
const spanish = fakeBrowser('www.llmnesia.com', '/es');
const spanishEvents = [];
spanish.gtag = (...args) => spanishEvents.push(args);
observePageAnalytics(spanish, { gaId: 'test-only', pathname: '/es', pagePath: '/es' })();
assert.equal(spanishEvents.filter(args => args[1] === 'localized_page_viewed').length, 1);
assert.equal(spanishEvents.at(-1)[2].site_language, 'es');
assert.equal(analyticsProperties('/demo-preview').page_type, 'other');

// Tracking must stay disabled for local/preview hosts and private Viewer URLs.
for (const [hostname, pathname] of [['localhost', '/de'], ['127.0.0.1', '/de'], ['example.vercel.app', '/de'], ['www.llmnesia.com', '/open'], ['llmnesia.com', '/open/']]) {
  const excluded = fakeBrowser(hostname, pathname);
  excluded.gtag = () => assert.fail('Excluded traffic reached GA4');
  excluded.posthog = { capture: () => assert.fail('Excluded traffic reached PostHog') };
  observePageAnalytics(excluded, { gaId: 'test-only', pathname, pagePath: pathname })();
  globalThis.window = excluded;
  trackEvent('install_click');
}

globalThis.window = browser;
trackEvent('install_click', { cta_position: 'hero', store: 'chrome' });
assert.equal(ga.at(-1)[1], 'install_click');
assert.deepEqual(ga.at(-1)[2], posthog.at(-1)[1]);
assert.equal(ga.at(-1)[2].site_language, 'de');
assert.equal(ga.at(-1)[2].cta_position, 'hero');
delete globalThis.window;
console.log('Localization analytics checks passed: delayed SDKs, independent delivery, cleanup, language context and excluded traffic. No live events sent.');
