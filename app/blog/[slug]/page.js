import { notFound } from 'next/navigation';
import BlogPost from '../../components/blog-post';
import {
  getContentBySlug,
  getRelatedLinks,
  getStaticParamsForType,
  renderMdx
} from '../../../lib/content';
import { buildPageMetadata, buildOgImageUrl } from '../../../lib/metadata';
import { articleSchema, breadcrumbSchema } from '../../../lib/schema';

export function generateStaticParams() {
  return getStaticParamsForType('blog');
}

export function generateMetadata({ params }) {
  const entry = getContentBySlug('blog', params.slug);

  if (!entry) {
    return {};
  }

  return buildPageMetadata({
    title: entry.title,
    description: entry.description,
    canonicalPath: entry.canonicalPath,
    ogType: 'article',
    ogImage: buildOgImageUrl(entry.title, entry.description)
  });
}

export default async function BlogArticlePage({ params }) {
  const entry = getContentBySlug('blog', params.slug);

  if (!entry) {
    notFound();
  }

  const body = await renderMdx(entry.content);
  const breadcrumb = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: entry.title, path: entry.canonicalPath }
  ];

  const schemas = [articleSchema(entry), breadcrumbSchema(breadcrumb)];

  return (
    <BlogPost
      entry={entry}
      body={body}
      breadcrumb={breadcrumb}
      schemas={schemas}
      relatedLinks={getRelatedLinks(entry)}
    />
  );
}
