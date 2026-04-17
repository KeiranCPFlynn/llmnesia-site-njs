import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import { buildPageMetadata } from '../../lib/metadata';
import releases from '../data/changelog.json';

export const metadata = buildPageMetadata({
  title: 'LLMnesia Changelog — What\'s New',
  description:
    'Release notes and updates for LLMnesia, the local-first search index for your AI chat conversations across ChatGPT, Claude, Gemini, and more.',
  canonicalPath: '/changelog'
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function ChangelogPage() {
  return (
    <SiteChrome>
      <main id="main-content" className="section container changelog-main">
        <header className="content-index-header">
          <h1>
            What&apos;s <span className="text-gradient">New</span>
          </h1>
          <p>Updates and improvements to LLMnesia, newest first.</p>
          <div className="content-index-actions">
            <InstallLink className="button" />
          </div>
        </header>

        <div className="changelog-list">
          {releases.map((release) => (
            <article className="changelog-entry" key={release.version}>
              <div className="changelog-entry-header">
                <span className="changelog-version">v{release.version}</span>
                <time className="changelog-date" dateTime={release.date}>
                  {formatDate(release.date)}
                </time>
              </div>
              <h2 className="changelog-title">{release.title}</h2>
              <ul className="changelog-highlights">
                {release.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
    </SiteChrome>
  );
}
