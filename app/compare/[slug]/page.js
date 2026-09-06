import { notFound } from 'next/navigation';
import ContentPage from '../../components/content-page';
import {
  getContentBySlug,
  getCtaProps,
  getRelatedLinks,
  getStaticParamsForType,
  renderMdxWithCta
} from '../../../lib/content';
import { buildPageMetadata, buildOgImageUrl } from '../../../lib/metadata';
import { breadcrumbSchema, faqSchema, webPageSchema } from '../../../lib/schema';

export function generateStaticParams() {
  return getStaticParamsForType('compare');
}

// Only the comparison pages generated at build time are valid routes.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = getContentBySlug('compare', slug);

  if (!entry) {
    return {};
  }

  return buildPageMetadata({
    title: entry.title,
    description: entry.description,
    canonicalPath: entry.canonicalPath,
    ogImage: buildOgImageUrl(entry.title, entry.description)
  });
}

export default async function ComparePage({ params }) {
  const { slug } = await params;
  const entry = getContentBySlug('compare', slug);

  if (!entry) {
    notFound();
  }

  const ctaProps = getCtaProps(entry);
  const body = await renderMdxWithCta(entry.content, ctaProps);
  const breadcrumb = [
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    { name: entry.title, path: entry.canonicalPath }
  ];

  const schemas = [webPageSchema(entry), faqSchema(entry), breadcrumbSchema(breadcrumb)];

  return (
    <ContentPage
      entry={entry}
      body={body}
      breadcrumb={breadcrumb}
      schemas={schemas}
      relatedLinks={getRelatedLinks(entry)}
      ctaProps={ctaProps}
    />
  );
}
