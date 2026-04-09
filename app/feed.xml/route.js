import { getAllContent } from '../../lib/content';
import { absoluteUrl } from '../../lib/site';

function escapeXml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const posts = getAllContent('blog');

  const items = posts
    .map(
      (post) => `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${absoluteUrl(post.canonicalPath)}</link>
          <guid>${absoluteUrl(post.canonicalPath)}</guid>
          <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
          <description>${escapeXml(post.description)}</description>
        </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>LLMnesia Blog</title>
        <link>${absoluteUrl('/blog')}</link>
        <description>Install-focused guides for searchable AI chat workflows.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
