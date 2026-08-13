import InstallLink from './install-link';
import { FOOTER_BADGES } from '../../lib/footer-badges';

// `minimalHeader` strips the header down to logo + a single install button, for
// dedicated landing pages (e.g. /claude-code) where external traffic arrives to
// act on one CTA and the full site nav is just a distraction. `headerCtaUtm`
// attributes clicks on that button to the page. The footer is left intact — a
// landing page still wants its footer links and copyright.
export default function SiteChrome({ children, minimalHeader = false, headerCtaUtm }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`site-header${minimalHeader ? ' site-header--minimal' : ''}`}>
        <div className="container header-inner">
          <a className="brand" href="/" aria-label="LLMnesia home">
            <img src="/logo.svg" alt="" width="28" height="28" />
            <span>LLMnesia</span>
          </a>

          {minimalHeader ? (
            <InstallLink className="nav-cta" utm={headerCtaUtm}>
              Add to Chrome
            </InstallLink>
          ) : (
            <>
              <button
                className="nav-toggle"
                id="nav-toggle"
                aria-expanded="false"
                aria-controls="primary-nav"
                type="button"
              >
                Menu
              </button>

              <nav className="nav" id="primary-nav" aria-label="Main">
                <a href="/vault">Vault</a>
                <a href="/blog">Blog</a>
                <a href="/compare">Compare</a>
                <a href="/use-cases">Use Cases</a>
                <a href="/changelog">Changelog</a>
                <a href="/about">About</a>
                <a href="/privacy-policy">Privacy</a>
                <InstallLink className="nav-cta">Add to Chrome</InstallLink>
              </nav>
            </>
          )}
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="container footer-inner">
          <nav aria-label="Footer">
            <a href="/vault">Vault</a>
            <a href="/claude-code">Claude Code</a>
            <a href="/about">About</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/blog">Blog</a>
            <a href="/compare">Compare</a>
            <a href="/use-cases">Use Cases</a>
            <a href="/changelog">Changelog</a>
            <InstallLink className="nav-cta">Add to Chrome</InstallLink>
          </nav>
          <div className="footer-badges">
            {FOOTER_BADGES.map((badge) => (
              <a
                key={badge.href}
                className={badge.className || 'footer-badge'}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                title={badge.title}
                aria-label={badge.label}
              >
                <img
                  alt={badge.alt}
                  src={badge.src}
                  width={badge.width}
                  height={badge.height}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
          <p>
            &copy; <span id="year"></span> LLMnesia
          </p>
        </div>
      </footer>
    </>
  );
}
