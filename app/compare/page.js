import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import { getAllContent } from '../../lib/content';
import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'LLMnesia vs Alternatives — AI Chat History Extension Comparisons',
  description:
    'Side-by-side comparisons of LLMnesia against ChatGPT history, Claude Projects, Mem AI, Promptly, ChatHub, and other AI chat tools. Find the right setup for your workflow.',
  canonicalPath: '/compare'
});

export default function CompareIndexPage() {
  const pages = getAllContent('compare');

  return (
    <SiteChrome>
      <main id="main-content" className="section container content-index-main">
        <header className="content-index-header">
          <h1>
            LLMnesia vs{' '}
            <span className="text-gradient">Alternatives</span>
          </h1>
          <p>
            Source-cited comparisons between LLMnesia and popular AI chat extensions, note tools,
            and history workflows — so you can pick the right retrieval setup for your stack.
          </p>
          <div className="content-index-actions">
            <InstallLink className="button" />
            <span className="content-index-count">{pages.length} comparisons</span>
          </div>
        </header>

        <div className="card-grid content-index-grid">
          {pages.map((page) => (
            <article className="card content-index-card" key={page.slug}>
              <div className="content-index-card-top">
                <p className="content-index-kicker">{page.primaryKeyword}</p>
                <span className={`intent-badge intent-badge-${page.intent}`}>
                  {page.intent}
                </span>
              </div>
              <h2>
                <a href={`/compare/${page.slug}`}>{page.title}</a>
              </h2>
              <p>{page.description}</p>
              <div className="content-index-card-footer">
                <a className="text-link" href={`/compare/${page.slug}`}>
                  View comparison
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </SiteChrome>
  );
}
