'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { observePageAnalytics } from '../../lib/localization-analytics';

export default function Analytics({ gaId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryString = searchParams?.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
    return observePageAnalytics(window, { gaId, pathname: pathname || '/', pagePath });
  }, [gaId, pathname, searchParams]);

  return null;
}
