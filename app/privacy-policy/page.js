import { getTemplateBody } from '../../lib/template-page';
import { buildPageMetadata } from '../../lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'LLMnesia privacy policy. Local-first AI conversation indexing, anonymous analytics, optional email signup, and no conversation content uploaded.',
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
