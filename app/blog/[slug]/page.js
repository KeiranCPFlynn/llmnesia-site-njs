import { notFound } from 'next/navigation';
import BlogPost from '../../components/blog-post';
import {
  getContentBySlug,
  getCtaProps,
  getDemoForEntry,
  getRelatedLinks,
  getStaticParamsForType,
  renderMdxWithCta
} from '../../../lib/content';
import { buildPageMetadata, buildOgImageUrl } from '../../../lib/metadata';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  softwareApplicationSchema,
  howToSchema
} from '../../../lib/schema';

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

  const ctaProps = getCtaProps(entry);
  const demo = getDemoForEntry(entry);
  const body = await renderMdxWithCta(entry.content, ctaProps, {
    demoScenes: demo ? demo.scenes : null
  });
  const breadcrumb = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: entry.title, path: entry.canonicalPath }
  ];

  const schemas = [
    articleSchema(entry),
    breadcrumbSchema(breadcrumb),
    softwareApplicationSchema()
  ];

  if (Array.isArray(entry.faq) && entry.faq.length > 0) {
    schemas.push(faqSchema(entry));
  }

  const howTo = howToSchema(entry);
  if (howTo) {
    schemas.push(howTo);
  }

  return (
    <BlogPost
      entry={entry}
      body={body}
      breadcrumb={breadcrumb}
      schemas={schemas}
      relatedLinks={getRelatedLinks(entry)}
      ctaProps={ctaProps}
    />
  );
}
