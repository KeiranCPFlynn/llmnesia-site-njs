import { getTemplateBody } from '../../lib/template-page';
import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'LLMnesia privacy policy. Local-first, no data collection, no servers. Your AI conversation index stays on your device.',
  canonicalPath: '/privacy-policy'
});

export default function PrivacyPolicyPage() {
  const bodyMarkup = getTemplateBody('privacy-policy.template.html');

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyMarkup }} />
    </>
  );
}
