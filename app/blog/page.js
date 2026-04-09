import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import { getAllContent } from '../../lib/content';
import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'LLMnesia Blog — AI Chat History & Cross-LLM Workflow Guides',
  description:
    'Practical guides on saving AI conversations, searching old ChatGPT prompts, and building a cross-platform AI knowledge base. Tips for ChatGPT, Claude, Gemini users.',
  canonicalPath: '/blog'
});

export default function BlogIndexPage() {
  const posts = getAllContent('blog');

  return (
    <SiteChrome>
      <main id="main-content" className="section container content-index-main">
        <header className="content-index-header">
          <h1>
            AI Chat History &amp; Workflow{' '}
            <span className="text-gradient">Blog</span>
          </h1>
          <p>
            Practical guides for finding old AI answers, stopping repeat prompting, and building a
            searchable archive across ChatGPT, Claude, Gemini, and more.
          </p>
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
