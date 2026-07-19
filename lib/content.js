import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import InlineInstallCta from '../app/components/inline-install-cta';
import DemoCtaExperiment from '../app/components/demo-cta-experiment';
import {
  recoverScenes,
  exportScenes,
  searchScenes
} from '../app/components/kinetic-demo-scenes';

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

// Minimum amount of intro prose (in characters) to keep above the inline CTA, so
// the reader always gets a real answer first while the CTA still sits high on the
// page — close to the fold on mobile.
const MIN_INTRO_CHARS = 110;

// Index of the blank line that ends the first paragraph block inside the intro
// region (lines[0..limit)), once at least MIN_INTRO_CHARS of prose has
// accumulated. Returns -1 when there is no such break. Tracks code fences so a
// fenced block is never split mid-way.
function firstIntroBreak(lines, limit) {
  let inFence = false;
  for (let i = 0; i < limit; i++) {
    const line = lines[i];
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && line.trim() === '') {
      const above = lines.slice(0, i).join(' ').replace(/\s+/g, ' ').trim();
      if (above.length >= MIN_INTRO_CHARS) return i;
    }
  }
  return -1;
}

// Split the article so an inline CTA can be placed high in the intro. Prefers to
// split right after the first substantial paragraph — so on mobile the CTA lands
// near the top of the page rather than several paragraphs down — with the rest of
// the intro and the body kept below it. Falls back to splitting after the whole
// intro, and for articles that open straight into a heading, after the first
// whole section. Returns null only when the article has no `## ` sections at all.
function splitAfterIntro(content) {
  const lines = content.split('\n');
  let inFence = false;
  const headingIndices = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^##\s+/.test(line)) {
      headingIndices.push(i);
    }
  }

  if (headingIndices.length === 0) return null;

  const firstHeading = headingIndices[0];
  const introHasContent = lines.slice(0, firstHeading).join('\n').trim().length > 0;

  if (introHasContent) {
    // Preferred: split after the first substantial paragraph of the intro.
    const paraBreak = firstIntroBreak(lines, firstHeading);
    const splitIndex = paraBreak !== -1 ? paraBreak : firstHeading;
    const intro = lines.slice(0, splitIndex).join('\n').trim();
    if (intro) {
      return { intro, rest: lines.slice(splitIndex).join('\n').trim() };
    }
  }

  // Article opens on a heading: fall back to after the first whole section.
  const splitIndex = headingIndices[1];
  if (splitIndex === undefined) return null;

  const intro = lines.slice(0, splitIndex).join('\n').trim();
  if (!intro) return null;
  return { intro, rest: lines.slice(splitIndex).join('\n').trim() };
}

// Parse one CSV row into fields, honouring quoted fields that contain commas.
function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

// Slugs the CTR triage marked bucket A — the only pages that receive a kinetic
// demo. Read from blog-ctr-triage.csv at build time so the source of truth stays
// the triage sheet, not a hardcoded list.
const loadBucketASlugs = cache(() => {
  const csvPath = path.join(process.cwd(), 'blog-ctr-triage.csv');
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== '');
  const header = parseCsvLine(lines[0]);
  const fileIdx = header.indexOf('file');
  const bucketIdx = header.indexOf('bucket');
  const slugs = new Set();
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if ((fields[bucketIdx] || '').trim() !== 'A') continue;
    const match = (fields[fileIdx] || '').match(/([^/]+)\.mdx$/);
    if (match) slugs.add(match[1]);
  }
  return slugs;
});

// Map a bucket-A page to one of the three kinetic demo scene sets by intent
// family, using the same slug/keyword signal the CTR buckets use. Rules are
// tried top to bottom, first match wins, so the recover verbs (which include
// "find old") are checked before the broader search/find capability signal.
const DEMO_FAMILY_RULES = [
  ['recover', recoverScenes, /recover|deleted|delete|disappear|vanish|\blost\b|\blose\b|losing|missing|gone|find.?old|retriev|restore/],
  ['export', exportScenes, /export|download|back.?up|backup|\bsave\b|archive/],
  ['search', searchScenes, /search|organi[sz]e|\bfind\b|access|browse|manage/]
];

// Choose the kinetic demo for an entry, or null when the page is not bucket A.
// Pages that match no family cleanly default to the multi-platform search demo.
export function getDemoForEntry(entry) {
  if (!entry || !entry.slug) return null;
  if (!loadBucketASlugs().has(entry.slug)) return null;
  const haystack = `${entry.slug} ${entry.primaryKeyword || ''}`.toLowerCase();
  for (const [family, scenes, pattern] of DEMO_FAMILY_RULES) {
    if (pattern.test(haystack)) return { family, scenes };
  }
  return { family: 'search', scenes: searchScenes };
}

