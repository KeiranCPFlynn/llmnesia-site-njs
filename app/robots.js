import { absoluteUrl } from '../lib/site';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: 'llmnesia.com'
  };
}
