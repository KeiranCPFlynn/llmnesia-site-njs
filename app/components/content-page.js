import InstallLink from './install-link';
import SiteChrome from './site-chrome';
import JsonLd from './json-ld';

const TYPE_LABELS = {
  blog: 'Blog',
  compare: 'Compare',
  'use-cases': 'Use Case'
};

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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function stripTypePrefix(label) {
  return label.replace(/^[^:]+:\s*/, '');
}

export default function ContentPage({ entry, body, breadcrumb, schemas, relatedLinks }) {
  const typeLabel = TYPE_LABELS[entry.type] || entry.type;
  const categoryLabel = entry.category ? (CATEGORY_LABELS[entry.category] || entry.category) : null;
  const mins = readingTime(entry.content);

  const readNext = relatedLinks[0] || null;
  const otherLinks = relatedLinks.slice(1);

  return (
    <SiteChrome>
      {schemas.map((schema, index) => (
        <JsonLd key={`${entry.slug}-schema-${index}`} data={schema} />
      ))}

      <main id="main-content" className="section container content-main">
        <nav className="content-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb.map((item, index) => (
            <span key={item.path}>
              {index > 0 && <span className="content-meta-sep" aria-hidden="true">/ </span>}
              <a href={item.path}>{item.name}</a>
            </span>
          ))}
        </nav>

        <article className="content-article">
          <header className="content-header">
            <div className="content-type-badges">
              <span className="content-type-badge">{typeLabel}</span>
              {categoryLabel && (
                <span className="content-type-badge content-type-badge-cat">{categoryLabel}</span>
              )}
            </div>

            <h1>{entry.title}</h1>

            <p className="answer-first">{entry.description}</p>

            <div className="content-meta-labeled">
              <span><strong>{entry.author}</strong></span>
              <span className="content-meta-sep">·</span>
              <span>Published <strong>{formatDate(entry.publishDate)}</strong></span>
              {entry.updatedDate !== entry.publishDate && (
                <>
                  <span className="content-meta-sep">·</span>
                  <span>Updated {formatDate(entry.updatedDate)}</span>
                </>
              )}
              <span className="content-meta-sep">·</span>
              <span><strong>{mins} min</strong> read</span>
            </div>

            <div>
              <InstallLink className="button" />
            </div>
          </header>

          <div className="content-body">{body}</div>

          <section className="content-section content-faq" aria-label="FAQ">
            <p className="content-section-label">Frequently asked</p>
            <div className="content-faq-list">
              {entry.faq.map((item) => (
                <div className="faq-item" key={item.question}>
                  <details>
                    <summary>
                      {item.question}
                      <span className="faq-item-icon" aria-hidden="true">+</span>
                    </summary>
                    <p className="faq-item-answer">{item.answer}</p>
                  </details>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section content-sources" aria-label="Sources">
            <p className="content-section-label">Sources</p>
            <div className="content-sources-chips">
              {entry.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-chip"
                >
                  {source.label}
                  <span className="source-chip-icon" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className="content-section content-related" aria-label="Related reading">
            <p className="content-section-label">Related reading</p>

            {readNext && (
              <div className="content-read-next">
                <p className="content-read-next-label">Read next</p>
                <p className="content-read-next-title">
                  <a href={readNext.href}>{stripTypePrefix(readNext.label)}</a>
                </p>
                <a href={readNext.href} className="content-read-next-cta">
                  Continue reading →
                </a>
              </div>
            )}

            {otherLinks.length > 0 && (
              <div className="content-related-list">
                {otherLinks.map((link) => (
                  <a key={link.href} href={link.href} className="related-link">
                    <span>{link.label}</span>
                    <span className="related-link-arrow" aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            )}
          </section>

          <div className="content-bottom-cta">
            <h2>Stop losing AI answers</h2>
            <p>
              LLMnesia indexes your ChatGPT, Claude, and Gemini conversations automatically.
              Search everything from one place — no copy-paste, no repeat prompting.
            </p>
            <InstallLink className="button button-large" />
          </div>
        </article>
      </main>
    </SiteChrome>
  );
}
