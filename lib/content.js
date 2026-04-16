import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const CONTENT_TYPES = ['blog', 'compare', 'use-cases'];
const TYPE_LABELS = {
  blog: 'Blog',
  compare: 'Compare',
  'use-cases': 'Use Cases'
};

const REQUIRED_FIELDS = [
  'title',
  'slug',
  'description',
  'publishDate',
  'updatedDate',
  'author',
  'primaryKeyword',
  'secondaryKeywords',
  'intent',
  'faq',
  'sources',
  'canonicalPath'
];

function assertType(type) {
  if (!CONTENT_TYPES.includes(type)) {
    throw new Error(`Unsupported content type: ${type}`);
  }
}

function parseContentFile(type, fileName) {
  const filePath = path.join(CONTENT_ROOT, type, fileName);
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      throw new Error(`Missing required field "${field}" in ${filePath}`);
    }
  }

  if (!Array.isArray(data.secondaryKeywords)) {
    throw new Error(`secondaryKeywords must be an array in ${filePath}`);
  }

  if (!Array.isArray(data.faq) || data.faq.length === 0) {
    throw new Error(`faq must be a non-empty array in ${filePath}`);
  }

  if (!Array.isArray(data.sources) || data.sources.length === 0) {
    throw new Error(`sources must be a non-empty array in ${filePath}`);
  }

  if (data.relatedSlugs !== undefined && !Array.isArray(data.relatedSlugs)) {
    throw new Error(`relatedSlugs must be an array when present in ${filePath}`);
  }

  return {
    ...data,
    type,
    content,
    filePath,
    relatedSlugs: data.relatedSlugs || [],
    publishDate: new Date(data.publishDate).toISOString(),
    updatedDate: new Date(data.updatedDate).toISOString()
  };
}

export function getAllContent(type) {
  assertType(type);
  const dirPath = path.join(CONTENT_ROOT, type);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.mdx'));

  return files
    .map((file) => parseContentFile(type, file))
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
}

export function getContentBySlug(type, slug) {
  const entries = getAllContent(type);
  return entries.find((entry) => entry.slug === slug) || null;
}

export function getStaticParamsForType(type) {
  return getAllContent(type).map((entry) => ({ slug: entry.slug }));
}

const mdxComponents = {
  table: ({ children, ...props }) => (
    <div className="table-wrapper">
      <table {...props}>{children}</table>
    </div>
  )
};

export async function renderMdx(content) {
  const { content: compiled } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  });

  return compiled;
}

export function getTypeLabel(type) {
  return TYPE_LABELS[type] || type;
}

function keywordScore(entryA, entryB) {
  const setA = new Set([
    entryA.primaryKeyword,
    ...(entryA.secondaryKeywords || [])
  ].map((k) => k.toLowerCase()));

  const allB = [entryB.primaryKeyword, ...(entryB.secondaryKeywords || [])].map((k) =>
    k.toLowerCase()
  );

  return allB.reduce((score, kw) => {
    if (setA.has(kw)) return score + 2;
    for (const a of setA) {
      if (kw.includes(a) || a.includes(kw)) return score + 1;
    }
    return score;
  }, 0);
}

export function getRelatedLinks(currentEntry) {
  // If the content file explicitly specifies related slugs, resolve those first
  if (Array.isArray(currentEntry.relatedSlugs) && currentEntry.relatedSlugs.length > 0) {
    const explicit = currentEntry.relatedSlugs
      .map((ref) => {
        const [type, slug] = ref.includes('/') ? ref.split('/') : [null, ref];
        const searchTypes = type ? [type] : CONTENT_TYPES;
        for (const t of searchTypes) {
          const pool = getAllContent(t);
          const found = pool.find((e) => e.slug === slug);
          if (found) return { href: `/${t}/${found.slug}`, label: `${getTypeLabel(t)}: ${found.title}` };
        }
        return null;
      })
      .filter(Boolean);

    if (explicit.length > 0) return explicit;
  }

  // Automatic: pick best keyword-matching entry from each other content type
  return CONTENT_TYPES.map((type) => {
    const pool = getAllContent(type).filter(
      (e) => !(e.type === currentEntry.type && e.slug === currentEntry.slug)
    );
    if (pool.length === 0) return null;

    // Sort by keyword overlap score descending, fall back to most recent
    const scored = pool
      .map((e) => ({ entry: e, score: keywordScore(currentEntry, e) }))
      .sort((a, b) => b.score - a.score || 0);

    const chosen = scored[0].entry;
    return {
      href: `/${type}/${chosen.slug}`,
      label: `${getTypeLabel(type)}: ${chosen.title}`
    };
  }).filter(Boolean);
}

export function getAllIndexablePaths() {
  const staticPaths = ['/', '/privacy-policy', '/blog', '/compare', '/use-cases'];

  const dynamicPaths = CONTENT_TYPES.flatMap((type) =>
    getAllContent(type).map((entry) => `/${type}/${entry.slug}`)
  );

  return [...staticPaths, ...dynamicPaths];
}
