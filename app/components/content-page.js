import InstallLink from './install-link';
import SiteChrome from './site-chrome';
import JsonLd from './json-ld';

const TYPE_LABELS = {
  blog: 'Blog',
  compare: 'Compare',
  'use-cases': 'Use Case'
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

export default function ContentPage({ entry, body, breadcrumb, schemas, relatedLinks }) {
  const typeLabel = TYPE_LABELS[entry.type] || entry.type;
  const mins = readingTime(entry.content);

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
              <span className={`intent-badge intent-badge-${entry.intent}`}>
                {entry.intent}
              </span>
            </div>

            <h1>{entry.title}</h1>

            <p className="answer-first">{entry.description}</p>

            <div className="content-meta">
              <span>{formatDate(entry.publishDate)}</span>
              <span className="content-meta-sep" aria-hidden="true">·</span>
              <span>{mins} min read</span>
              <span className="content-meta-sep" aria-hidden="true">·</span>
              <span>{entry.author}</span>
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
            <div className="content-related-list">
              {relatedLinks.map((link) => (
                <a key={link.href} href={link.href} className="related-link">
                  <span>{link.label}</span>
                  <span className="related-link-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
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
