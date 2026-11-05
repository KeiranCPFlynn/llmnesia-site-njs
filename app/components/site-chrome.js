import InstallLink from './install-link';
import { FOOTER_BADGES } from '../../lib/footer-badges';
import { languagePickerHtml, localizedHref, languageCampaign, LOCALIZED_CORE_PAGES } from '../../lib/site-language';

import { siteText } from '../../lib/site-copy';

// `minimalHeader` strips the header down to logo + a single install button, for
// dedicated landing pages (e.g. /claude-code) where external traffic arrives to
// act on one CTA and the full site nav is just a distraction. `headerCtaUtm`
// attributes clicks on that button to the page. The footer is left intact — a
// landing page still wants its footer links and copyright. The Pro bar above
// the header (on every page except /pro itself) links to /pro, and its
// button to the waitlist on that page.
export default function SiteChrome({ children, minimalHeader = false, headerCtaUtm, language = 'en', pagePath = '/', hideProBar = false }) {
  const t = (id) => siteText(`chrome.${id}`, language);
  const href = (path) => localizedHref(path, language);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('skip')}
      </a>

      {pagePath !== '/pro' && !hideProBar && (
        <div className="pro-bar">
          <div className="container pro-bar-inner">
            <a className="pro-bar-link" href="/pro" data-analytics="pro_bar_click" data-analytics-slug={pagePath}>
              <span className="pro-bar-tag">{t('proBarTag')}</span>{' '}
              <strong>LLMnesia Pro</strong>{' '}
              <span className="pro-bar-text">{t('proBarText')}</span>
            </a>{' '}
            <a className="pro-bar-cta" href="/pro#waitlist" data-analytics="pro_bar_waitlist_click" data-analytics-slug={pagePath}>
              {t('proBarCta')} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      )}

      <header className={`site-header${minimalHeader ? ' site-header--minimal' : ' site-header--language'}`}>
        <div className="container header-inner">
          <a className="brand" href={href('/')} aria-label={t('home')}>
            <svg viewBox="0 0 128 128" width="28" height="28" aria-hidden="true" focusable="false"><defs><linearGradient id="llm-logo-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3193ad"/><stop offset="100%" stopColor="#23687d"/></linearGradient><radialGradient id="llm-logo-lens" cx="0.4" cy="0.35" r="0.65"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.25"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0.05"/></radialGradient><linearGradient id="llm-logo-spark" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c5d97f"/><stop offset="100%" stopColor="#9ab458"/></linearGradient></defs><rect x="4" y="4" width="120" height="120" rx="26" ry="26" fill="url(#llm-logo-bg)"/><circle cx="50" cy="48" r="27" fill="url(#llm-logo-lens)" stroke="#f0f6fa" strokeWidth="7"/><path d="M34 38 A22 22 0 0 1 54 30" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.45"/><line x1="70" y1="68" x2="100" y2="98" stroke="#f0f6fa" strokeWidth="10" strokeLinecap="round"/><line x1="72" y1="66" x2="96" y2="90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.2"/><path d="M50 32 L53 44 L65 47 L53 50 L50 62 L47 50 L35 47 L47 44 Z" fill="url(#llm-logo-spark)"/></svg>
            <span>LLMnesia</span>
          </a>

          {minimalHeader ? (
            <InstallLink className="nav-cta" utm={language === 'en' ? headerCtaUtm : { ...headerCtaUtm, ...languageCampaign(language) }}>
              {t('install')}
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
                {t('menu')}
              </button>

              <nav className="nav" id="primary-nav" aria-label={t('main')}>
                <a href={href('/vault')}>{t('vault')}</a>
                <a href={href('/pro')}>Pro</a>
                <a href={href('/pricing')}>{t('pricing')}</a>
                <a href={href('/mcp')}>{t('mcp')}</a>
                <a href={href('/use-cases')}>{t('useCases')}</a>
                <a href={href('/blog')}>{t('blog')}</a>
                <a href={href('/compare')}>{t('compare')}</a>
                <InstallLink className="nav-cta" utm={languageCampaign(language)}>{t('install')}</InstallLink>
              </nav>
              {/* Only translated pages get a language picker; on an English-only
                  page every option would lead back to the same page. */}
              {LOCALIZED_CORE_PAGES.includes(pagePath.slice(1)) && <div dangerouslySetInnerHTML={{ __html: languagePickerHtml(language, pagePath) }} />}
            </>
          )}
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="container footer-inner">
          <nav aria-label={t('footer')}>
            <a href={href('/vault')}>{t('vault')}</a>
            <a href={href('/pro')}>Pro</a>
            <a href={href('/pricing')}>{t('pricing')}</a>
            <a href={href('/mcp')}>{t('mcp')}</a>
            <a href={href('/claude-code')}>Claude Code</a>
            <a href={href('/zcode')}>ZCode</a>
            <a href={href('/about')}>{t('about')}</a>
            <a href={href('/privacy-policy')}>{t('privacy')}</a>
            <a href={href('/blog')}>{t('blog')}</a>
            <a href={href('/compare')}>{t('compare')}</a>
            <a href={href('/use-cases')}>{t('useCases')}</a>
            <a href={href('/changelog')}>{t('changelog')}</a>
            <InstallLink className="nav-cta" utm={languageCampaign(language)}>{t('install')}</InstallLink>
          </nav>
          {language !== 'en' && <p className="site-language-note">{t('interfaceNotice')}</p>}
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
