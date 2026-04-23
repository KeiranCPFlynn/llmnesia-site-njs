# LLMnesia Content Plan — SEO & GEO Strategy

**Goal:** Drive Chrome Web Store installs via organic search and LLM discovery (GEO).  
**Primary approach:** Topical authority through content volume, structured FAQs in JSON-LD, declarative GEO-optimised copy, and the local-first privacy angle as a differentiator.

---

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1 — Technical SEO foundations | ✅ DONE | Completed 2026-04-16 |
| 2 — Blog content velocity | ✅ DONE | 3 → 64 posts |
| 3 — GEO-specific content | ✅ DONE | Definitional post, FAQ JSON-LD, llms.txt |
| 4 — Use-case page expansion | ✅ DONE | 3 → 5 pages, all rewritten to 700-900 words |
| 5 — Distribution & authority | ⬜ NOT STARTED | ProductHunt, CWS audit, Show HN |

---

## Phase 1 — Technical Foundations (DONE)

- `/app/api/og/route.js` — dynamic per-post OG image generator (`next/og` + Inter WOFF fonts)
- `lib/metadata.js` — `buildPageMetadata()` accepts optional `ogImage`; `buildOgImageUrl()` helper
- All MDX files updated: `author: "LLMnesia Team"` → `author: "Keiran Flynn"`
- `/app/about/page.js` — founder/product page with `Person` + `Organization` JSON-LD; linked from author byline
- `/app/llms.txt/route.js` + `/app/llms-full.txt/route.js` — dynamic routes, auto-sync as MDX content is added
- `lib/content.js` — `getRelatedLinks()` uses keyword-overlap scoring; `relatedSlugs[]` frontmatter field added
- `lib/schema.js` — upgraded: `articleSchema` adds `keywords`, `wordCount`, `publisher`; `organizationSchema` adds `foundingDate`, `founder`; `softwareApplicationSchema` adds `screenshot`; new `homepageFaqSchema()` and `personSchema()`
- `/app/page.js` — homepage FAQ included as JSON-LD
- `/app/sitemap.js` — `/about` added at priority 0.6
- `app/components/site-chrome.js` — "About" link in header and footer nav

---

## Phase 2 — Blog Content (DONE, 64 posts)

### Definitional / GEO anchors
- `what-is-llmnesia`
- `ai-chat-retrieval-explained`
- `ai-knowledge-base-vs-chat-history`
- `why-ai-chatbots-dont-remember-conversations`
- `ai-second-brain-chat-history`

### Platform-specific: search history
- `search-claude-conversation-history`
- `search-gemini-conversation-history`
- `search-grok-conversation-history`
- `search-deepseek-conversation-history`
- `search-perplexity-conversation-history`
- `search-microsoft-copilot-conversation-history`
- `search-mistral-conversation-history`
- `search-notebooklm-conversation-history`
- `search-meta-ai-conversation-history`
- `search-character-ai-conversation-history`
- `search-poe-conversation-history`
- `search-qwen-conversation-history`
- `search-kimi-conversation-history`
- `deepseek-grok-mistral-chat-history`

### Platform-specific: how to export
- `how-to-export-chatgpt-conversation-history`
- `how-to-export-claude-conversation-history`
- `how-to-export-gemini-conversation-history`
- `how-to-export-grok-conversation-history`
- `how-to-export-microsoft-copilot-conversation-history`
- `how-to-export-perplexity-conversation-history`

### Platform-specific: find old conversations
- `find-old-chatgpt-conversations`
- `how-to-find-old-claude-conversations`
- `how-to-find-old-gemini-conversations`
- `how-to-find-old-perplexity-conversations`

### Platform-specific: history not loading (fix posts)
- `chatgpt-history-not-loading-fix`
- `claude-history-not-loading-fix`
- `gemini-history-not-loading-fix`
- `grok-history-not-loading-fix`
- `perplexity-history-not-loading-fix`
- `microsoft-copilot-history-not-loading-fix`

### Platform-specific: recover deleted conversations
- `recover-deleted-chatgpt-conversation`
- `recover-deleted-claude-conversation`
- `recover-deleted-gemini-conversation`
- `recover-deleted-perplexity-conversation`

### Platform-specific: organise conversation history
- `how-to-organize-chatgpt-conversation-history`
- `how-to-organize-claude-conversation-history`
- `how-to-organize-gemini-conversation-history`

### Platform-specific: limits & comparisons
- `chatgpt-conversation-history-limits`
- `microsoft-copilot-conversation-history-limits`
- `chatgpt-memory-vs-conversation-history`
- `chatgpt-projects-vs-conversation-history`
- `chatgpt-vs-claude-conversation-history`
- `google-ai-studio-conversation-history`
- `pi-ai-conversation-history`

### Problem-aware / pain-point posts
- `ai-chat-history-broken-native-search`
- `how-to-backup-ai-conversations`
- `cross-llm-workflow-without-context-loss`
- `best-chrome-extensions-save-ai-conversations`

### Profession-specific use cases (blog)
- `ai-chat-history-for-lawyers`
- `ai-chat-history-for-marketers`
- `ai-chat-history-for-product-managers`
- `ai-chat-history-for-students`
- `ai-chat-history-for-teachers`
- `ai-chat-history-for-researchers`
- `ai-conversation-history-for-writers`
- `developer-ai-coding-assistant-history`

