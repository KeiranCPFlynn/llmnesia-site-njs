import { NextResponse } from 'next/server';

const LEGACY_PATH_REDIRECTS = {
  '/index.html': '/',
  '/privacy-policy.html': '/privacy-policy'
};

function shouldSkip(pathname = '') {
  return pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico';
}

export function middleware(request) {
  const { nextUrl } = request;

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

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*'
};
