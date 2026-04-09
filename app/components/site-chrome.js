import InstallLink from './install-link';

export default function SiteChrome({ children }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="/" aria-label="LLMnesia home">
            <img src="/assets/logo.svg" alt="" width="28" height="28" />
            <span>LLMnesia</span>
          </a>

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
            <a href="/blog">Blog</a>
            <a href="/compare">Compare</a>
            <a href="/use-cases">Use Cases</a>
            <a href="/privacy-policy">Privacy</a>
            <InstallLink className="nav-cta">Add to Chrome</InstallLink>
          </nav>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="container footer-inner">
          <nav aria-label="Footer">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/blog">Blog</a>
            <a href="/compare">Compare</a>
            <a href="/use-cases">Use Cases</a>
            <InstallLink className="nav-cta">Add to Chrome</InstallLink>
          </nav>
          <p>
            &copy; <span id="year"></span> LLMnesia
          </p>
        </div>
      </footer>
    </>
  );
}
