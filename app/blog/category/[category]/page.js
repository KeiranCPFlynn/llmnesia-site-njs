import { notFound } from 'next/navigation';
import SiteChrome from '../../../components/site-chrome';
import InstallLink from '../../../components/install-link';
import { getAllCategories, getContentByCategory } from '../../../../lib/content';
import { buildPageMetadata } from '../../../../lib/metadata';

const CATEGORY_LABELS = {
  'platform-guides': 'Platform Guides',
  'persona-guides': 'Persona Guides',
  comparisons: 'Comparisons',
  workflows: 'Workflows',
  foundational: 'Foundational',
  'problem-solving': 'Problem Solving'
};

const CATEGORY_DESCRIPTIONS = {
  'platform-guides': 'Step-by-step guides for searching and managing conversation history on ChatGPT, Claude, Gemini, and other AI platforms.',
  'persona-guides': 'How different professionals — developers, writers, researchers, and more — manage and retrieve their AI conversation history.',
  comparisons: 'Side-by-side comparisons of AI tools, browser extensions, and approaches to saving and searching AI conversations.',
  workflows: 'Practical workflows for building prompt libraries, knowledge bases, and searchable AI archives.',
  foundational: 'Core concepts behind AI conversation retrieval, local-first privacy, and how AI chat history works.',
  'problem-solving': 'Fixes and explanations for common problems with AI chat history — missing conversations, broken search, lost answers.'
};

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
      <main id="main-content" className="section container content-index-main">
        <header className="content-index-header">
          <p className="content-index-kicker">
            <a href="/blog">Blog</a> › {label}
          </p>
          <h1>
            <span className="text-gradient">{label}</span>
          </h1>
          {description && <p>{description}</p>}
          <div className="content-index-actions">
            <InstallLink className="button" />
            <span className="content-index-count">{posts.length} articles</span>
          </div>
        </header>

        <div className="card-grid content-index-grid">
          {posts.map((post) => (
            <article className="card content-index-card" key={post.slug}>
              <div className="content-index-card-top">
                <p className="content-index-kicker">{post.primaryKeyword}</p>
                <span className={`intent-badge intent-badge-${post.intent}`}>
                  {post.intent}
                </span>
              </div>
              <h2>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h2>
              <p>{post.description}</p>
              <div className="content-index-card-footer">
                <a className="text-link" href={`/blog/${post.slug}`}>
                  Read article
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </SiteChrome>
  );
}
