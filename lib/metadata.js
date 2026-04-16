import { absoluteUrl, SITE_URL } from './site';

export function buildOgImageUrl(title, description) {
  const params = new URLSearchParams({ title, description });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

export function buildPageMetadata({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage
}) {
  const canonical = absoluteUrl(canonicalPath);
  const image = ogImage || absoluteUrl('/assets/og.png');

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
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  };
}
