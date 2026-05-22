import InstallLink from './install-link';
import SiteChrome from './site-chrome';
import JsonLd from './json-ld';

const CATEGORY_LABELS = {
  'platform-guides': 'Platform Guides',
  'persona-guides': 'Persona Guides',
  comparisons: 'Comparisons',
  workflows: 'Workflows',
  foundational: 'Foundational',
  'problem-solving': 'Problem Solving',
  'use-cases': 'Use Cases',
  'how-to': 'How-To',
  explainer: 'Explainers'
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

export default function BlogPost({ entry, body, breadcrumb, schemas, relatedLinks }) {
  const eyebrow = entry.category ? (CATEGORY_LABELS[entry.category] || entry.category) : 'Field notes';
  const mins = entry.readTime || readingTime(entry.content);

  const readNext = relatedLinks[0] || null;
  const otherLinks = relatedLinks.slice(1);

  return (
    <SiteChrome>
      {schemas.map((schema, index) => (
        <JsonLd key={`${entry.slug}-schema-${index}`} data={schema} />
      ))}

      <article id="main-content" className="post">
        <nav className="post__crumb" aria-label="Breadcrumb">
          {breadcrumb.map((item, index) => (
            <span key={item.path}>
              {index > 0 && <span aria-hidden="true"> / </span>}
              <a href={item.path}>{item.name}</a>
            </span>
          ))}
        </nav>

        <header className="post__head">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            {eyebrow}
          </p>
          <h1>{entry.title}</h1>
          {(entry.dek || entry.description) && (
            <p className="post__lede">{entry.dek || entry.description}</p>
          )}
          <div className="post__meta">
            <time dateTime={entry.publishDate}>{formatDate(entry.publishDate)}</time>
            <span aria-hidden="true">·</span>
            <span>{mins} min read</span>
            {entry.author && (
              <>
                <span aria-hidden="true">·</span>
                <span>{entry.author}</span>
              </>
            )}
          </div>
        </header>

        <div className="prose">{body}</div>

        {entry.faq && entry.faq.length > 0 && (
          <section className="post__section" aria-label="FAQ">
            <h2 className="post__section-label">Frequently asked</h2>
            <div className="post__faq-list">
              {entry.faq.map((item) => (
                <details className="post__faq-item" key={item.question}>
                  <summary>
                    <span>{item.question}</span>
                    <span className="post__faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {entry.sources && entry.sources.length > 0 && (
          <section className="post__section" aria-label="Sources">
            <h2 className="post__section-label">Sources</h2>
            <div className="post__sources">
              {entry.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post__source-chip"
                >
                  {source.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {(readNext || otherLinks.length > 0) && (
          <section className="post__section" aria-label="Related reading">
            <h2 className="post__section-label">Related reading</h2>

            {readNext && (
              <div className="post__read-next">
                <p className="post__read-next-label">Read next</p>
                <p className="post__read-next-title">
                  <a href={readNext.href}>{stripTypePrefix(readNext.label)}</a>
                </p>
              </div>
            )}

            {otherLinks.length > 0 && (
              <ul className="post__related">
                {otherLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>
                      <span>{link.label}</span>
                      <span aria-hidden="true"> →</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <div className="post__cta">
          <h2>Stop losing AI answers</h2>
          <p>
            LLMnesia indexes your ChatGPT, Claude, and Gemini conversations automatically.
            Search everything from one place — no copy-paste, no repeat prompting.
          </p>
          <InstallLink className="button button-large" />
        </div>

        <footer className="post__foot">
          <a href="/blog">← All field notes</a>
        </footer>
      </article>
    </SiteChrome>
  );
}
