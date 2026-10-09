import SiteChrome from './site-chrome';
import InstallLink from './install-link';
import JsonLd from './json-ld';
import { softwareApplicationSchema, homepageFaqSchema } from '../../lib/schema';
import { formatSiteText, siteHtml } from '../../lib/site-copy';
import { languageCampaign } from '../../lib/site-language';

export default function McpPage({ language = 'en' }) {
  const t = (id, values) => formatSiteText(id, language, values);
  const html = (id, values) => siteHtml(id, language, values);
  const CTA_UTM = {
    utm_source: 'mcp_page',
    utm_medium: 'cta',
    utm_campaign: 'mcp_product'
  };
  const SETUP = [
    {
      kicker: t('mcp.copy004'),
      title: t('mcp.copy005'),
      body: t('mcp.copy006'),
      note: t('mcp.copy007')
    },
    {
      kicker: t('mcp.copy008'),
      title: t('mcp.copy009'),
      body: t('mcp.copy010'),
      note: t('mcp.copy011')
    },
    {
      kicker: t('mcp.copy012'),
      title: t('mcp.copy013'),
      body: t('mcp.copy014'),
      note: t('mcp.copy015')
    }
  ];
  const USE_CASES = [
    {
      name: t('mcp.copy016'),
      oneLine: t('mcp.copy017'),
      body: t('mcp.copy018')
    },
    {
      name: t('mcp.copy019'),
      oneLine: t('mcp.copy020'),
      body: t('mcp.copy021')
    },
    {
      name: t('mcp.copy022'),
      oneLine: t('mcp.copy023'),
      body: t('mcp.copy024')
    },
    {
      name: t('mcp.copy025'),
      oneLine: t('mcp.copy026'),
      body: t('mcp.copy027')
    }
  ];
  const CLIENTS = [
    {
      name: 'Claude Code',
      how: t('mcp.copy028')
    },
    {
      name: 'Claude Desktop',
      how: t('mcp.copy029')
    },
    {
      name: 'Cursor',
      how: t('mcp.copy030')
    },
    {
      name: 'Codex',
      how: t('mcp.copy031')
    },
    {
      name: 'ZCode',
      how: t('mcp.copy032')
    },
    {
      name: t('mcp.copy033'),
      how: t('mcp.copy034')
    }
  ];
  const FAQS = [
    {
      q: t('mcp.copy035'),
      a: t('mcp.copy036')
    },
    {
      q: t('mcp.copy037'),
      a: t('mcp.copy038')
    },
    {
      q: t('mcp.copy039'),
      a: t('mcp.copy040')
    },
    {
      q: t('mcp.copy041'),
      a: t('mcp.copy042')
    },
    {
      q: t('mcp.copy043'),
      a: t('mcp.copy044')
    }
  ];

  return (
    <SiteChrome headerCtaUtm={{ ...CTA_UTM, utm_medium: 'header_cta' }} language={language} pagePath="/mcp" >
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd
        data={homepageFaqSchema(
          FAQS.map((item) => ({ question: item.q, answer: item.a }))
        )}
      />
      <main lang={language} id="main-content" className="mcp-page">
        {/* Hero — lead into the guided flow; the command alone is not setup. */}
        <section className="section mcp-hero">
          <div className="container mcp-hero-inner">
            <p className="eyebrow" dangerouslySetInnerHTML={{ __html: html('mcp.copy045') }} ></p>
            <h1 dangerouslySetInnerHTML={{ __html: html('mcp.copy046') }} ></h1>
            <p className="subheadline mcp-hero-sub" dangerouslySetInnerHTML={{ __html: html('mcp.copy047') }} ></p>

            <div className="mcp-hero-actions">
              <InstallLink className="button button-large" utm={language === 'en' ? CTA_UTM : { ...CTA_UTM, ...languageCampaign(language) }}>{t('mcp.copy048')}</InstallLink>
              <a className="mcp-hero-secondary" href="#guided-setup" dangerouslySetInnerHTML={{ __html: html('mcp.copy049') }} ></a>
            </div>
            <p className="mcp-hero-note" dangerouslySetInnerHTML={{ __html: html('mcp.copy050') }} ></p>
          </div>
        </section>

        {/* Setup — the three steps, extension → command → search */}
        <section className="section mcp-setup" id="guided-setup">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('mcp.copy051') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('mcp.copy052') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('mcp.copy053') }} ></p>
            </div>
            <div className="card-grid mcp-setup-grid">
              {SETUP.map((step) => (
                <article className="card mcp-setup-card" key={step.title}>
                  <p className="mcp-setup-kicker">{step.kicker}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <p className="mcp-setup-note">{step.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases — lead with what a person can accomplish, not protocol internals. */}
        <section className="section mcp-tools">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('mcp.copy054') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('mcp.copy055') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('mcp.copy056') }} ></p>
            </div>
            <div className="mcp-tools-list">
              {USE_CASES.map((useCase) => (
                <article className="mcp-tool" key={useCase.name}>
                  <div className="mcp-tool-head">
                    <strong className="mcp-tool-name">{useCase.name}</strong>
                    <p className="mcp-tool-oneline">{useCase.oneLine}</p>
                  </div>
                  <p className="mcp-tool-body">{useCase.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Clients — the detection matrix */}
        <section className="section mcp-clients">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('mcp.copy057') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('mcp.copy058') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('mcp.copy059') }} ></p>
            </div>
            <div className="card-grid mcp-clients-grid">
              {CLIENTS.map((client) => (
                <article className="card mcp-client-card" key={client.name}>
                  <h3>{client.name}</h3>
                  <p>{client.how}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Answer mockup — show the user-facing result, including linked sources. */}
        <section className="section mcp-result">
          <div className="container mcp-result-inner">
            <div className="mcp-result-copy mcp-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('mcp.copy060') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('mcp.copy061') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('mcp.copy062') }} ></p>
            </div>

            <div className="mcp-mock" aria-label={t('mcp.copy063')}>
              <div className="mcp-mock-head" dangerouslySetInnerHTML={{ __html: html('mcp.copy064') }} ></div>
              <div className="mcp-mock-body">
                <div className="mcp-mock-query" dangerouslySetInnerHTML={{ __html: html('mcp.copy065') }} ></div>
                <article className="mcp-mock-hit">
                  <div className="mcp-mock-hit-top">
                    <h3 dangerouslySetInnerHTML={{ __html: html('mcp.copy066') }} ></h3>
                    <span className="mcp-mock-tag" dangerouslySetInnerHTML={{ __html: html('mcp.copy067') }} ></span>
                  </div>
                  <p className="mcp-mock-snippet" dangerouslySetInnerHTML={{ __html: html('mcp.copy068') }} ></p>
                  <div className="mcp-mock-meta" dangerouslySetInnerHTML={{ __html: html('mcp.copy069') }} ></div>
                </article>
                <article className="mcp-mock-hit mcp-mock-hit-dim">
                  <div className="mcp-mock-hit-top">
                    <h3 dangerouslySetInnerHTML={{ __html: html('mcp.copy070') }} ></h3>
                    <span className="mcp-mock-tag">ChatGPT</span>
                  </div>
                  <p className="mcp-mock-snippet" dangerouslySetInnerHTML={{ __html: html('mcp.copy071') }} ></p>
                  <div className="mcp-mock-hit-top" style={{ marginTop: '0.8rem' }}>
                    <h3 dangerouslySetInnerHTML={{ __html: html('mcp.copy072') }} ></h3>
                    <span className="mcp-mock-tag">Claude</span>
                  </div>
                  <p className="mcp-mock-snippet" dangerouslySetInnerHTML={{ __html: html('mcp.copy073') }} ></p>
                </article>
                <div className="mcp-mock-footer" dangerouslySetInnerHTML={{ __html: html('mcp.copy074') }} ></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — the five questions people actually ask */}
        <section className="section mcp-faq">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('mcp.copy075') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('mcp.copy076') }} ></h2>
            </div>
            <div className="faq-list mcp-faq-list">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section mcp-closing">
          <div className="container mcp-closing-inner">
            <div className="mcp-closing-copy">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('mcp.copy077') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('mcp.copy078') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('mcp.copy079') }} ></p>
            </div>
            <div className="mcp-hero-actions">
              <InstallLink
                className="button button-large"
                utm={{ ...CTA_UTM, utm_medium: 'cta_closing' }}
              >{t('mcp.copy080')}</InstallLink>
              <a
                className="mcp-hero-secondary"
                href="https://www.npmjs.com/package/@llmnesia/mcp"
               dangerouslySetInnerHTML={{ __html: html('mcp.copy081') }} ></a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );

}
