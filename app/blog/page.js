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
            <p className="blog-masthead-dateline">
              <strong>Field notes</strong> · updated weekly
            </p>
            <h1 className="blog-masthead-h1">
              Notes on not losing<br /><span className="text-gradient">what AI told you.</span>
            </h1>
            <p className="blog-masthead-lede">
              Practical guides for finding old answers, stopping repeat prompting, and keeping a searchable archive across every tool you use.
            </p>
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

        <div className="container blog-content">

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
              <div className="blog-featured-footer">
                <div className="blog-featured-meta">
                  <span><strong>{readingTime(featured.content)} min</strong> read</span>
                  <span>{featured.author}</span>
                  <span>{formatShortDate(featured.publishDate)}</span>
                </div>
                <a className="blog-featured-cta" href={`/blog/${featured.slug}`}>
                  Read the whole thing →
                </a>
              </div>
            </article>
          )}

          {remaining.length > 0 && (
            <div className="card-grid content-index-grid">
              {remaining.map((post) => (
                <article className="card content-index-card" key={post.slug}>
                  <div className="content-index-card-top">
                    {post.category && (
                      <span className="content-index-kicker">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                    )}
                    <span className="blog-read-time">{readingTime(post.content)} min</span>
                  </div>
                  <h2>
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h2>
                  <p>{post.description}</p>
                  <div className="content-index-card-footer">
                    <a className="text-link" href={`/blog/${post.slug}`}>Read article</a>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>

      </main>
    </SiteChrome>
  );
}
