import { getTemplateBody } from '../lib/template-page';
import JsonLd from './components/json-ld';
import { buildPageMetadata } from '../lib/metadata';
import { organizationSchema, softwareApplicationSchema } from '../lib/schema';

export const metadata = buildPageMetadata({
  title: 'LLMnesia | Stop losing answers in AI chats.',
  description:
    'Stop losing answers in AI chats. LLMnesia indexes conversations across ChatGPT, Claude, Gemini and more so you can find old prompts, answers, ideas, and decisions instantly.',
  canonicalPath: '/'
});

export default function HomePage() {
  const bodyMarkup = getTemplateBody('index.template.html');

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyMarkup }} />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={organizationSchema()} />
    </>
  );
}
