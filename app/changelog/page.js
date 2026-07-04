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

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric'
  });
}

function releaseId(version) {
  return `v-${version.replace(/\./g, '-')}`;
}

export default function ChangelogPage() {
  // Entries flagged `published: false` are staged but hidden — flip the flag
  // (or delete it) in app/data/changelog.json to make a release public.
  const published = releases.filter((release) => release.published !== false);
  const latestRelease = published[0];

  return (
    <SiteChrome>
      <main id="main-content" className="section container changelog-main">
        <header className="changelog-hero">
          <div>
            <p className="content-index-kicker">Release notes</p>
            <h1>
              What&apos;s <span className="text-gradient">New</span>
            </h1>
            <p>
              Product updates, platform fixes, and reliability improvements for LLMnesia. Newest
              releases are listed first.
            </p>
          </div>
          <div className="changelog-hero-panel">
            <span className="changelog-panel-label">Latest release</span>
            <strong>v{latestRelease.version}</strong>
            <time dateTime={latestRelease.date}>{formatDate(latestRelease.date)}</time>
            <InstallLink className="button button-small" />
          </div>
        </header>

        <div className="changelog-layout">
          <aside className="changelog-rail" aria-label="Release index">
            <p className="changelog-rail-label">Releases</p>
            <ol>
              {published.map((release) => (
                <li key={release.version}>
                  <a href={`#${releaseId(release.version)}`}>
                    <span>v{release.version}</span>
                    <time dateTime={release.date}>{formatShortDate(release.date)}</time>
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="changelog-list">
            {published.map((release) => (
              <article
                className={`changelog-entry${release.major ? ' is-major' : ''}`}
                id={releaseId(release.version)}
                key={release.version}
              >
                <div className="changelog-entry-meta">
                  <span className="changelog-version">v{release.version}</span>
                  <time className="changelog-date" dateTime={release.date}>
                    {formatDate(release.date)}
                  </time>
                  {release.major && <span className="changelog-badge">Major release</span>}
                </div>
                <div className="changelog-entry-body">
                  <h2 className="changelog-title">{release.title}</h2>

                  {release.summary && <p className="changelog-summary">{release.summary}</p>}

                  {release.features && (
                    <div className="changelog-features">
                      {release.features.map((feature, i) => (
                        <div className="changelog-feature" key={i}>
                          <h3>{feature.name}</h3>
                          <p>{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {release.highlights && (
                    <ul className="changelog-highlights">
                      {release.highlights.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {release.more && (
                    <div className="changelog-more">
                      <p className="changelog-more-label">Also in this release</p>
                      <ul className="changelog-highlights">
                        {release.more.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </SiteChrome>
  );
}
