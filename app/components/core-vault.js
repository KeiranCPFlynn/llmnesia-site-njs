import SiteChrome from './site-chrome';
import VaultPageView from './vault-page-view';
import VaultPurchase from './vault-purchase';
import JsonLd from './json-ld';
import { homepageFaqSchema } from '../../lib/schema';
import { platformListSentence } from '../../lib/platforms';
import { formatSiteText, siteHtml, clientCopy } from '../../lib/site-copy';
import { localizedHref } from '../../lib/site-language';

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true';
const MONTHLY_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_MONTHLY_PRICE_LABEL || '£8';
const ANNUAL_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL || '£88';
const ANNUAL_MONTHLY_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL || '£7.33';

export default function VaultPage({ language = 'en' }) {
  const t = (id, values) => formatSiteText(id, language, values);
  const html = (id, values) => siteHtml(id, language, values);
  const UNLOCKS = [
    {
      kicker: t('vault.copy001'),
      title: t('vault.copy002'),
      body: t('vault.copy003')
    },
    {
      kicker: t('vault.copy004'),
      title: t('vault.copy005'),
      body: t('vault.copy006')
    },
    {
      kicker: t('vault.copy007'),
      title: t('vault.copy008'),
      body: t('vault.copy009')
    }
  ];
  const USE_CASES = [
    {
      kicker: t('vault.copy010'),
      body: t('vault.copy011')
    },
    {
      kicker: t('vault.copy012'),
      body: t('vault.copy013')
    },
    {
      kicker: t('vault.copy014'),
      body: t('vault.copy015')
    }
  ];
  const FAQS = [
    {
      q: t('vault.copy016'),
      a: t('vault.copy017')
    },
    {
      q: t('vault.copy018'),
      a: t('vault.copy019')
    },
    {
      q: t('vault.copy020'),
      a: t('vault.copy021')
    },
    {
      q: t('vault.copy022'),
      a: t('vault.copy023', { VALUE_A: platformListSentence() })
    },
    {
      q: t('vault.copy024'),
      a: t('vault.copy025')
    },
    {
      q: t('vault.copy026'),
      a: t('vault.copy027')
    },
    {
      q: t('vault.copy028'),
      a: t('vault.copy029')
    }
  ];

  return (
    <SiteChrome language={language} pagePath="/vault" >
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <VaultPageView />
      <main lang={language} id="main-content" className="vault-page">
        <section className="section vault-hero">
          <div className="container vault-hero-inner">
            <p className="eyebrow" dangerouslySetInnerHTML={{ __html: html('vault.copy030') }} ></p>
            <h1 dangerouslySetInnerHTML={{ __html: html('vault.copy031') }} ></h1>
            <p className="subheadline vault-hero-sub" dangerouslySetInnerHTML={{ __html: html('vault.copy032') }} ></p>
            <div className="vault-hero-actions" dangerouslySetInnerHTML={{ __html: html('vault.copy033') }} ></div>
            <p className="vault-hero-note" dangerouslySetInnerHTML={{ __html: html('vault.copy034', { VALUE_A: ANNUAL_PRICE_LABEL, VALUE_B: MONTHLY_PRICE_LABEL }) }} ></p>
          </div>
        </section>

        <section className="section vault-spotlight">
          <div className="container vault-spotlight-inner">
            <div className="vault-spotlight-copy">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('vault.copy035') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('vault.copy036') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('vault.copy037') }} ></p>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('vault.copy038') }} ></p>
              <div className="vault-ask-callout">
                <p className="vault-ask-kicker" dangerouslySetInnerHTML={{ __html: html('vault.copy039') }} ></p>
                <h3>Ask Vault</h3>
                <p dangerouslySetInnerHTML={{ __html: html('vault.copy040') }} ></p>
              </div>
            </div>
            <figure className="vault-mock" aria-label={t('vault.copy041')}>
              <div className="vault-pwa-head" dangerouslySetInnerHTML={{ __html: html('vault.copy042') }} ></div>
              <div className="vault-pwa-tabs" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html('vault.copy043') }} ></div>
              <div className="vault-mock-body">
                <div className="vault-pwa-intro">
                  <h3 dangerouslySetInnerHTML={{ __html: html('vault.copy044') }} ></h3>
                  <p dangerouslySetInnerHTML={{ __html: html('vault.copy045') }} ></p>
                </div>
                <div className="vault-pwa-search" dangerouslySetInnerHTML={{ __html: html('vault.copy046') }} ></div>
                <div className="vault-pwa-results">
                  <div><span>Claude</span><p dangerouslySetInnerHTML={{ __html: html('vault.copy047') }} ></p><small dangerouslySetInnerHTML={{ __html: html('vault.copy048') }} ></small></div>
                  <div><span>ChatGPT</span><p dangerouslySetInnerHTML={{ __html: html('vault.copy049') }} ></p><small dangerouslySetInnerHTML={{ __html: html('vault.copy050') }} ></small></div>
                </div>
                <figcaption className="vault-mock-caption" dangerouslySetInnerHTML={{ __html: html('vault.copy051') }} ></figcaption>
              </div>
            </figure>
          </div>
        </section>

        <section className="section vault-benefits" id="what-vault-unlocks">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('vault.copy052') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('vault.copy053') }} ></h2>
            </div>
            <div className="card-grid vault-benefit-grid">
              {UNLOCKS.map((item) => (
                <article className="card vault-benefit-card" key={item.title}>
                  <p className="vault-benefit-kicker">{item.kicker}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section vault-usecases">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('vault.copy054') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('vault.copy055') }} ></h2>
            </div>
            <div className="vault-usecase-list">
              {USE_CASES.map((item, index) => (
                <div className="vault-usecase" key={item.kicker}>
                  <span className="vault-usecase-num">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{item.kicker}</h3><p>{item.body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section vault-pricing">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('vault.copy056') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('vault.copy057') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('vault.copy058', { VALUE_A: ANNUAL_PRICE_LABEL, VALUE_B: ANNUAL_MONTHLY_LABEL, VALUE_C: MONTHLY_PRICE_LABEL }) }} ></p>
              <ul className="vault-pricing-points">
                <li dangerouslySetInnerHTML={{ __html: html('vault.copy059') }} ></li>
                <li dangerouslySetInnerHTML={{ __html: html('vault.copy060') }} ></li>
                <li dangerouslySetInnerHTML={{ __html: html('vault.copy061') }} ></li>
                <li dangerouslySetInnerHTML={{ __html: html('vault.copy062') }} ></li>
                <li dangerouslySetInnerHTML={{ __html: html('vault.copy063') }} ></li>
              </ul>
            </div>
            <aside className="vault-price-card" id="vault-pricing" aria-label={t('vault.copy064')}>
              <p className="vault-price-badge">Vault</p>
              <p className="vault-price-figure" dangerouslySetInnerHTML={{ __html: html('vault.copy065', { VALUE_A: ANNUAL_MONTHLY_LABEL }) }} ></p>
              <p className="vault-price-sub" dangerouslySetInnerHTML={{ __html: html('vault.copy066', { VALUE_A: ANNUAL_PRICE_LABEL, VALUE_B: MONTHLY_PRICE_LABEL }) }} ></p>
              {CHECKOUT_ENABLED ? (
                <VaultPurchase
                  monthlyLabel={MONTHLY_PRICE_LABEL}
                  annualLabel={ANNUAL_PRICE_LABEL}
                  annualMonthlyLabel={ANNUAL_MONTHLY_LABEL}
                 copy={clientCopy('purchase', language)} contactHref={localizedHref('/#contact', language)} />
              ) : (
                <div id="vault-purchase" className="vault-purchase-fallback" dangerouslySetInnerHTML={{ __html: html('vault.copy067') }} ></div>
              )}
            </aside>
          </div>
        </section>

        <section className="section vault-faq">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('vault.copy068') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('vault.copy069') }} ></h2>
            </div>
            <div className="faq-list vault-faq-list">
              {FAQS.map((item) => (
                <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="section vault-closing">
          <div className="container vault-closing-inner">
            <h2 dangerouslySetInnerHTML={{ __html: html('vault.copy070') }} ></h2>
            <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('vault.copy071') }} ></p>
            <div className="vault-hero-actions" dangerouslySetInnerHTML={{ __html: html('vault.copy072') }} ></div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );

}
