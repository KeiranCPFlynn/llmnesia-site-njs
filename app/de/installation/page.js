import GermanChrome, { GERMAN_CTA_UTM } from '../../components/german-chrome';
import { german as t } from '../../../lib/german-copy';
import { buildPageMetadata } from '../../../lib/metadata';
import { CHROME_WEB_STORE_URL, EDGE_ADDONS_URL } from '../../../lib/site';
import { IMPORT_PLATFORMS } from '../../../lib/platforms';

export const metadata = buildPageMetadata({ title: t('guide.metaTitle'), description: t('guide.metaDescription'), canonicalPath: '/de/installation' });

function storeUrl(url, store) {
  const target = new URL(url);
  for (const [key, value] of Object.entries({ ...GERMAN_CTA_UTM, utm_content: `guide_${store}` })) target.searchParams.set(key, value);
  return target.toString();
}

export default function GermanInstallationPage() {
  return (
    <GermanChrome guide>
      <main id="main-content" lang="de" className="german-guide">
        <section className="section">
          <div className="container german-reading-width">
            <p className="eyebrow">{t('guide.eyebrow')}</p>
            <h1>{t('guide.title')}</h1><p className="subheadline">{t('guide.intro')}</p>
            <article className="german-guide-step">
              <h2>{t('guide.installTitle')}</h2><p>{t('guide.installBody')}</p>
              <div className="german-store-links">
                <a className="button" href={storeUrl(CHROME_WEB_STORE_URL, 'chrome')} target="_blank" rel="noopener noreferrer" data-fixed-install-store="chrome" data-install-position="guide_chrome">{t('guide.chrome')}</a>
                <a className="button button-ghost" href={storeUrl(EDGE_ADDONS_URL, 'edge')} target="_blank" rel="noopener noreferrer" data-fixed-install-store="edge" data-install-position="guide_edge">{t('guide.edge')}</a>
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
              <a className="button button-ghost" href="/de">{t('guide.back')}</a>
            </article>
          </div>
        </section>
      </main>
    </GermanChrome>
  );
}
