import { buildPageMetadata } from './metadata';
import { SITE_URL } from './site';
import { siteText } from './site-copy';
import { SITE_LANGUAGES, languageAlternates, localizedHref } from './site-language';

export function corePageMetadata(page, language) {
  const prefix = page === 'privacy-policy' ? 'privacy' : page;
  const base = buildPageMetadata({
    title: siteText(`${prefix}.metaTitle`, language),
    description: siteText(`${prefix}.metaDescription`, language),
    canonicalPath: localizedHref(`/${page}`, language)
  });
  return { ...base, alternates: { ...base.alternates, languages: languageAlternates(SITE_URL, `/${page}`) },
    openGraph: { ...base.openGraph, locale: SITE_LANGUAGES.find(item => item.code === language).locale } };
}
