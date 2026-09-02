import { getAllContent, getAllCategories } from '../lib/content';
import { absoluteUrl } from '../lib/site';

export const dynamic = 'force-static';

export default function sitemap() {
  // Only advertise /pricing once the route is public AND Vault can actually be
  // bought. The statically exported page renders noindex not-found UI unless
  // NEXT_PUBLIC_VAULT_PRICING_PUBLIC is set, so listing it earlier would submit
  // a gated page to search engines, and listing a live page with no purchase
  // path would send search traffic to a dead end. Both flags flip in the same
  // authorised release, so requiring both costs nothing.
  const pricingRoutes =
    process.env.NEXT_PUBLIC_VAULT_CHECKOUT_ENABLED === 'true' &&
    process.env.NEXT_PUBLIC_VAULT_PRICING_PUBLIC === 'true'
      ? [{ path: '/pricing', priority: 0.9, changeFrequency: 'weekly' }]
      : [];

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/mcp', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/vault', priority: 0.8, changeFrequency: 'weekly' },
    ...pricingRoutes,
    { path: '/claude-code', priority: 0.8, changeFrequency: 'weekly' },
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
    priority: route.priority
  }));
}
