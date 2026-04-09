import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import { getAllContent } from '../../lib/content';
import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'LLMnesia Use Cases',
  description:
    'Use-case guides for founders, developers, and researchers who need to recover old AI prompts, decisions, and outputs quickly.',
  canonicalPath: '/use-cases'
});

export default function UseCasesIndexPage() {
  const pages = getAllContent('use-cases');

  return (
    <SiteChrome>
      <main id="main-content" className="section container content-index-main">
        <header className="content-index-header">
          <h1>LLMnesia Use Cases</h1>
          <p>
            Job-to-be-done playbooks for people who rely on AI every day and need consistent search
            across tools.
          </p>
          <InstallLink className="button" />
        </header>

        <div className="card-grid content-index-grid">
          {pages.map((page) => (
            <article className="card content-index-card" key={page.slug}>
              <p className="content-index-kicker">{page.primaryKeyword}</p>
              <h2>
                <a href={`/use-cases/${page.slug}`}>{page.title}</a>
              </h2>
              <p>{page.description}</p>
              <a className="text-link" href={`/use-cases/${page.slug}`}>
                Read use case
              </a>
            </article>
          ))}
        </div>
      </main>
    </SiteChrome>
  );
}
