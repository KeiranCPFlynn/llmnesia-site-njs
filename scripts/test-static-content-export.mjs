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
}

process.stdout.write(`Static content export checks passed for ${routes.length} routes.\n`);
