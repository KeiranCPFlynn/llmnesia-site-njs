'use client';

import { useEffect } from 'react';
import { trackEvent } from '../../lib/analytics';

// A custom not-found page means Next.js no longer emits its built-in
// "404: This page could not be found." document title — which is what the
// page-title analytics report keyed on. To keep 404s segmentable we:
//   1. set a document title that still starts with "404:" (so existing
//      title-based filters keep working), and
//   2. fire a dedicated `page_not_found` event carrying the dead URL, so the
//      offending path is captured directly rather than inferred.
export default function NotFoundTracker() {
  useEffect(() => {
    document.title = '404: Page not found | LLMnesia';

    if (typeof window !== 'undefined') {
      trackEvent('page_not_found', {
        page_location: window.location.href,
        referrer: document.referrer || '(none)'
      });
    }
  }, []);

  return null;
}
