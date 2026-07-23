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

// Bucket the newest-first list into groups anchored by a `major` release.
// Because minor releases are newer than the major they follow, they appear
// *above* their anchor in a newest-first list — so we buffer non-major
// entries and attach them to the next major we hit. Anything left over after
// the last major (older releases with no headline anchor) becomes an
// "Earlier releases" group at the bottom.
function groupReleases(published) {
  const groups = [];
  let buffer = [];

  for (const release of published) {
    if (release.major) {
      groups.push({ type: 'major', anchor: release, minors: buffer });
      buffer = [];
    } else {
      buffer.push(release);
    }
  }

  if (buffer.length) {
    groups.push({ type: 'earlier', anchor: null, minors: buffer });
  }

  return groups;
}

// The full, expanded body for a headline release (the featured latest entry and
// each `major` anchor). Everything below it in the list collapses into
// MinorEntry accordions instead.
function FullEntry({ release, badge, className }) {
  return (
    <article className={`changelog-entry ${className}`} id={releaseId(release.version)}>
      <div className="changelog-entry-meta">
        <span className="changelog-version">v{release.version}</span>
        <time className="changelog-date" dateTime={release.date}>
          {formatDate(release.date)}
        </time>
        {badge && <span className="changelog-badge">{badge}</span>}
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
  );
}

function MinorEntry({ release }) {
  return (
    <details className="changelog-minor" id={releaseId(release.version)}>
      <summary className="changelog-minor-summary">
        <span className="changelog-minor-version">v{release.version}</span>
        <time className="changelog-minor-date" dateTime={release.date}>
          {formatShortDate(release.date)}
        </time>
        <span className="changelog-minor-title">{release.title}</span>
        <span className="changelog-minor-chevron" aria-hidden="true" />
      </summary>
      <div className="changelog-minor-body">
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
    </details>
  );
}

export default function ChangelogPage() {
  // Entries flagged `published: false` are staged but hidden — flip the flag
  // (or delete it) in app/data/changelog.json to make a release public.
  const published = releases.filter((release) => release.published !== false);
  // Feature the newest release in full at the top — whatever its version — so it
  // is never buried beneath the last `major` anchor. Everything older keeps the
  // major-anchored grouping below.
  const [latestRelease, ...history] = published;
  const groups = groupReleases(history);

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
            <ol className="changelog-rail-groups">
              <li>
                <a
                  href={`#${releaseId(latestRelease.version)}`}
                  className="changelog-rail-anchor changelog-rail-anchor--major"
                >
                  <span>v{latestRelease.version}</span>
                  <time dateTime={latestRelease.date}>
                    {formatShortDate(latestRelease.date)}
                  </time>
                </a>
              </li>
              {groups.map((group) => (
                <li key={group.anchor ? group.anchor.version : 'earlier'}>
                  {group.type === 'major' ? (
                    <a
                      href={`#${releaseId(group.anchor.version)}`}
                      className="changelog-rail-anchor changelog-rail-anchor--major"
                    >
                      <span>v{group.anchor.version}</span>
                      <time dateTime={group.anchor.date}>
                        {formatShortDate(group.anchor.date)}
                      </time>
                    </a>
                  ) : (
                    <p className="changelog-rail-heading">Earlier releases</p>
                  )}
                  {group.minors.length > 0 && (
                    <ol className="changelog-rail-minors">
                      {group.minors.map((release) => (
                        <li key={release.version}>
                          <a
                            href={`#${releaseId(release.version)}`}
                            className="changelog-rail-anchor"
                          >
                            <span>v{release.version}</span>
                            <time dateTime={release.date}>
                              {formatShortDate(release.date)}
                            </time>
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </aside>

          <div className="changelog-list">
            <section className="changelog-group">
              <FullEntry
                release={latestRelease}
                badge="Latest release"
                className="is-latest"
              />
            </section>

            {groups.map((group) => (
              <section
                className="changelog-group"
                key={group.anchor ? group.anchor.version : 'earlier'}
              >
                {group.type === 'major' ? (
                  <FullEntry
                    release={group.anchor}
                    badge="Major release"
                    className="is-major"
                  />
                ) : (
                  <header className="changelog-group-header">
                    <h2>Earlier releases</h2>
                    <p>Incremental updates from the 0.1 series.</p>
                  </header>
                )}

                {group.minors.length > 0 && (
                  <div className="changelog-since">
                    {group.type === 'major' && (
                      <p className="changelog-since-label">Since this release</p>
                    )}
                    <div className="changelog-minor-list">
                      {group.minors.map((release) => (
                        <MinorEntry release={release} key={release.version} />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </SiteChrome>
  );
}
