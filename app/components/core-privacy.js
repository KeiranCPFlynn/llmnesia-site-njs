import { getTemplateBody } from '../../lib/template-page';
import { siteHtml, siteText, escapeHtml } from '../../lib/site-copy';
import { languagePickerHtml, localizeHtmlLinks, languageCampaign } from '../../lib/site-language';

export default function PrivacyPage({ language = 'en' }) {
  let body = getTemplateBody('privacy-policy.template.html')
    .replace(/(aria-label|title)="\{\{t:([\w.-]+)\}\}"/g, (_, attr, id) => `${attr}="${escapeHtml(siteText(id, language))}"`)
    .replace(/\{\{t:([\w.-]+)\}\}/g, (_, id) => siteHtml(id, language))
    .replace('{{LANGUAGE_PICKER}}', languagePickerHtml(language, '/privacy-policy'));
  if (language !== 'en') {
    body = body.replace(/href="(https:\/\/(?:chromewebstore\.google\.com|microsoftedge\.microsoft\.com)[^"]*)"/g, (_, href) => {
      const target = new URL(href.replaceAll('&amp;', '&'));
      for (const [key, value] of Object.entries(languageCampaign(language))) target.searchParams.set(key, value);
      return `href="${escapeHtml(target.toString())}"`;
    });
  }
  return <div lang={language} dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(body, language) }} />;
}
