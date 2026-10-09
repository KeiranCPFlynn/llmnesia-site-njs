import InstallLink from './install-link';
import { FOOTER_BADGES } from '../../lib/footer-badges';
import { languagePickerHtml, localizedHref, languageCampaign } from '../../lib/site-language';

import { siteText } from '../../lib/site-copy';

// `minimalHeader` strips the header down to logo + a single install button, for
// dedicated landing pages (e.g. /claude-code) where external traffic arrives to
// act on one CTA and the full site nav is just a distraction. `headerCtaUtm`
// attributes clicks on that button to the page. The footer is left intact — a
// landing page still wants its footer links and copyright.
export default function SiteChrome({ children, minimalHeader = false, headerCtaUtm, language = 'en', pagePath = '/' }) {
  const t = (id) => siteText(`chrome.${id}`, language);
  const href = (path) => localizedHref(path, language);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('skip')}
      </a>

      <header className={`site-header${minimalHeader ? ' site-header--minimal' : ' site-header--language'}`}>
        <div className="container header-inner">
          <a className="brand" href={href('/')} aria-label={t('home')}>
            <img src="/logo.svg" alt="" width="28" height="28" />
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
                <a href={href('/pricing')}>{t('pricing')}</a>
                <a href={href('/mcp')}>{t('mcp')}</a>
                <a href={href('/use-cases')}>{t('useCases')}</a>
                <a href={href('/blog')}>{t('blog')}</a>
                <a href={href('/compare')}>{t('compare')}</a>
                <InstallLink className="nav-cta" utm={languageCampaign(language)}>{t('install')}</InstallLink>
              </nav>
              <div dangerouslySetInnerHTML={{ __html: languagePickerHtml(language, pagePath) }} />
            </>
          )}
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="container footer-inner">
          <nav aria-label={t('footer')}>
            <a href={href('/vault')}>{t('vault')}</a>
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
