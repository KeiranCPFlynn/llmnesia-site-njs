'use client';

import { useEffect } from 'react';

// Fires one anonymous counter when the Vault page loads, giving the waitlist
// funnel its denominator. The site sets capture_pageview:false (privacy-first),
// so there is no automatic $pageview — this explicit event is how /vault visits
// are measured. No PII, matching the waitlist form's anonymous approach.
// PostHog initialises via an async dynamic import, so if it is not ready yet we
// wait for the posthog:ready event (same pattern as demo-cta-experiment).
export default function VaultPageView() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let fired = false;
    const fire = () => {
      if (fired || !window.posthog) return;
      fired = true;
      window.posthog.capture('vault_page_viewed');
    };

    if (window.posthog) {
      fire();
      return undefined;
    }

    window.addEventListener('posthog:ready', fire, { once: true });
    return () => window.removeEventListener('posthog:ready', fire);
  }, []);

  return null;
}
