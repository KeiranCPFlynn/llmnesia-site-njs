import LocalizedChrome from './localized-chrome';
import { SITE_LANGUAGES, languageCampaign } from '../../lib/site-language';
import { siteText } from '../../lib/site-copy';
import { buildPageMetadata } from '../../lib/metadata';
import { CHROME_WEB_STORE_URL, EDGE_ADDONS_URL } from '../../lib/site';
import { IMPORT_PLATFORMS } from '../../lib/platforms';

export function installationMetadata(language) {
  const config = SITE_LANGUAGES.find(item => item.code === language);
  const base = buildPageMetadata({ title: siteText('guide.metaTitle', language), description: siteText('guide.metaDescription', language), canonicalPath: config.guidePath });
  return { ...base, openGraph: { ...base.openGraph, locale: config.locale } };
}

function storeUrl(url, store, language) {
  const target = new URL(url);
  for (const [key, value] of Object.entries({ ...languageCampaign(language), utm_content: `guide_${store}` })) target.searchParams.set(key, value);
  return target.toString();
}

export default function LocalizedInstallation({ language }) {
  const config = SITE_LANGUAGES.find(item => item.code === language);
  const t = id => siteText(id, language);
  return (
    <LocalizedChrome language={language}>
      <main id="main-content" lang={language} className="german-guide">
        <section className="section">
          <div className="container german-reading-width">
            <p className="eyebrow">{t('guide.eyebrow')}</p>
            <h1>{t('guide.title')}</h1><p className="subheadline">{t('guide.intro')}</p>
            <article className="german-guide-step">
              <h2>{t('guide.installTitle')}</h2><p>{t('guide.installBody')}</p>
              <div className="german-store-links">
                <a className="button" href={storeUrl(CHROME_WEB_STORE_URL, 'chrome', language)} target="_blank" rel="noopener noreferrer" data-fixed-install-store="chrome" data-install-position="guide_chrome">{t('guide.chrome')}</a>
                <a className="button button-ghost" href={storeUrl(EDGE_ADDONS_URL, 'edge', language)} target="_blank" rel="noopener noreferrer" data-fixed-install-store="edge" data-install-position="guide_edge">{t('guide.edge')}</a>
              </div>
            </article>
            <article className="german-guide-step">
              <h2>{t('guide.importTitle')}</h2><p>{t('guide.importBody')}</p>
              <p>{t('guide.importPlatforms')}</p><ul className="german-platform-list">{IMPORT_PLATFORMS.map((platform) => <li key={platform}>{platform}</li>)}</ul>
              <p className="german-language-note">{t('guide.importCaution')}</p>
            </article>
            <article className="german-guide-step">
              <h2>{t('guide.searchTitle')}</h2><p>{t('guide.searchBody')}</p>
              <p>{t('guide.searchExample')}</p><p>{t('guide.shortcutNote')}</p>
            </article>
            <article className="german-guide-step">
              <h2>{t('guide.troubleshootTitle')}</h2><p>{t('guide.troubleshootBody')}</p>
            </article>
            <article className="german-guide-step">
              <h2>{t('guide.privacyTitle')}</h2><p>{t('guide.privacyBody')}</p>
              <a href="/privacy-policy" hrefLang="en">{t('footer.policy')}</a>
            </article>
            <article className="german-guide-step">
              <h2>{t('guide.nextTitle')}</h2><p>{t('guide.nextBody')}</p>
              <a className="button button-ghost" href={config.path}>{t('guide.back')}</a>
            </article>
          </div>
        </section>
      </main>
    </LocalizedChrome>
  );
}
