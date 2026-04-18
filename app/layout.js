import './globals.css';
import { Suspense } from 'react';
import Script from 'next/script';
import Analytics from './components/analytics';
import SiteBehavior from './components/site-behavior';
import { absoluteUrl, SITE_URL } from '../lib/site';

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LLMnesia | Stop losing answers in AI chats.',
    template: '%s | LLMnesia'
  },
  description:
    'Stop losing answers in AI chats. LLMnesia indexes conversations across ChatGPT, Claude, Gemini and more so you can find old prompts, answers, ideas, and decisions instantly.',
  alternates: {
    canonical: absoluteUrl('/'),
    types: {
      'application/rss+xml': absoluteUrl('/feed.xml')
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.svg'
  },
  openGraph: {
    title: 'LLMnesia | Stop losing answers in AI chats.',
    description:
      'Stop losing answers in AI chats. LLMnesia indexes conversations across ChatGPT, Claude, Gemini and more so you can find old prompts, answers, ideas, and decisions instantly.',
    siteName: 'LLMnesia',
    url: absoluteUrl('/'),
    type: 'website',
    images: [absoluteUrl('/assets/og.png')]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLMnesia | Stop losing your best AI work',
    description:
      'Stop losing answers in AI chats. LLMnesia indexes conversations across ChatGPT, Claude, Gemini and more so you can find old prompts, answers, ideas, and decisions instantly.',
    images: [absoluteUrl('/assets/og.png')]
  },
  verification: {
    google: googleSiteVerification
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1117'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="alternate" type="application/rss+xml" title="LLMnesia Blog Feed" href="/feed.xml" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <SiteBehavior />
        {gaId ? (
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
      </body>
    </html>
  );
}
