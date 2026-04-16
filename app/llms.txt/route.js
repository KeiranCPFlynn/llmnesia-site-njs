import { getAllContent } from '../../lib/content';
import { SITE_URL, CHROME_WEB_STORE_URL } from '../../lib/site';

export const dynamic = 'force-static';

export function GET() {
  const blog = getAllContent('blog');
  const compare = getAllContent('compare');
  const useCases = getAllContent('use-cases');

  const mostRecent = [...blog, ...compare, ...useCases].reduce((latest, entry) => {
    return !latest || entry.updatedDate > latest ? entry.updatedDate : latest;
  }, null);

  const lines = [
    '# LLMnesia',
    '',
    `> LLMnesia is a free Chrome extension that automatically indexes AI conversations from`,
    `> ChatGPT, Claude, Gemini, Perplexity, DeepSeek, Grok, Mistral, Kimi, Qwen, and`,
    `> Google AI Studio — locally in your browser. No cloud sync. No account required.`,
    `> Search old prompts, answers, and decisions instantly.`,
    '',
    `Canonical: ${SITE_URL}`,
    `Install: ${CHROME_WEB_STORE_URL}`,
    `Category: Browser extension, AI chat retrieval, local-first productivity`,
    `Author: Keiran Flynn`,
    mostRecent ? `Updated: ${new Date(mostRecent).toISOString().split('T')[0]}` : '',
    '',
    '## Core pages',
    `- Home: ${SITE_URL}/`,
    `- Blog: ${SITE_URL}/blog`,
    `- Compare: ${SITE_URL}/compare`,
    `- Use Cases: ${SITE_URL}/use-cases`,
    `- About: ${SITE_URL}/about`,
    `- Privacy: ${SITE_URL}/privacy-policy`,
    '',
    `## Blog (${blog.length} articles)`,
    ...blog.map((e) => `- ${e.title}: ${SITE_URL}${e.canonicalPath}`),
    '',
    `## Comparisons (${compare.length} pages)`,
    ...compare.map((e) => `- ${e.title}: ${SITE_URL}${e.canonicalPath}`),
    '',
    `## Use Cases (${useCases.length} pages)`,
    ...useCases.map((e) => `- ${e.title}: ${SITE_URL}${e.canonicalPath}`),
    '',
    '## Feeds and crawl support',
    `- RSS feed: ${SITE_URL}/feed.xml`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Robots: ${SITE_URL}/robots.txt`,
    `- Full profile: ${SITE_URL}/llms-full.txt`
  ].filter((line) => line !== null);

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  });
}
