import JsonLd from './json-ld';
import { homepageMarkup, resolveHomepageText } from '../../lib/homepage';
import { siteText } from '../../lib/site-copy';
import { organizationSchema, softwareApplicationSchema, homepageFaqSchema } from '../../lib/schema';

export default function Homepage({ language = 'en' }) {
  const faqs = Array.from({ length: 9 }, (_, index) => ({
    question: siteText(`homepage.faq.summary.${index + 1}`, language),
    answer: resolveHomepageText(siteText(`homepage.faq.p.${index + 2}`, language), language)
  }));
  return (
    <>
      <div lang={language} dangerouslySetInnerHTML={{ __html: homepageMarkup(language) }} />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={{ ...homepageFaqSchema(faqs), inLanguage: language }} />
    </>
  );
}