// Render the article body with the inline install CTA injected after the intro,
// and — for bucket-A pages — a kinetic demo immediately after the CTA, so the
// order is answer, CTA (kept high, above the fold), demo, then the body. Passing
// no demoScenes (the default, and every non-blog caller) renders just the CTA.
// Falls back to a plain render when there is no clean split point.
export async function renderMdxWithCta(content, ctaProps = {}, { demoScenes = null } = {}) {
  const split = splitAfterIntro(content);
  if (!split) {
    return renderMdx(content);
  }

  const [introBody, restBody] = await Promise.all([
    renderMdx(split.intro),
    renderMdx(split.rest)
  ]);

  return (
    <>
      {introBody}
      {demoScenes ? (
        <DemoCtaExperiment ctaProps={ctaProps} scenes={demoScenes} />
      ) : (
        <InlineInstallCta {...ctaProps} placement="inline" />
      )}
      {restBody}
    </>
  );
}

export function getTypeLabel(type) {
  return TYPE_LABELS[type] || type;
}

// Platform tokens matched against an entry's slug + primary keyword to tailor
// the install CTA. Tokens are unambiguous substrings — short ones like "pi"
// are avoided because they collide with words like "copilot".
// Only the 12 platforms LLMnesia actually supports get a platform-named CTA.
// Unsupported platforms we still publish SEO guides for (Meta AI, Poe,
// NotebookLM) are deliberately omitted, so the CTA never claims LLMnesia can
// search them — those pages fall back to the generic multi-platform copy.
const CTA_PLATFORM_TOKENS = [
  ['copilot', 'copilot'],
  ['chatgpt', 'chatgpt'],
  ['claude', 'claude'],
  ['gemini', 'gemini'],
  ['deepseek', 'deepseek'],
  ['grok', 'grok'],
  ['perplexity', 'perplexity'],
  ['mistral', 'mistral'],
  ['qwen', 'qwen'],
  ['kimi', 'kimi'],
  ['ai-studio', 'ai-studio'],
  ['character-ai', 'character-ai']
];

// Intent families for the install CTA, each matched against an entry's slug +
// primary keyword. Order matters — rules are tried top to bottom and the first
// match wins, so more specific verbs (export) are checked before broader loss
// and capability signals. Families mirror the action-intent buckets in
// blog-ctr-triage.csv and drive both the CTA copy and the analytics `family`
// dimension:
//   loss        — recover / deleted / disappeared / find-old (loss-aversion)
//   export      — export / download / backup / archive (permanence)
//   reliability — not-loading / limits / outages (reliability)
//   capability  — search / organize + everything else (capability), the default
const CTA_FAMILY_RULES = [
  ['export', /export|download|back ?up|backup|archive/],
  [
    'reliability',
    /not.?loading|not load|won'?t load|can'?t load|fail(s|ed|ing)? to load|stopped (load|work)|history not|\blimit(s|ed|ing)?\b|too many|rate.?limit|context (window|limit)|unavailable|is down|outage/
  ],
  [
    'loss',
    /recover|deleted|delete|disappear|vanish|\blost\b|\blose\b|losing|missing|gone|find.?old|old .*(conversation|chat)|where .*(went|are|is|find)|retriev|restore/
  ],
  ['capability', /search|organi[sz]e|browse|\bfind\b|manage|access/]
];

// Derive the CTA intent family from an entry's slug + primary keyword. Falls
// back to 'capability' for pages with no explicit action signal (persona and
// general history pages), where the search value prop is the strongest hook.
export function getCtaFamily(entry) {
  const haystack = `${entry.slug || ''} ${entry.primaryKeyword || ''}`.toLowerCase();
  for (const [family, pattern] of CTA_FAMILY_RULES) {
    if (pattern.test(haystack)) return family;
  }
  return 'capability';
}

// Choose the platform + intent family for the install CTA from an entry's
// metadata so the copy matches why the reader is here. Returns props for
// <InlineInstallCta />.
export function getCtaProps(entry) {
  const haystack = `${entry.slug || ''} ${entry.primaryKeyword || ''}`.toLowerCase();

  let platform = null;
  for (const [token, name] of CTA_PLATFORM_TOKENS) {
    if (haystack.includes(token)) {
      platform = name;
      break;
    }
  }

  return { platform, family: getCtaFamily(entry), slug: entry.slug };
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

export function getAllCategories(type) {
  const entries = getAllContent(type);
  const cats = entries.map((e) => e.category).filter(Boolean);
  return [...new Set(cats)];
}

export function getContentByCategory(type, category) {
  return getAllContent(type).filter((e) => e.category === category);
}

export function getAllIndexablePaths() {
  const staticPaths = ['/', '/privacy-policy', '/blog', '/compare', '/use-cases'];

  const dynamicPaths = CONTENT_TYPES.flatMap((type) =>
    getAllContent(type).map((entry) => `/${type}/${entry.slug}`)
  );

  return [...staticPaths, ...dynamicPaths];
}
