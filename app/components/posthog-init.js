'use client';

import { useEffect } from 'react';

// Initialises PostHog only when NEXT_PUBLIC_POSTHOG_KEY is set. The SDK is
// dynamically imported so that with no key configured (local dev and any deploy
// that has not opted in) the posthog-js chunk is never even downloaded and the
// site behaves exactly as before. This keeps the privacy-first footprint small:
// no autocapture, no automatic pageviews, only the explicit events routed
// through lib/analytics trackEvent plus feature-flag exposure.
export default function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || typeof window === 'undefined' || window.__posthogReady) {
      return;
    }
    window.__posthogReady = true;

    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

    import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.init(key, {
          api_host: host,
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
          person_profiles: 'identified_only'
        });
        window.posthog = posthog;
        // Let components that depend on flag evaluation (the demo/CTA experiment)
        // know PostHog is available, even if they mounted first.
        window.dispatchEvent(new Event('posthog:ready'));
      })
      .catch(() => {
        window.__posthogReady = false;
      });
  }, []);

  return null;
}
