import InstallLink from './install-link';
import { german as t } from '../../lib/german-copy';

export const GERMAN_CTA_UTM = {
  utm_source: 'german_page', utm_medium: 'cta', utm_campaign: 'german_pilot'
};

export default function GermanChrome({ children, guide = false }) {
  return (
    <div lang="de" className="german-page">
      <a className="skip-link" href="#main-content">{t('nav.skip')}</a>
      <header className="site-header site-header--language">
        <div className="container header-inner">
          <a className="brand" href="/de" aria-label={t('nav.home')}>
            <img src="/logo.svg" alt="" width="28" height="28" />
            <span>LLMnesia</span>
          </a>
          <button className="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav" type="button">
            {t('nav.label')}
          </button>
          <nav className="nav" id="primary-nav" aria-label={t('nav.label')}>
            <a href="/de#features">{t('nav.features')}</a>
            <a href="/de/installation" aria-current={guide ? 'page' : undefined}>{t('nav.setup')}</a>
            <a href="/de#privacy">{t('nav.privacy')}</a>
            <span className="language-switch" aria-label={t('nav.language')}>
              <a href="/" lang="en" hrefLang="en" data-site-language="en">EN</a>
              <a href="/de" lang="de" hrefLang="de" data-site-language="de" aria-current={!guide ? 'page' : undefined}>Deutsch</a>
            </span>
            <InstallLink className="nav-cta" utm={{ ...GERMAN_CTA_UTM, utm_content: guide ? 'guide_header' : 'header' }}>{t('nav.install')}</InstallLink>
          </nav>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="container footer-inner">
          <nav aria-label={t('nav.label')}>
            <a href="/de/installation">{t('nav.setup')}</a>
            <a href="/privacy-policy" hrefLang="en">{t('footer.policy')}</a>
            <a href="/vault" hrefLang="en">{t('footer.vault')}</a>
            <a href="/" lang="en" hrefLang="en" data-site-language="en">{t('footer.english')}</a>
          </nav>
          <p>&copy; {new Date().getFullYear()} LLMnesia</p>
        </div>
      </footer>
    </div>
  );
}
