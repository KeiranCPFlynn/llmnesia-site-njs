import SiteChrome from './components/site-chrome';
import InstallLink from './components/install-link';
import NotFoundTracker from './components/not-found-tracker';

export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundTracker />

      <main id="main-content" className="section container content-main">
        <article className="content-article">
          <header className="content-header">
            <div className="content-type-badges">
              <span className="content-type-badge">404</span>
            </div>
            <h1>This page <span className="text-gradient">doesn&apos;t exist</span></h1>
            <p className="answer-first">
              The page you&apos;re looking for has moved or never existed. Nothing was
              lost on your end — let&apos;s get you back to something useful.
            </p>
          </header>

          <div className="content-body">
            <h2>Try one of these instead</h2>
            <ul>
              <li><a href="/blog">Browse the blog</a> — guides on AI chat history across every major platform.</li>
              <li><a href="/compare">Compare LLMnesia</a> — how it stacks up against other tools.</li>
              <li><a href="/use-cases">Use cases</a> — how people use LLMnesia day to day.</li>
              <li><a href="/">Back to the homepage</a></li>
            </ul>

            <p>
              If you reached this page from a link on our site,{' '}
              <a href="/#contact">let us know</a> so we can fix it.
            </p>
          </div>

          <div className="content-bottom-cta">
            <h2>Stop losing answers in AI chats</h2>
            <p>
              Installs in seconds. No account, no setup, no data leaving your browser.
            </p>
            <InstallLink className="button button-large" />
          </div>
        </article>
      </main>
    </SiteChrome>
  );
}
