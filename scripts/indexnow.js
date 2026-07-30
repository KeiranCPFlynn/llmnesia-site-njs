/**
 * Submit site URLs to IndexNow (Bing, Yandex, Naver, Seznam).
 *
 * Usage:
 *   node scripts/indexnow.js              # submit all sitemap URLs
 *   node scripts/indexnow.js /blog/my-post  # submit specific paths only
 *
 * Env:
 *   INDEXNOW_KEY        — override the default key
 *   SITE_URL            — override the canonical site URL
 *   INDEXNOW_DRY_RUN=1  — print payload without submitting
 */

const KEY = process.env.INDEXNOW_KEY || '48109b71cc404d1ea5dc1717ba3cd16b';
const SITE_URL = process.env.SITE_URL || 'https://www.llmnesia.com';
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

function buildUrlList(paths) {
  return paths.map((p) => {
    const full = p.startsWith('http') ? p : `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p}`;
    return full;
  });
}

async function submit(urlList) {
  const body = {
    host: new URL(SITE_URL).hostname,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList
  };

  if (process.env.INDEXNOW_DRY_RUN) {
    console.log('Dry run — would POST to', ENDPOINT);
    console.log(JSON.stringify(body, null, 2));
    return { status: 200 };
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  });

  return { status: res.status, body: await res.text() };
}

async function main() {
  const args = process.argv.slice(2);
  let urls;

  if (args.length > 0) {
    urls = buildUrlList(args);
    console.log(`Submitting ${urls.length} URL(s) from arguments`);
  } else {
    console.log('Fetching sitemap URLs…');
    urls = await getSitemapUrls();
    console.log(`Found ${urls.length} URL(s) in sitemap`);
  }

  if (urls.length === 0) {
    console.log('Nothing to submit.');
    return;
  }

  // IndexNow accepts max 10,000 URLs per request; batch if needed
  const BATCH = 10000;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const { status, body } = await submit(batch);
    console.log(`Batch ${Math.floor(i / BATCH) + 1}: HTTP ${status}${body ? ` — ${body}` : ''}`);
  }
}

main().catch((err) => {
  console.error('IndexNow submission failed:', err.message);
  process.exit(1);
});
