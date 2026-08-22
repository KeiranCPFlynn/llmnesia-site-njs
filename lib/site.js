export const SITE_URL = 'https://www.llmnesia.com';

export const CHROME_WEB_STORE_URL =
  'https://chromewebstore.google.com/detail/llmnesia/leekfgbdojiaabifbjbbgiiclannjdkf';

export const EDGE_ADDONS_URL =
  'https://microsoftedge.microsoft.com/addons/detail/fdhcfjmddllgfiijpinhcijldkjnoimm';

export function installStoreForUserAgent(userAgent = '') {
  if (/\bEdg\//.test(userAgent)) {
    return { store: 'edge', url: EDGE_ADDONS_URL };
  }

  return { store: 'chrome', url: CHROME_WEB_STORE_URL };
}

export const DEFAULT_AUTHOR = 'Keiran Flynn';
export const AUTHOR_URL = 'https://www.llmnesia.com/about';

export function absoluteUrl(pathname = '/') {
  const safePath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${safePath}`;
}

export function contentGroupFromPath(pathname = '/') {
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/compare')) return 'compare';
  if (pathname.startsWith('/use-cases')) return 'use-cases';
  if (pathname.startsWith('/privacy-policy')) return 'privacy-policy';
  return 'main-site';
}
