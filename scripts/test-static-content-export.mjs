import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentTypes = ['blog', 'compare', 'use-cases'];

async function readEntries(type) {
  const directory = path.join(projectRoot, 'content', type);
  const filenames = (await readdir(directory)).filter((name) => name.endsWith('.mdx'));

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await readFile(path.join(directory, filename), 'utf8');
      return matter(source).data;
    })
  );
}

const entriesByType = Object.fromEntries(
  await Promise.all(
    contentTypes.map(async (type) => [type, await readEntries(type)])
  )
);
const contentRoutes = contentTypes.flatMap((type) =>
  entriesByType[type].map((entry) => entry.canonicalPath)
);
const categoryRoutes = [...new Set(entriesByType.blog.map((entry) => entry.category))].map(
  (category) => `/blog/category/${category}`
);
const routes = [...contentRoutes, ...categoryRoutes];

const conversionCopyByRoute = {
  '/blog/recover-deleted-chatgpt-conversation': 'Protect future ChatGPT chats, free',
  '/blog/recover-deleted-claude-conversation': 'Protect future Claude chats, free',
  '/blog/google-ai-mode-history': 'Search AI Mode history, free',
  '/blog/how-to-find-old-character-ai-conversations': 'Search Character.AI history, free',
  '/blog/search-character-ai-conversation-history': 'Search Character.AI chats, free'
};

for (const route of routes) {
  const outputPath = path.join(projectRoot, 'out', `${route.slice(1)}.html`);
  const html = await readFile(outputPath, 'utf8');

  assert.equal(
    html.includes('<meta name="robots" content="noindex"/>'),
    false,
    `${route} was exported as a noindex page`
  );
  assert.equal(
    html.includes('Browse the blog</a> — guides on AI chat history'),
    false,
    `${route} was exported with the 404 fallback`
  );
  assert.match(
    html,
    new RegExp(
      `<link rel="canonical" href="https://www\\.llmnesia\\.com${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*/>`
    ),
    `${route} is missing its canonical metadata`
  );

  const expectedConversionCopy = conversionCopyByRoute[route];
  if (expectedConversionCopy) {
    assert.equal(
      html.includes(expectedConversionCopy),
      true,
      `${route} is missing its targeted conversion CTA`
    );
  }
}

const llmsFull = await readFile(path.join(projectRoot, 'out', 'llms-full.txt'), 'utf8');
assert.match(llmsFull, /## Verified platform facts/, 'llms-full.txt is missing verified facts');
assert.match(llmsFull, /Answer summary:/, 'llms-full.txt is missing article answer summaries');
assert.match(llmsFull, /Primary sources:/, 'llms-full.txt is missing article source links');
assert.match(
  llmsFull,
  /Claude Pro, Max, Team, and Enterprise users can ask Claude to search/,
  'llms-full.txt is missing the verified Claude search fact'
);
assert.match(
  llmsFull,
  /consumer Copilot retains the last 18 months/,
  'llms-full.txt is missing the verified Copilot retention fact'
);

process.stdout.write(`Static content export checks passed for ${routes.length} routes.\n`);