### Informational / commercial
- `local-first-ai-tools-privacy`
- `searchable-ai-prompt-library`
- `what-is-a-prompt-library`

---

## Phase 3 — GEO Content (DONE)

- `what-is-llmnesia` — declarative first paragraph, LLM-citable definition
- Homepage FAQ in `homepageFaqSchema()` JSON-LD
- `/app/llms-full.txt/route.js` — includes install URL, platform list, local-first explanation, inline FAQ items

---

## Phase 4 — Use-Case Pages (DONE)

All pages at `/use-cases/[slug]`:

| Slug | Audience | Status |
|------|----------|--------|
| `developers` | Software engineers | ✅ Rewritten (700-900w) |
| `founders` | Startup founders | ✅ Rewritten (700-900w) |
| `researchers` | Academic/independent researchers | ✅ Rewritten (700-900w) |
| `writers` | Writers & content creators | ✅ New |
| `consultants` | Consultants & freelancers | ✅ New |

---

## Phase 5 — Distribution (NOT STARTED)

### Chrome Web Store listing audit
- Audit the extension description to match `softwareApplicationSchema` language exactly
- Add screenshots showing multi-platform search results
- CWS listing is indexed by Google and cited by AI assistants — treat it as a landing page

### ProductHunt launch
- Tagline: "LLMnesia — free Chrome extension that searches your AI chat history across ChatGPT, Claude, Gemini and 10+ platforms. Local-first."
- Request reviewers mention "multi-platform" and "local-first" — these are the citation triggers LLMs extract from review aggregations

### Hacker News "Show HN"
- Technical framing: local indexing architecture, IndexedDB approach, why local-first matters at scale
- HN threads are indexed by AI crawlers and generate authoritative inbound links

### AI productivity newsletters
- Ben's Bites, The Rundown AI, TLDR AI — a feature mention is sufficient

---

## Compare Pages (13 pages)

All at `/compare/[slug]`:

- `llmnesia-vs-chatgpt-history`
- `llmnesia-vs-claude-projects`
- `llmnesia-vs-obsidian-ai-notes`
- `llmnesia-vs-notion-ai-notes`
- `llmnesia-vs-readwise`
- `llmnesia-vs-mem-ai`
- `llmnesia-vs-promptly`
- `llmnesia-vs-browser-bookmarks`
- `llmnesia-vs-superpower-chatgpt`
- `llmnesia-vs-chathub`
- `llmnesia-vs-chat-lens`
- `llmnesia-vs-chat-memo`
- `llmnesia-vs-perplexity-library`

---

## Remaining Content Opportunities

### Fix posts (extend the pattern)
- `deepseek-history-not-loading-fix`
- `notebooklm-history-not-loading-fix`

### Recover deleted (extend the pattern)
- `recover-deleted-grok-conversation`
- `recover-deleted-chatgpt-project`

### Organise history (extend the pattern)
- `how-to-organize-perplexity-conversation-history`

### Profession-specific (new audiences)
- `ai-chat-history-for-healthcare` — strong local-first/privacy angle
- `ai-chat-history-for-sales-teams` — CRM context, cross-platform
- `ai-chat-history-for-engineers` — distinct from developer post; focus on design/architecture decisions
- `ai-chat-history-for-hr-professionals` — privacy-sensitive audience

### How-to (extend the pattern)
- `how-to-find-old-grok-conversations`
- `how-to-find-old-microsoft-copilot-conversations`

### Informational / GEO
- `llmnesia-launch-update` — verifiable milestones post (publish once real user numbers exist)
- `ai-tools-for-academic-research` — broader informational, links to researchers use-case

---

## Weekly Cadence (ongoing)

- **Monday:** Publish one blog post
- **Thursday:** Publish second blog post or update an existing use-case/compare page (`updatedDate` + new FAQ or data point)
- **After each batch:** Verify new content appears in `https://llmnesia.com/sitemap.xml` and `https://llmnesia.com/llms.txt`

---

## Verification Checklist (per batch)

1. New posts appear in `https://llmnesia.com/sitemap.xml`
2. New posts appear in `https://llmnesia.com/llms.txt`
3. Per-post OG images render via `https://llmnesia.com/api/og?title=...`
4. JSON-LD validates in Google's Rich Results Test for at least one new post
5. Submit updated sitemap in Google Search Console
6. Check Perplexity: search "what is llmnesia" — verify definitional post is being cited

---

## Content Frontmatter Reference

Every MDX file requires these fields:

```yaml
title: ""
slug: ""
description: ""
publishDate: "YYYY-MM-DD"
updatedDate: "YYYY-MM-DD"
author: "Keiran Flynn"
primaryKeyword: ""
secondaryKeywords:
  - ""
intent: "informational" # or "how-to" or "commercial"
faq:
  - question: ""
    answer: ""
sources:
  - label: ""
    url: ""
canonicalPath: "/blog/slug"
category: "" # problem-solving | how-to | use-cases | informational
relatedSlugs:
  - "slug-without-type-prefix"
```

New MDX files auto-propagate to sitemap, RSS, and llms.txt on next deploy — no manual updates needed.
