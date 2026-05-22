import SiteChrome from '../components/site-chrome';
import { getAllContent, getAllCategories, getContentByCategory } from '../../lib/content';
import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'LLMnesia Blog — AI Chat History & Cross-LLM Workflow Guides',
  description:
    'Practical guides on saving AI conversations, searching old ChatGPT prompts, and building a cross-platform AI knowledge base. Tips for ChatGPT, Claude, Gemini users.',
  canonicalPath: '/blog'
});

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

function formatPostDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function BlogIndexPage() {
  const posts = getAllContent('blog');
  const categories = getAllCategories('blog');

  const categoryCounts = {};
  for (const cat of categories) {
    categoryCounts[cat] = getContentByCategory('blog', cat).length;
  }

  return (
    <SiteChrome>
      <main id="main-content" className="blog-index">
        <header className="blog-index__head">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Field notes
          </p>
          <h1>
            Notes on not losing <span className="text-gradient">what AI told you.</span>
          </h1>
          <p className="blog-index__lede">
            Practical guides for finding old answers, stopping repeat prompting, and keeping
            a searchable archive across every AI tool you use.
          </p>
        </header>

        <nav className="blog-index__cats" aria-label="Categories">
          <span className="blog-index__cats-pill blog-index__cats-pill--active">
            All <span className="blog-index__cats-count">{posts.length}</span>
          </span>
          {categories.map((cat) => (
            <a key={cat} href={`/blog/category/${cat}`} className="blog-index__cats-pill">
              {CATEGORY_LABELS[cat] || cat}{' '}
              <span className="blog-index__cats-count">{categoryCounts[cat]}</span>
            </a>
          ))}
        </nav>

        <ol className="post-list">
          {posts.map((post) => (
            <li key={post.slug} className="post-list__item">
              <a href={`/blog/${post.slug}`} className="post-list__link">
                <div className="post-list__top">
                  <time dateTime={post.publishDate}>{formatPostDate(post.publishDate)}</time>
                  {post.category && (
                    <span className="post-list__cat">
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                  )}
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
