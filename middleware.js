import { NextResponse } from 'next/server';

const CANONICAL_HOST = 'llmnesia.com';
const LEGACY_PATH_REDIRECTS = {
  '/index.html': '/',
  '/privacy-policy.html': '/privacy-policy'
};

function isLocalHost(host = '') {
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

function shouldSkip(pathname = '') {
  return pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico';
}

export function middleware(request) {
  const { nextUrl } = request;
  const host = request.headers.get('host') || '';

  if (shouldSkip(nextUrl.pathname)) {
    return NextResponse.next();
  }

  const legacyTarget = LEGACY_PATH_REDIRECTS[nextUrl.pathname];
  if (legacyTarget) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = legacyTarget;
    redirectUrl.search = nextUrl.search;
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (!isLocalHost(host) && host !== CANONICAL_HOST) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.protocol = 'https:';
    canonicalUrl.host = CANONICAL_HOST;
    return NextResponse.redirect(canonicalUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};
