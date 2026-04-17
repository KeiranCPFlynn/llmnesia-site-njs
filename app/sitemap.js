import { getAllContent } from '../lib/content';
import { absoluteUrl } from '../lib/site';

export default function sitemap() {
  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/compare', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/use-cases', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/changelog', priority: 0.7, changeFrequency: 'monthly' }
  ];

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

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified || new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
