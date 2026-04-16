import { notFound } from 'next/navigation';
import ContentPage from '../../components/content-page';
import {
  getContentBySlug,
  getRelatedLinks,
  getStaticParamsForType,
  renderMdx
} from '../../../lib/content';
import { buildPageMetadata, buildOgImageUrl } from '../../../lib/metadata';
import { breadcrumbSchema, faqSchema, webPageSchema } from '../../../lib/schema';

export function generateStaticParams() {
  return getStaticParamsForType('compare');
}

export function generateMetadata({ params }) {
  const entry = getContentBySlug('compare', params.slug);

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
  const entry = getContentBySlug('compare', params.slug);

  if (!entry) {
    notFound();
  }

  const body = await renderMdx(entry.content);
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
    />
  );
}
