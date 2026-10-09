import SiteChrome from './site-chrome';
import VaultPurchase from './vault-purchase';
import VaultPlanCta from './vault-plan-cta';
import JsonLd from './json-ld';
import { homepageFaqSchema } from '../../lib/schema';
import { formatSiteText, siteHtml, clientCopy } from '../../lib/site-copy';
import { localizedHref } from '../../lib/site-language';

const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true';
const MONTHLY_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_MONTHLY_PRICE_LABEL || '£8';
const ANNUAL_PRICE_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_PRICE_LABEL || '£88';
const ANNUAL_MONTHLY_LABEL = process.env.NEXT_PUBLIC_VAULT_ANNUAL_MONTHLY_LABEL || '£7.33';

export default function PricingPage({ language = 'en' }) {
  const t = (id, values) => formatSiteText(id, language, values);
  const html = (id, values) => siteHtml(id, language, values);
  const PLANS = [
    {
      name: 'LLMnesia',
      priceMain: t('pricing.copy001'),
      priceSub: t('pricing.copy002'),
      points: [
        t('pricing.copy003'),
        t('pricing.copy004'),
        t('pricing.copy005'),
        t('pricing.copy006'),
        t('pricing.copy007')
      ],
      foot: t('pricing.copy008')
    },
    {
      name: 'Vault',
      featured: true,
      flag: t('pricing.copy009'),
      priceMain: ANNUAL_MONTHLY_LABEL,
      priceUnit: t('chrome.month'),
      priceSub: t('pricing.copy010', { VALUE_A: ANNUAL_PRICE_LABEL, VALUE_B: MONTHLY_PRICE_LABEL }),
      points: [
        t('pricing.copy011'),
        t('pricing.copy012'),
        t('pricing.copy013'),
        t('pricing.copy014'),
        t('pricing.copy015')
      ],
      cta: t('pricing.copy016')
    }
  ];
  const PROOF_QUERY = t('pricing.copy017');
  const PROOF_WITHOUT = [
    {
      platform: 'ChatGPT',
      platformKey: 'chatgpt',
      title: t('pricing.copy018'),
      snippet: t('pricing.copy019')
    },
    {
      platform: 'Claude',
      platformKey: 'claude',
      title: t('pricing.copy020'),
      snippet: t('pricing.copy021')
    }
  ];
  const PROOF_WITH = [
    ...PROOF_WITHOUT,
    {
      platform: 'Gemini',
      platformKey: 'gemini',
      title: t('pricing.copy022'),
      snippet: t('pricing.copy023')
    },
    {
      platform: 'Perplexity',
      platformKey: 'perplexity',
      title: t('pricing.copy024'),
      snippet: t('pricing.copy025')
    },
    {
      platform: 'Grok',
      platformKey: 'grok',
      title: t('pricing.copy026'),
      snippet: t('pricing.copy027')
    }
  ];
  const FAQS = [
    {
      q: t('pricing.copy028'),
      a: t('pricing.copy029')
    },
    {
      q: t('pricing.copy030'),
      a: t('pricing.copy031')
    },
    {
      q: t('pricing.copy032'),
      a: t('pricing.copy033')
    },
    {
      q: t('pricing.copy034'),
      a: t('pricing.copy035')
    },
    {
      q: t('pricing.copy036'),
      a: t('pricing.copy037', { VALUE_A: ANNUAL_MONTHLY_LABEL, VALUE_B: MONTHLY_PRICE_LABEL })
    },
    {
      q: t('pricing.copy038'),
      a: t('pricing.copy039')
    },
    {
      q: t('pricing.copy040'),
      a: t('pricing.copy041')
    },
    {
      q: t('pricing.copy042'),
      a: t('pricing.copy043')
    },
    {
      q: t('pricing.copy044'),
      a: t('pricing.copy045')
    },
    {
      q: t('pricing.copy046'),
      a: t('pricing.copy047')
    }
  ];

  return (
    <SiteChrome language={language} pagePath="/pricing" >
      <JsonLd data={homepageFaqSchema(FAQS.map((item) => ({ question: item.q, answer: item.a })))} />
      <main lang={language} id="main-content" className="vault-page">
        {/* Hero */}
        <section className="section vault-hero">
          <div className="container vault-hero-inner">
            <p className="eyebrow" dangerouslySetInnerHTML={{ __html: html('pricing.copy048') }} ></p>
            <h1 dangerouslySetInnerHTML={{ __html: html('pricing.copy049') }} ></h1>
              <p className="subheadline vault-hero-sub" dangerouslySetInnerHTML={{ __html: html('pricing.copy050') }} ></p>
          </div>
        </section>

        {/* The two plans */}
        <section className="section vault-benefits">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('pricing.copy051') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('pricing.copy052') }} ></h2>
            </div>
            <div className="card-grid vault-benefit-grid">
              {PLANS.map((plan) => (
                <article
                  className={`card vault-benefit-card vault-plan-card${
                    plan.featured ? ' vault-plan-card-featured' : ''
                  }`}
                  key={plan.name}
                >
                  {plan.flag ? <p className="vault-plan-flag">{plan.flag}</p> : null}
                  <h3>{plan.name}</h3>
                  <p className="vault-plan-price">
                    <span className="vault-plan-price-main">{plan.priceMain}</span>
                    {plan.priceUnit ? (
                      <span className="vault-plan-price-unit">{plan.priceUnit}</span>
                    ) : null}
                  </p>
                  <p className="vault-plan-price-sub">{plan.priceSub}</p>
                  <ul className="vault-pricing-points vault-plan-points">
                    {plan.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  {plan.cta ? (
                    <VaultPlanCta  copy={clientCopy('purchase', language)} contactHref={localizedHref('/#contact', language)} />
                  ) : (
                    <p className="vault-plan-foot">{plan.foot}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* The one piece of evidence on the page: the gap, shown rather than asserted */}
        <section className="section vault-proof">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('pricing.copy053') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('pricing.copy054') }} ></h2>
            </div>
            <div className="vault-proof-grid">
              <figure className="vault-proof-panel">
                <figcaption className="vault-proof-label" dangerouslySetInnerHTML={{ __html: html('pricing.copy055') }} ></figcaption>
                <div className="vault-proof-app" aria-label={t('pricing.copy056')}>
                  <div className="vault-proof-app-head" dangerouslySetInnerHTML={{ __html: html('pricing.copy057') }} ></div>
                  <div className="vault-proof-search-row">
                    <p className="vault-proof-query">{PROOF_QUERY}</p>
                    <span className="vault-proof-full-search" dangerouslySetInnerHTML={{ __html: html('pricing.copy058') }} ></span>
                  </div>
                  <ul className="vault-proof-list">
                    {PROOF_WITHOUT.map((hit) => (
                      <li key={`${hit.platform}-${hit.title}`}>
                        <div className="vault-proof-result-head">
                          <span className="vault-proof-platform" data-platform={hit.platformKey}>{hit.platform}</span>
                          <strong>{hit.title}</strong>
                        </div>
                        <span className="vault-proof-snippet">{hit.snippet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="vault-proof-note" dangerouslySetInnerHTML={{ __html: html('pricing.copy059') }} ></p>
              </figure>

              <figure className="vault-proof-panel vault-proof-panel-on">
                <figcaption className="vault-proof-label" dangerouslySetInnerHTML={{ __html: html('pricing.copy060') }} ></figcaption>
                <div className="vault-proof-app" aria-label={t('pricing.copy061')}>
                  <div className="vault-proof-app-head" dangerouslySetInnerHTML={{ __html: html('pricing.copy062') }} ></div>
                  <div className="vault-proof-search-row">
                    <p className="vault-proof-query">{PROOF_QUERY}</p>
                    <span className="vault-proof-full-search" dangerouslySetInnerHTML={{ __html: html('pricing.copy063') }} ></span>
                  </div>
                  <ul className="vault-proof-list">
                    {PROOF_WITH.map((hit) => (
                      <li key={`${hit.platform}-${hit.title}`}>
                        <div className="vault-proof-result-head">
                          <span className="vault-proof-platform" data-platform={hit.platformKey}>{hit.platform}</span>
                          <strong>{hit.title}</strong>
                        </div>
                        <span className="vault-proof-snippet">{hit.snippet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="vault-proof-note" dangerouslySetInnerHTML={{ __html: html('pricing.copy064') }} ></p>
              </figure>
            </div>
            <p className="vault-proof-caption" dangerouslySetInnerHTML={{ __html: html('pricing.copy065') }} ></p>
          </div>
        </section>

        {/* Vault, led by the one capability upgrade available on day one */}
        <section className="section vault-pricing" id="get-vault">
          <div className="container vault-pricing-inner">
            <div className="vault-pricing-copy">
              <p className="section-eyebrow">Vault</p>
              <h2 dangerouslySetInnerHTML={{ __html: html('pricing.copy066') }} ></h2>
              <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('pricing.copy067') }} ></p>
              <ul className="vault-pricing-points vault-plan-points">
                <li dangerouslySetInnerHTML={{ __html: html('pricing.copy068') }} ></li>
                <li dangerouslySetInnerHTML={{ __html: html('pricing.copy069') }} ></li>
              </ul>
              <p className="vault-reassure" dangerouslySetInnerHTML={{ __html: html('pricing.copy070') }} ></p>
            </div>
            <aside className="vault-price-card" aria-label={t('pricing.copy071')}>
              <p className="vault-price-badge">Vault</p>
              <p className="vault-price-figure" dangerouslySetInnerHTML={{ __html: html('pricing.copy072', { VALUE_A: ANNUAL_MONTHLY_LABEL }) }} ></p>
              <p className="vault-price-sub" dangerouslySetInnerHTML={{ __html: html('pricing.copy073', { VALUE_A: ANNUAL_PRICE_LABEL, VALUE_B: MONTHLY_PRICE_LABEL }) }} ></p>
              {CHECKOUT_ENABLED ? (
                <VaultPurchase
                  monthlyLabel={MONTHLY_PRICE_LABEL}
                  annualLabel={ANNUAL_PRICE_LABEL}
                  annualMonthlyLabel={ANNUAL_MONTHLY_LABEL}
                 copy={clientCopy('purchase', language)} contactHref={localizedHref('/#contact', language)} />
              ) : (
                <div id="vault-purchase" className="vault-purchase-fallback" dangerouslySetInnerHTML={{ __html: html('pricing.copy074') }} ></div>
              )}
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section className="section vault-faq">
          <div className="container">
            <div className="vault-section-head">
              <p className="section-eyebrow" dangerouslySetInnerHTML={{ __html: html('pricing.copy075') }} ></p>
              <h2 dangerouslySetInnerHTML={{ __html: html('pricing.copy076') }} ></h2>
            </div>
            <div className="faq-list vault-faq-list">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="section vault-closing">
          <div className="container vault-closing-inner">
            <h2 dangerouslySetInnerHTML={{ __html: html('pricing.copy077') }} ></h2>
            <p className="section-intro" dangerouslySetInnerHTML={{ __html: html('pricing.copy078', { VALUE_A: ANNUAL_PRICE_LABEL, VALUE_B: ANNUAL_MONTHLY_LABEL, VALUE_C: MONTHLY_PRICE_LABEL }) }} ></p>
            <a className="button button-large" href="#vault-purchase" dangerouslySetInnerHTML={{ __html: html('pricing.copy079') }} ></a>
          </div>
        </section>
      </main>
    </SiteChrome>
  );

}
