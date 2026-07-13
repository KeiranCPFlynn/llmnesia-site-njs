'use client';

import { useEffect, useState } from 'react';
import InlineInstallCta from './inline-install-cta';
import KineticDemo from './kinetic-demo';

// PostHog experiment flag. Two variants:
//   control    — current order: install CTA banner, then the kinetic demo.
//   demo-first — demo first (it earns the click), CTA joined directly beneath it
//                as one unit at the moment of peak desire.
// Until PostHog is initialised (no key, or flags still loading) we render
// control, so the page is never blank and behaves exactly as it does today.
const FLAG = 'blog-demo-cta-order';

export default function DemoCtaExperiment({ ctaProps = {}, scenes }) {
  const [variant, setVariant] = useState('control');

  useEffect(() => {
    let cancelled = false;

    const decide = () => {
      const ph = window.posthog;
      if (!ph || cancelled) return;
      // getFeatureFlag records the $feature_flag_called exposure event that the
      // experiment uses as its denominator.
      const evaluate = () => {
        if (cancelled) return;
        setVariant(ph.getFeatureFlag(FLAG) === 'demo-first' ? 'demo-first' : 'control');
      };
      if (typeof ph.onFeatureFlags === 'function') {
        ph.onFeatureFlags(evaluate);
      } else {
        evaluate();
      }
    };

    if (window.posthog) {
      decide();
    } else {
      window.addEventListener('posthog:ready', decide, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('posthog:ready', decide);
    };
  }, []);

  if (variant === 'demo-first') {
    return (
      <div className="demo-cta-unit" data-variant="demo-first">
        <KineticDemo scenes={scenes} />
        <InlineInstallCta {...ctaProps} placement="inline" />
      </div>
    );
  }

  return (
    <>
      <InlineInstallCta {...ctaProps} placement="inline" />
      <KineticDemo scenes={scenes} />
    </>
  );
}
