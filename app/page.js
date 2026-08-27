import { getTemplateBody } from '../lib/template-page';
import { footerBadgesHtml } from '../lib/footer-badges';
import JsonLd from './components/json-ld';
import { buildPageMetadata } from '../lib/metadata';
import { organizationSchema, softwareApplicationSchema, homepageFaqSchema } from '../lib/schema';
import { CHROME_WEB_STORE_URL } from '../lib/site';
import {
  SUPPORTED_PLATFORMS,
  IMPORT_PLATFORMS,
  PLATFORM_COUNT,
  HERO_OVERFLOW,
  platformListSentence
} from '../lib/platforms';

export const metadata = buildPageMetadata({
  title: 'Search ChatGPT, Claude & Gemini History Privately | LLMnesia',
  description: `LLMnesia is a free Chrome and Edge extension that searches your AI chat history across ${PLATFORM_COUNT} AI tools. Local-first: your conversations stay on your device.`,
  canonicalPath: '/'
});

const HOMEPAGE_FAQS = [
  {
    question: 'Is my data stored on your servers?',
    answer:
      'No. Everything is stored locally in your browser. LLMnesia never sends your conversations, search queries, or personal data to external servers.'
  },
  {
    question: 'How does local indexing actually work?',
    answer:
      'When you visit a supported AI platform, LLMnesia indexes conversation content locally in your browser storage so it is searchable later. It runs automatically in the background.'
  },
  {
    question: 'Will it index my older chat history too?',
    answer: `Yes. You can import your existing history from ${platformListSentence(
      IMPORT_PLATFORMS
    )} in a few clicks. For other supported platforms, LLMnesia indexes conversations automatically as you open them.`
  },
  {
    question: 'Which AI platforms are supported today?',
    answer: `Supported now: ${platformListSentence()}. You can also index local Claude Code and Codex sessions — from their terminal, IDE, and desktop surfaces — into the same search.`
  },
  {
    question: 'Will it slow down my browser?',
    answer:
      'LLMnesia is designed to stay lightweight. Indexing happens incrementally in the background while you work.'
  },
  {
    question: 'Can I delete my indexed data?',
    answer: 'Yes. You can clear all indexed data with one click from the extension settings.'
  },
  {
    question: 'Can I export my conversations?',
    answer:
      'Yes. You can export and back up your conversation history in a portable format that you own.'
  },
  {
    question: 'Does it require an account?',
    answer: 'No account is required for local indexing and search.'
  },
  {
    question: 'Is it free?',
    answer: 'Yes. LLMnesia is completely free to use.'
  }
];

export default function HomePage() {
  const platformChips = SUPPORTED_PLATFORMS.map((name) => `<li>${name}</li>`).join('');
  const bodyMarkup = getTemplateBody('index.template.html')
    .replaceAll('{{PLATFORM_COUNT}}', String(PLATFORM_COUNT))
    .replaceAll('{{CHROME_WEB_STORE_URL}}', CHROME_WEB_STORE_URL)
    .replaceAll('{{PLATFORM_OVERFLOW}}', String(HERO_OVERFLOW))
    .replaceAll('{{PLATFORM_LIST}}', platformListSentence())
    .replaceAll('{{IMPORT_PLATFORM_LIST}}', platformListSentence(IMPORT_PLATFORMS))
    .replaceAll('{{PLATFORM_CHIPS}}', platformChips)
    .replaceAll('{{FOOTER_BADGES}}', footerBadgesHtml());

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyMarkup }} />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={homepageFaqSchema(HOMEPAGE_FAQS)} />
    </>
  );
}
