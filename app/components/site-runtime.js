'use client';

import { Suspense, useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import Analytics from './analytics';
import SiteBehavior from './site-behavior';
import PostHogInit from './posthog-init';
import { isProductionAnalyticsHost } from '../../lib/analytics-host';

export default function SiteRuntime({ gaId }) {
  const pathname = usePathname();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    setAnalyticsEnabled(isProductionAnalyticsHost(window.location.hostname));
  }, []);

  // The Viewer hand-off keeps a local conversation identifier in the URL
  // fragment. Load no analytics or general site behavior on that route, so no
  // third-party script ever gets access to the complete browser URL.
  if (/^\/open\/?$/.test(pathname || '')) {
    return null;
  }

  return (
    <>
      <SiteBehavior />
      {analyticsEnabled ? <PostHogInit /> : null}
      {analyticsEnabled && gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaId}', { send_page_view: false });
            `}
          </Script>
          <Suspense fallback={null}>
            <Analytics gaId={gaId} />
          </Suspense>
        </>
      ) : null}
    </>
  );
}
