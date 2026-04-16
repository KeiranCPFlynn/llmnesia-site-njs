import { getTemplateBody } from '../lib/template-page';
import JsonLd from './components/json-ld';
import { buildPageMetadata } from '../lib/metadata';
import { organizationSchema, softwareApplicationSchema, homepageFaqSchema } from '../lib/schema';

export const metadata = buildPageMetadata({
  title: 'LLMnesia | Stop losing answers in AI chats.',
  description:
    'Stop losing answers in AI chats. LLMnesia indexes conversations across ChatGPT, Claude, Gemini and more so you can find old prompts, answers, ideas, and decisions instantly.',
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
    answer:
      "Today, LLMnesia indexes chats as you browse supported platforms. Historical backfill for older conversations may be added in a future release based on user demand."
  },
  {
    question: 'Which AI platforms are supported today?',
    answer:
      'Supported now: ChatGPT, Claude, Gemini, Perplexity, DeepSeek, Grok, Mistral, Kimi, Qwen, and Google AI Studio. Additional integrations are in progress.'
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
  const bodyMarkup = getTemplateBody('index.template.html');

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyMarkup }} />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={homepageFaqSchema(HOMEPAGE_FAQS)} />
    </>
  );
}
