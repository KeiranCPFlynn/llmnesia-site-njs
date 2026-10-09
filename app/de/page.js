import GermanChrome, { GERMAN_CTA_UTM } from '../components/german-chrome';
import InstallLink from '../components/install-link';
import JsonLd from '../components/json-ld';
import { german as t } from '../../lib/german-copy';
import { buildPageMetadata } from '../../lib/metadata';
import { absoluteUrl } from '../../lib/site';
import { SUPPORTED_PLATFORMS } from '../../lib/platforms';

const pageMetadata = buildPageMetadata({ title: t('home.metaTitle'), description: t('home.metaDescription'), canonicalPath: '/de' });
export const metadata = {
  ...pageMetadata,
  title: { absolute: t('home.metaTitle') },
  alternates: { canonical: absoluteUrl('/de'), languages: { en: absoluteUrl('/'), de: absoluteUrl('/de'), 'x-default': absoluteUrl('/') } },
  openGraph: { ...pageMetadata.openGraph, locale: 'de_DE' }
};

const features = ['Search', 'Import', 'Archive'];
const steps = ['Install', 'Import', 'Search'];
const faqs = ['Language', 'Search', 'Free', 'Deleted'];

export default function GermanHomePage() {
  return (
    <GermanChrome>
      <main id="main-content" lang="de">
        <section className="hero container german-hero" id="top">
          <div className="german-hero-grid">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />{t('home.eyebrow')}</p>
              <h1>{t('home.title')}</h1>
              <p className="subheadline">{t('home.intro')}</p>
              <p className="german-language-note">{t('home.languageNotice')}</p>
              <div className="hero-cta">
                <InstallLink className="button button-large" utm={{ ...GERMAN_CTA_UTM, utm_content: 'hero' }}>{t('home.install')}</InstallLink>
                <a className="hero-secondary-link" href="/de/installation" data-analytics="german_setup_guide_click">{t('home.guide')}</a>
              </div>
              <p className="hero-meta-line">{t('home.localNote')}</p>
            </div>
            <figure className="german-example" aria-label={t('home.exampleLabel')}>
              <div className="german-example-head"><span>LLMnesia</span><kbd>⌘ ⇧ 9</kbd></div>
              <p className="german-example-query">{t('home.exampleQuery')}</p>
              <div className="german-example-result">
                <span className="german-example-platform">ChatGPT</span>
                <h3>{t('home.exampleTitle')}</h3>
                <p>{t('home.exampleSnippet')}</p>
              </div>
              <figcaption>{t('home.exampleCaption')}</figcaption>
            </figure>
          </div>
        </section>
        <section className="section" id="features">
          <div className="container">
            <p className="section-eyebrow">{t('home.featuresKicker')}</p>
            <h2>{t('home.featuresTitle')}</h2>
            <div className="card-grid german-card-grid">
              {features.map((feature) => <article className="card" key={feature}>
                <h3>{t(`home.feature${feature}Title`)}</h3><p>{t(`home.feature${feature}Body`)}</p>
              </article>)}
            </div>
            <div className="german-platforms">
              <h3>{t('home.platformsTitle')}</h3>
              <p>{t('home.platformsIntro')}</p>
              <ul className="german-platform-list">{SUPPORTED_PLATFORMS.map((platform) => <li key={platform}>{platform}</li>)}</ul>
              <p>{t('home.platformsLocal')}</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <p className="section-eyebrow">{t('home.howKicker')}</p>
            <h2>{t('home.howTitle')}</h2>
            <ol className="german-steps">{steps.map((step) => <li key={step}>
              <h3>{t(`home.step${step}Title`)}</h3><p>{t(`home.step${step}Body`)}</p>
            </li>)}</ol>
            <a className="button button-ghost" href="/de/installation">{t('home.guide')}</a>
          </div>
        </section>
        <section className="section" id="privacy">
          <div className="container">
            <p className="section-eyebrow">{t('home.privacyKicker')}</p>
            <h2>{t('home.privacyTitle')}</h2>
            <div className="card-grid german-privacy-grid">
              {['Local', 'Vault'].map((kind) => <article className="card" key={kind}>
                <h3>{t(`home.privacy${kind}Title`)}</h3><p>{t(`home.privacy${kind}Body`)}</p>
              </article>)}
            </div>
            <p className="german-small-copy">{t('home.privacyAnalytics')} <a href="/privacy-policy" hrefLang="en">{t('footer.policy')}</a></p>
          </div>
        </section>
        <section className="section">
          <div className="container german-reading-width">
            <h2>{t('home.faqTitle')}</h2>
            <div className="faq-list">{faqs.map((faq) => <details key={faq}>
              <summary>{t(`home.faq${faq}Question`)}</summary><p>{t(`home.faq${faq}Answer`)}</p>
            </details>)}</div>
          </div>
        </section>
        <section className="section german-closing">
          <div className="container">
            <h2>{t('home.closingTitle')}</h2><p className="section-intro">{t('home.closingBody')}</p>
            <InstallLink className="button button-large" utm={{ ...GERMAN_CTA_UTM, utm_content: 'closing' }}>{t('home.install')}</InstallLink>
          </div>
        </section>
      </main>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: 'de', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: t(`home.faq${faq}Question`), acceptedAnswer: { '@type': 'Answer', text: t(`home.faq${faq}Answer`) } })) }} />
    </GermanChrome>
  );
}
