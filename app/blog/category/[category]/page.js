import { notFound } from 'next/navigation';
import SiteChrome from '../../../components/site-chrome';
import { getAllCategories, getContentByCategory } from '../../../../lib/content';
import { buildPageMetadata } from '../../../../lib/metadata';

const CATEGORY_LABELS = {
  'platform-guides': 'Platform Guides',
  'persona-guides': 'Persona Guides',
  comparisons: 'Comparisons',
  workflows: 'Workflows',
  foundational: 'Foundational',
  'problem-solving': 'Problem Solving',
  'use-cases': 'Use Cases',
  'how-to': 'How-To',
  explainer: 'Explainers'
};

const CATEGORY_DESCRIPTIONS = {
  'platform-guides': 'Step-by-step guides for searching and managing conversation history on ChatGPT, Claude, Gemini, and other AI platforms.',
  'persona-guides': 'How different professionals — developers, writers, researchers, and more — manage and retrieve their AI conversation history.',
  comparisons: 'Side-by-side comparisons of AI tools, browser extensions, and approaches to saving and searching AI conversations.',
  workflows: 'Practical workflows for building prompt libraries, knowledge bases, and searchable AI archives.',
  foundational: 'Core concepts behind AI conversation retrieval, local-first privacy, and how AI chat history works.',
  'problem-solving': 'Fixes and explanations for common problems with AI chat history — missing conversations, broken search, lost answers.',
  'use-cases': 'Real-world use cases for managing AI conversation history across roles and industries — from students to executives.',
  'how-to': 'Step-by-step instructions for finding, organising, exporting, and searching your AI conversation history.',
  explainer: 'Plain-language explainers covering how AI memory, conversation limits, and chat history features actually work.'
};

function formatPostDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function generateStaticParams() {
  return getAllCategories('blog').map((category) => ({ category }));
}

export function generateMetadata({ params }) {
  const label = CATEGORY_LABELS[params.category];
  if (!label) return {};

  const description = CATEGORY_DESCRIPTIONS[params.category] ||
    `LLMnesia blog posts in the ${label} category.`;

  return buildPageMetadata({
    title: `${label} — LLMnesia Blog`,
    description,
    canonicalPath: `/blog/category/${params.category}`
  });
}

export default function BlogCategoryPage({ params }) {
  const label = CATEGORY_LABELS[params.category];
  if (!label) notFound();

  const posts = getContentByCategory('blog', params.category);
  if (posts.length === 0) notFound();

  const description = CATEGORY_DESCRIPTIONS[params.category];

  return (
    <SiteChrome>
      <main id="main-content" className="blog-index">
        <header className="blog-index__head">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            <a href="/blog" className="blog-index__cat-back">Field notes</a>
            <span aria-hidden="true">›</span>
            {label}
          </p>
          <h1>
            <span className="text-gradient">{label}</span>
          </h1>
          {description && <p className="blog-index__lede">{description}</p>}
          <p className="blog-index__count">{posts.length} {posts.length === 1 ? 'article' : 'articles'}</p>
        </header>

        <ol className="post-list">
          {posts.map((post) => (
            <li key={post.slug} className="post-list__item">
              <a href={`/blog/${post.slug}`} className="post-list__link">
                <div className="post-list__top">
                  <time dateTime={post.publishDate}>{formatPostDate(post.publishDate)}</time>
                </div>
                <h2>{post.title}</h2>
                <p>{post.dek || post.description}</p>
              </a>
            </li>
          ))}
        </ol>
      </main>
    </SiteChrome>
  );
}
