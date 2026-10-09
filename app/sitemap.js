import { getAllContent, getAllCategories } from '../lib/content';
import { absoluteUrl, SITE_URL } from '../lib/site';
import { SITE_LANGUAGES, languageAlternates } from '../lib/site-language';

export const dynamic = 'force-static';

export default function sitemap() {
  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    ...SITE_LANGUAGES.filter(item => item.code !== 'en').map(({path}) => ({path, priority: 0.8, changeFrequency: 'monthly'})),
    ...SITE_LANGUAGES.filter(item => item.guidePath).map(({guidePath}) => ({path: guidePath, priority: 0.6, changeFrequency: 'monthly'})),
    { path: '/mcp', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/vault', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/claude-code', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/zcode', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/compare', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/use-cases', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/changelog', priority: 0.7, changeFrequency: 'monthly' }
  ];

  const categoryRoutes = getAllCategories('blog').map((cat) => ({
    path: `/blog/category/${cat}`,
    priority: 0.7,
    changeFrequency: 'weekly'
  }));

  const dynamicRoutes = [
    ...getAllContent('blog').map((entry) => ({
      path: entry.canonicalPath,
      lastModified: entry.updatedDate,
      priority: 0.8,
      changeFrequency: 'monthly'
    })),
    ...getAllContent('compare').map((entry) => ({
      path: entry.canonicalPath,
      lastModified: entry.updatedDate,
      priority: 0.9,
      changeFrequency: 'monthly'
    })),
    ...getAllContent('use-cases').map((entry) => ({
      path: entry.canonicalPath,
      lastModified: entry.updatedDate,
      priority: 0.8,
      changeFrequency: 'monthly'
    }))
  ];

  return [...staticRoutes, ...categoryRoutes, ...dynamicRoutes].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified || new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(SITE_LANGUAGES.some(item => item.path === route.path) && { alternates: { languages: languageAlternates(SITE_URL) } })
  }));
}
