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
};

const PLATFORM_COUNT = 12;

function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function BlogIndexPage() {
  const posts = getAllContent('blog');
  const categories = getAllCategories('blog');

  const categoryCounts = {};
  for (const cat of categories) {
    categoryCounts[cat] = getContentByCategory('blog', cat).length;
  }

  const featured = posts.find((p) => p.category === 'foundational') || posts[0];
  const remaining = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <SiteChrome>
      <main id="main-content" className="blog-index-main">

        <div className="container">
          <header className="blog-masthead">
            <div className="blog-masthead-copy">
              <p className="blog-masthead-dateline">
                <strong>Field notes</strong> · updated weekly
              </p>
              <h1 className="blog-masthead-h1">
                Notes on not losing<br />what AI told you.
              </h1>
              <p className="blog-masthead-lede">
                Practical guides for finding old answers, stopping repeat prompting, and keeping a searchable archive across every tool you use.
              </p>
            </div>
            <div className="blog-masthead-stats">
              <div className="blog-stat">
                <span className="blog-stat-n">{posts.length}</span>
                <span className="blog-stat-l">Articles</span>
              </div>
              <div className="blog-stat">
                <span className="blog-stat-n">{categories.length || 6}</span>
                <span className="blog-stat-l">Topics</span>
              </div>
              <div className="blog-stat">
                <span className="blog-stat-n">{PLATFORM_COUNT}</span>
                <span className="blog-stat-l">Platforms</span>
              </div>
            </div>
          </header>
        </div>

        <div className="blog-cat-rail">
          <div className="blog-cat-rail-inner container">
            <span className="blog-cat-pill blog-cat-pill-active">
              All <span className="blog-cat-count">{posts.length}</span>
            </span>
            {categories.map((cat) => (
              <a key={cat} href={`/blog/category/${cat}`} className="blog-cat-pill">
                {CATEGORY_LABELS[cat] || cat}{' '}
                <span className="blog-cat-count">{categoryCounts[cat]}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="blog-feed">

            {featured && (
              <article className="blog-featured">
                <span className="blog-featured-flag">
                  Start here
                  {featured.category ? ` · ${CATEGORY_LABELS[featured.category] || featured.category}` : ''}
                </span>
                <h2 className="blog-featured-h2">
                  <a href={`/blog/${featured.slug}`}>{featured.title}</a>
                </h2>
                <p className="blog-featured-dek">{featured.description}</p>
                <div className="blog-featured-meta">
                  <span><strong>{readingTime(featured.content)} min</strong> read</span>
                  <span>{featured.author}</span>
                  <span>{formatShortDate(featured.publishDate)}</span>
                </div>
                <a className="blog-featured-cta" href={`/blog/${featured.slug}`}>
                  Read the whole thing →
                </a>
              </article>
            )}

            <div className="blog-list">
              {remaining.map((post, i) => (
                <div key={post.slug} className="blog-list-row">
                  <span className="blog-list-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="blog-list-body">
                    <h3 className="blog-list-h3">
                      <a href={`/blog/${post.slug}`}>{post.title}</a>
                    </h3>
                    <div className="blog-list-sub">
                      {post.category && (
                        <span className="blog-list-cat">
                          {CATEGORY_LABELS[post.category] || post.category}
                        </span>
                      )}
                    </div>
                    <p className="blog-list-p">{post.description}</p>
                  </div>
                  <span className="blog-list-time">{readingTime(post.content)}m</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </main>
    </SiteChrome>
  );
}
