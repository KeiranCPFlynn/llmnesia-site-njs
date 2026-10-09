import { getTemplateBody } from './template-page';
import { footerBadgesHtml } from './footer-badges';
import { siteText, escapeHtml } from './site-copy';
import { languagePickerHtml, languageAlternates, SITE_LANGUAGES } from './site-language';
import { buildPageMetadata } from './metadata';
import { SITE_URL, CHROME_WEB_STORE_URL, absoluteUrl } from './site';
import { SUPPORTED_PLATFORMS, IMPORT_PLATFORMS, PLATFORM_COUNT, HERO_OVERFLOW, platformListSentence } from './platforms';

function platformSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '');
}

export function homepageBindings(language) {
  const config = SITE_LANGUAGES.find(item => item.code === language);
  if (!config) throw new Error(`Unsupported site language: ${language}`);
  const guideLink = config.guidePath ? ` <a href="${escapeHtml(config.guidePath)}" data-analytics="${language === 'de' ? 'german' : language}_setup_guide_click">${escapeHtml(siteText('homepage.guideLink', language))}</a>` : '';
  return {
    PLATFORM_COUNT: String(PLATFORM_COUNT),
    CHROME_WEB_STORE_URL,
    PLATFORM_OVERFLOW: String(HERO_OVERFLOW),
    PLATFORM_LIST: platformListSentence(),
    IMPORT_PLATFORM_LIST: platformListSentence(IMPORT_PLATFORMS),
    PLATFORM_CHIPS: SUPPORTED_PLATFORMS.map(name => `<li class="pf-chip pf-${platformSlug(name)}">${name}</li>`).join(''),
    FOOTER_BADGES: footerBadgesHtml(),
    LANGUAGE_PICKER: languagePickerHtml(language),
    LANGUAGE_NOTICE: language === 'en' ? '' : `<p class="hero-meta-line site-language-note">${escapeHtml(siteText('homepage.languageNotice', language))}${guideLink}</p>`
  };
}

export function resolveHomepageText(text, language) {
  const bindings = homepageBindings(language);
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in bindings)) throw new Error(`Unknown homepage binding: ${key}`);
    return bindings[key];
  });
}

export function homepageMarkup(language = 'en') {
  const template = getTemplateBody('index.template.html');
  const translated = template.replace(/\{\{t:([\w.-]+)\}\}/g, (_, id) => {
    const copy = siteText(id, language);
    return id.includes('.attr-') ? escapeHtml(copy) : copy;
  });
  let html = resolveHomepageText(translated, language);
  if (language !== 'en') {
    html = html.replace('<main id="main-content"', `<main lang="${language}" id="main-content"`);
    html = html.replace(/href="(https:\/\/(?:chromewebstore\.google\.com|microsoftedge\.microsoft\.com)[^"]*)"/g, (_, href) => {
      const target = new URL(href.replaceAll('&amp;', '&'));
      target.searchParams.set('utm_source', `${language === 'de' ? 'german' : language}_page`);
      target.searchParams.set('utm_medium', 'cta');
      target.searchParams.set('utm_campaign', `${language === 'de' ? 'german' : language}_pilot`);
      return `href="${escapeHtml(target.toString())}"`;
    });
  }
  return html;
}

export function homepageMetadata(language = 'en') {
  const config = SITE_LANGUAGES.find(item => item.code === language);
  if (!config) throw new Error(`Unsupported site language: ${language}`);
  const title = language === 'en' ? 'Search ChatGPT, Claude & Gemini History Privately | LLMnesia' : siteText('home.metaTitle', language);
  const description = language === 'en' ? `LLMnesia is a free Chrome and Edge extension that searches your AI chat history across ${PLATFORM_COUNT} AI tools. Local-first: your conversations stay on your device.` : siteText('home.metaDescription', language);
  const base = buildPageMetadata({title, description, canonicalPath: config.path});
  return {
    ...base,
    title: { absolute: title },
    alternates: { canonical: absoluteUrl(config.path), languages: languageAlternates(SITE_URL) },
    openGraph: { ...base.openGraph, locale: config.locale }
  };
}
