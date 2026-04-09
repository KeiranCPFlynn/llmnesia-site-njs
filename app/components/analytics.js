'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { contentGroupFromPath } from '../../lib/site';

export default function Analytics({ gaId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || typeof window.gtag !== 'function') {
      return;
    }

    const queryString = searchParams?.toString();
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    window.gtag('config', gaId, {
      page_path: pagePath,
      content_group: contentGroupFromPath(pathname || '/')
    });
  }, [gaId, pathname, searchParams]);

  return null;
}
