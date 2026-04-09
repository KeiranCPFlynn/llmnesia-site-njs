import { absoluteUrl } from './site';

export function buildPageMetadata({ title, description, canonicalPath, ogType = 'website' }) {
  const canonical = absoluteUrl(canonicalPath);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'LLMnesia',
      type: ogType,
      images: [absoluteUrl('/assets/og.png')]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl('/assets/og.png')]
    }
  };
}
