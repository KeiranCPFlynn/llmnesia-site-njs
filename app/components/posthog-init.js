'use client';

import { useEffect } from 'react';

// Initialises PostHog only when NEXT_PUBLIC_POSTHOG_KEY is set. The SDK is
// dynamically imported so that with no key configured (local dev and any deploy
// that has not opted in) the posthog-js chunk is never even downloaded and the
// site behaves exactly as before. This keeps the privacy-first footprint small:
// no autocapture, no automatic pageviews, no session recording (forced off here
// so a project-level toggle can't silently re-enable it), only the explicit
// events routed through lib/analytics trackEvent plus feature-flag exposure.
export default function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || typeof window === 'undefined' || window.__posthogReady) {
      return;
    }
    window.__posthogReady = true;

    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

    const config = {
      api_host: host,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      person_profiles: 'identified_only'
    };
    const ready = () => {
      // Let components that depend on flag evaluation (the demo/CTA experiment)
      // know PostHog is available, even if they mounted first.
      window.dispatchEvent(new Event('posthog:ready'));
    };
    const fail = () => {
      window.__posthogReady = false;
    };

    // For PostHog Cloud, load the SDK from PostHog's own asset CDN rather than
    // as bundled chunks. Same SDK and config, but it keeps ~3 requests per new
    // visitor off this site's Vercel CDN request quota. A custom/proxy host
    // falls back to the bundled package.
    const cloud = host.match(/^https:\/\/(us|eu)\.i\.posthog\.com\/?$/);
    if (cloud) {
      const script = document.createElement('script');
      script.src = `https://${cloud[1]}-assets.i.posthog.com/static/array.js`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        if (typeof window.posthog?.init !== 'function') return fail();
        window.posthog.init(key, config);
        ready();
      };
      script.onerror = fail;
      document.head.appendChild(script);
      return;
    }

    import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.init(key, config);
        window.posthog = posthog;
        ready();
      })
      .catch(fail);
  }, []);

  return null;
}
