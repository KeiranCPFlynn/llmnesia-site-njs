import { getTemplateBody } from '../../lib/template-page';
import { siteHtml, siteText, escapeHtml } from '../../lib/site-copy';
import { languagePickerHtml, localizeHtmlLinks } from '../../lib/site-language';

export default function PrivacyPage({ language = 'en' }) {
  const body = getTemplateBody('privacy-policy.template.html')
    .replace(/(aria-label|title)="\{\{t:([\w.-]+)\}\}"/g, (_, attr, id) => `${attr}="${escapeHtml(siteText(id, language))}"`)
    .replace(/\{\{t:([\w.-]+)\}\}/g, (_, id) => siteHtml(id, language))
    .replace('{{LANGUAGE_PICKER}}', languagePickerHtml(language, '/privacy-policy'));
  return <div lang={language} dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(body, language) }} />;
}
