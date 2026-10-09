import SiteChrome from './site-chrome';
import InstallLink from './install-link';
import JsonLd from './json-ld';
import { personSchema, organizationSchema } from '../../lib/schema';
import { absoluteUrl, CHROME_WEB_STORE_URL, EDGE_ADDONS_URL } from '../../lib/site';
import { platformListSentence } from '../../lib/platforms';
import { formatSiteText, siteHtml } from '../../lib/site-copy';
import { languageCampaign, localizedHref } from '../../lib/site-language';

export default function AboutPage({ language = 'en' }) {
  const t = (id, values) => formatSiteText(id, language, values);
  const html = (id, values) => siteHtml(id, language, values);
  const founder = personSchema({
    name: 'Keiran Flynn',
    url: absoluteUrl(localizedHref('/about', language)),
    description:
      t('about.copy001'),
    sameAs: [absoluteUrl('/'), CHROME_WEB_STORE_URL, EDGE_ADDONS_URL]
  });

  return (
    <SiteChrome language={language} pagePath="/about" >
      <JsonLd data={founder} />
      <JsonLd data={organizationSchema()} />

      <main lang={language} id="main-content" className="section container content-main">
        <nav className="content-breadcrumb" aria-label={t('about.copy002')} dangerouslySetInnerHTML={{ __html: html('about.copy003') }} ></nav>

        <article className="content-article">
          <header className="content-header">
            <div className="content-type-badges" dangerouslySetInnerHTML={{ __html: html('about.copy004') }} ></div>
            <h1 dangerouslySetInnerHTML={{ __html: html('about.copy005') }} ></h1>
            <p className="answer-first" dangerouslySetInnerHTML={{ __html: html('about.copy006') }} ></p>
          </header>

          <div className="content-body">
            <h2 dangerouslySetInnerHTML={{ __html: html('about.copy007') }} ></h2>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy008') }} ></p>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy009') }} ></p>

            <h2 dangerouslySetInnerHTML={{ __html: html('about.copy010') }} ></h2>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy011', { VALUE_A: platformListSentence() }) }} ></p>

            <h2 dangerouslySetInnerHTML={{ __html: html('about.copy012') }} ></h2>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy013') }} ></p>

            <h2 dangerouslySetInnerHTML={{ __html: html('about.copy014') }} ></h2>
            <blockquote>
              <p dangerouslySetInnerHTML={{ __html: html('about.copy015') }} ></p>
              <footer dangerouslySetInnerHTML={{ __html: html('about.copy016') }} ></footer>
            </blockquote>

            <h2 dangerouslySetInnerHTML={{ __html: html('about.copy017') }} ></h2>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy018') }} ></p>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy019') }} ></p>

            <h2 dangerouslySetInnerHTML={{ __html: html('about.copy020') }} ></h2>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy021') }} ></p>
          </div>

          <div className="content-bottom-cta">
            <h2 dangerouslySetInnerHTML={{ __html: html('about.copy022') }} ></h2>
            <p dangerouslySetInnerHTML={{ __html: html('about.copy023') }} ></p>
            <InstallLink className="button button-large"  children={t('chrome.installFree')} utm={languageCampaign(language)} />
          </div>
        </article>
      </main>
    </SiteChrome>
  );

}
