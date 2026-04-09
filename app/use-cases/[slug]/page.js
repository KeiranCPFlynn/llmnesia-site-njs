import { notFound } from 'next/navigation';
import ContentPage from '../../components/content-page';
import {
  getContentBySlug,
  getRelatedLinks,
  getStaticParamsForType,
  renderMdx
} from '../../../lib/content';
import { buildPageMetadata } from '../../../lib/metadata';
import { articleSchema, breadcrumbSchema } from '../../../lib/schema';

export function generateStaticParams() {
  return getStaticParamsForType('use-cases');
}

export function generateMetadata({ params }) {
  const entry = getContentBySlug('use-cases', params.slug);

  if (!entry) {
    return {};
  }

  return buildPageMetadata({
    title: entry.title,
    description: entry.description,
    canonicalPath: entry.canonicalPath,
    ogType: 'article'
  });
}

export default async function UseCasePage({ params }) {
  const entry = getContentBySlug('use-cases', params.slug);

  if (!entry) {
    notFound();
  }

  const body = await renderMdx(entry.content);
  const breadcrumb = [
    { name: 'Home', path: '/' },
    { name: 'Use Cases', path: '/use-cases' },
    { name: entry.title, path: entry.canonicalPath }
  ];

  const schemas = [articleSchema(entry), breadcrumbSchema(breadcrumb)];

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
