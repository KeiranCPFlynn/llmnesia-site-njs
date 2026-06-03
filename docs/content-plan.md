# LLMnesia Content System: SEO + GEO Master Plan

This is the operating system for content on llmnesia.com. It exists so that any capable model can read this one document, see the full content universe as a set of grids, identify which cells are empty, and produce a publishable MDX file that fills a real gap.

**Product:** LLMnesia, a free, local-first Chrome extension that searches your AI chat history across ChatGPT, Claude, Gemini and 10+ platforms.
**Goal:** Chrome Web Store installs via organic search and LLM discovery (GEO).
**Approach:** Topical authority through patterned content volume, structured FAQ JSON-LD, declarative GEO-citable copy, and the local-first privacy angle as the differentiator.

## 1. How to use this plan

This document is built to be handed directly to an AI. The loop is:

1. Read Section 5 (the content grids). Each cell is `Done`, `Gap`, or `n/a`.
2. Pick the highest-priority `Gap`. Priority order: core-platform matrix gaps first, then compare gaps, then persona/use-case gaps, then informational/GEO gaps.
3. Confirm it is genuinely missing by checking the inventory in Section 4 (or the live `content/` directory).
4. Apply the judgment guardrail: only create a cell if that platform actually has the feature and the query has real search demand. If not, mark it `n/a` here instead of writing it.
5. Write the file using the Content Standard (Section 7), GEO Standard (Section 8) and the generation prompt in `docs/mdx-post-generation-prompt.md`.
6. Run the Per-Post Quality Bar (Section 9) and Technical Checklist (Section 10).
7. Save to `content/<type>/<slug>.mdx`, update the cell to `Done` here, and add the slug to Section 4.

One file per run. Finish it completely. New MDX auto-propagates to sitemap, RSS and llms.txt on deploy, so there is no manual record to sync beyond this plan.

**Two hand-off modes:**

- **Coding agent** (has repo access): runs the full loop, saves the `.mdx`, updates this plan. Use `docs/mdx-post-generation-prompt.md`.
- **One-off chat AI** (no repo access, cannot update records): paste `docs/standalone-content-prompt.md` as-is. It self-selects a gap by fetching the live `llms.txt` / `sitemap.xml` and diffing against the embedded pattern universe (falling back to an embedded snapshot if it cannot browse), then returns only MDX. You save the file and flip the cell yourself. Use a browsing-enabled model for best results.

> The build is strict. `lib/content.js` throws if any required field is missing or if `faq` or `sources` is empty. Every generated file must include all required frontmatter, a non-empty `faq`, and a non-empty `sources` array with real URLs. A post that omits these will fail the build.

## 2. Positioning and audience

**What LLMnesia is:** a browser extension that indexes your AI conversations locally as you browse, then lets you search the full text across every platform from one place. Nothing leaves your device.

**Differentiators to lead with (state concretely, never invent metrics):**

- Local-first: conversations are indexed in the browser, not uploaded to a server.
- Cross-platform: one search across ChatGPT, Claude, Gemini, Grok, DeepSeek, Perplexity, Copilot, Mistral and more.
- Full-text: searches message content, not just conversation titles (which is the native limitation on most platforms).
- Free Chrome extension; works across account tiers.

**Canonical facts:**

- Site: https://www.llmnesia.com
- Install: https://chromewebstore.google.com/detail/llmnesia/leekfgbdojiaabifbjbbgiiclannjdkf
- Author byline: Keiran Flynn (https://www.llmnesia.com/about)

**Readers / search intents:**

| Reader | Typical query |
|---|---|
| Someone who lost a specific AI conversation | "find old ChatGPT conversation", "claude history not loading" |
| Someone hitting native history limits | "chatgpt conversation history limits" |
| Someone wanting to export or back up chats | "how to export claude conversation history" |
| A professional who relies on AI daily | "ai chat history for lawyers" |
| Someone comparing tools | "llmnesia vs superpower chatgpt" |
| Someone researching the category | "what is ai chat retrieval", "local-first ai tools" |

## 3. Phase status

| Phase | Status | Notes |
|---|---|---|
| 1 — Technical SEO foundations | Done | OG image route, metadata helpers, JSON-LD (article, org, software, person, FAQ), dynamic llms.txt/llms-full.txt, related-links scoring |
| 2 — Blog content velocity | Done (ongoing) | 132 posts live |
| 3 — GEO content | Done (ongoing) | Definitional posts, homepage FAQ JSON-LD, llms-full.txt with install URL + FAQ |
| 4 — Use-case pages | Done (ongoing) | 5 pages live |
| 5 — Distribution & authority | Not started | See Section 11 |

Content production (Phases 2-4) is never "finished"; it is driven by the grids in Section 5.

## 4. Current inventory

- Blog: 132 posts in `content/blog/`.
- Compare: 13 pages in `content/compare/`.
- Use-cases: 5 pages in `content/use-cases/` (consultants, developers, founders, researchers, writers).

Treat the live `content/` directory as the source of truth; this number is a snapshot. When you publish, add the slug under the right grid in Section 5 and flip its cell to `Done`.

## 5. The content grids (gap engine)

### 5a. Platform × Action matrix (blog)

This is the primary gap engine. Rows are platforms; columns are the repeatable blog patterns. `Done` = published, `Gap` = worth writing, `n/a` = the platform lacks that feature or the query has no demand. Slug patterns:

- Search: `search-{platform}-conversation-history`
- Export: `how-to-export-{platform}-conversation-history`
- Find old: `how-to-find-old-{platform}-conversations`
- Fix: `{platform}-history-not-loading-fix`
- Recover: `recover-deleted-{platform}-conversation`
- Organize: `how-to-organize-{platform}-conversation-history`
- Limits: `{platform}-conversation-history-limits`

| Platform | Search | Export | Find old | Fix | Recover | Organize | Limits |
|---|---|---|---|---|---|---|---|
| ChatGPT | Done | Done | Done | Done | Done | Done | Done |
| Claude | Done | Done | Done | Done | Done | Done | Done |
| Gemini | Done | Done | Done | Done | Done | Done | Done |
| Grok | Done | Done | Done | Done | Done | Done | Done |
| DeepSeek | Done | Done | Done | Done | Done | Done | Done |
| Perplexity | Done | Done | Done | Done | Done | Done | Done |
| Microsoft Copilot | Done | Done | Done | Done | Done | Done | Done |
| Mistral | Done | Done | Done | Done | Done | Done | Done |
| NotebookLM | Done | n/a | **Gap** | Done | n/a | n/a | **Gap** |
| Meta AI | Done | Done | **Gap** | Done | n/a | n/a | Done |
| Character.AI | Done | n/a | Done | Done | Done | n/a | Done |
| Poe | obsolete | obsolete | obsolete | obsolete | obsolete | obsolete | obsolete |
| Qwen | Done | **Gap** | Done | Done | n/a | n/a | Done |
| Kimi | Done | n/a | Done | Done | n/a | n/a | Done |
| Pi | Done* | n/a | n/a | n/a | n/a | n/a | n/a |
| Google AI Studio | Done* | n/a | n/a | n/a | n/a | n/a | n/a |

`*` Pi and Google AI Studio are covered by single posts (`pi-ai-conversation-history`, `google-ai-studio-conversation-history`) rather than the search-prefixed slug.

Notes: Poe is considered obsolete and is no longer a content target; do not write new Poe posts. Meta AI "Find old" stays a Gap on paper but is effectively covered by `search-meta-ai-conversation-history` (titled "How to Find Old Meta AI Conversations"); a separate `how-to-find-old-meta-ai-conversations` slug would cannibalise it, so leave it unless that post is repositioned.

When adding a new platform (e.g. a newly popular LLM), add a row and treat every column as a `Gap` to evaluate against the guardrail.

### 5b. Cross-platform and "vs" posts (blog)

| Type | Examples present | Gaps to consider |
|---|---|---|
| Memory vs history | chatgpt, gemini, perplexity | claude-memory-vs-conversation-history (if Claude memory ships) |
| Projects/Spaces vs history | chatgpt-projects, claude-projects, perplexity-spaces, claude-artifacts | grok-vs equivalents only if a real feature exists |
| Head-to-head | chatgpt-vs-claude-conversation-history, deepseek-grok-mistral-chat-history | gemini-vs-chatgpt-conversation-history |

### 5c. Persona / profession posts (blog)

Pattern: `ai-chat-history-for-{profession}`. Present (22): accountants, content-creators, customer-support, data-scientists, designers, engineers, executives, finance-professionals, healthcare-professionals, hr-professionals, journalists, lawyers, marketers, product-managers, project-managers, real-estate-agents, recruiters, researchers, sales-teams, students, teachers, writers.

Gaps to consider (only where the audience genuinely relies on AI chat and would search this): analysts, consultants (currently a use-case page), virtual assistants, startup teams, academics, therapists/coaches, translators, paralegals, UX researchers.

### 5d. Informational / GEO anchors (blog)

Present: what-is-llmnesia, ai-chat-retrieval-explained, ai-knowledge-base-vs-chat-history, why-ai-chatbots-dont-remember-conversations, ai-second-brain-chat-history, ai-conversation-privacy-explained, local-first-ai-tools-privacy, ai-conversation-history-limits-compared, what-is-a-prompt-library, searchable-ai-prompt-library, how-to-backup-ai-conversations, ai-chat-history-backup-strategy, cross-llm-workflow-without-context-loss, how-to-search-multiple-ai-chatbots-at-once, team-ai-conversation-sharing, how-to-cite-ai-conversations-academic, how-to-organize-ai-conversations-for-work, best-chrome-extensions-save-ai-conversations.

Gaps to consider: are-ai-conversations-private, do-ai-chats-get-deleted, what-is-local-first-software, how-long-do-ai-platforms-keep-history, ai-chat-history-and-gdpr.

### 5e. Compare pages

Pattern: `llmnesia-vs-{competitor}`. Present (13): browser-bookmarks, chat-lens, chat-memo, chatgpt-history, chathub, claude-projects, mem-ai, notion-ai-notes, obsidian-ai-notes, perplexity-library, promptly, readwise, superpower-chatgpt.

Gaps to consider (verify the competitor is real and still active before writing): chatgpt-exporter, typingmind, pieces, recall-ai, glasp, saner-ai, msty, sider.

### 5f. Use-case pages

Pattern: `/use-cases/{audience}`, 700-900 words, deeper than a persona blog post. Present (5): consultants, developers, founders, researchers, writers.

Gaps to consider (promote the strongest persona-blog audiences into full use-case pages): students, lawyers, sales-teams, marketers, product-managers, customer-support.

## 6. Source principles

Operate from published guidance, not folklore:

- Google helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google AI features: https://developers.google.com/search/docs/appearance/ai-overviews
- Google structured data: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- OpenAI crawlers: https://platform.openai.com/docs/bots
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a

The same fundamentals drive both classic search and AI answers: crawlability, snippet eligibility, helpful content, accurate structured data. There is no separate trick for AI Overviews. FAQ JSON-LD and declarative definitions make passages easy for answer engines to extract and cite.

## 7. Content standard

Write to satisfy one real query per page. Depth comes from answering it better than competing pages, not from a word count.

**Depth guide:** platform/how-to posts 700-1,100 words; informational/explainer 900-1,400; compare and use-case pages 700-900.

**Canonical frontmatter** (every field below except `relatedSlugs` and `category` is required; the build fails without them):

```yaml
---
title: "Specific, search-friendly title"
slug: "url-slug"
description: "One to two sentences that state the core answer for searchers and humans."
publishDate: "YYYY-MM-DD"
updatedDate: "YYYY-MM-DD"
author: "Keiran Flynn"
primaryKeyword: "primary keyword"
secondaryKeywords:
  - "related query"
  - "related query"
intent: "informational"   # informational | how-to | commercial
faq:
  - question: "A real question people search?"
    answer: "Self-contained, citable answer."
sources:
  - label: "Source name"
    url: "https://..."
canonicalPath: "/blog/url-slug"   # must match type and slug
category: "platform-guides"        # see vocabulary below
relatedSlugs:
  - "a-related-slug"
---
```

- `intent` vocabulary: `informational`, `how-to`, `commercial`.
- `category` vocabulary in use: `platform-guides`, `how-to`, `problem-solving`, `use-cases`, `explainer`, `foundational`, `comparisons`, `persona-guides`, `workflows`.
- `canonicalPath` is `/{type}/{slug}` and must match the file's location and slug.
- `faq` and `sources` must be non-empty. Use real, relevant sources (the platform's own help centre, the LLMnesia site, a related on-site post).
- `relatedSlugs` are bare slugs (optionally `type/slug`); they drive the related-links module.

**Body structure** (the page template renders the title, so no top-level H1):

1. Open with the direct answer in the first paragraph (declarative, citable). For platform posts, name the native limitation up front.
2. 4-7 descriptive H2s matching how people search.
3. At least one comparison table or numbered method list.
4. Position LLMnesia as the cross-platform, local-first, full-text solution where it genuinely fits, without overselling.
5. Internal links: 2-4 to related posts, plus the install link where natural.
6. The FAQ from frontmatter is rendered as JSON-LD; questions should be ones people actually search.

**Voice:**

- Plain, practical, accurate. Explain the real native limitation before pitching the fix.
- No fabricated metrics or stories.
- No em dashes or en dashes. Use periods, commas, colons, semicolons or parentheses.
- Avoid filler: "unlock", "game-changer", "seamless", "in today's fast-paced world", "delve", "the bottom line".

## 8. GEO and LLM extraction standard

- Lead each post with a declarative definition or direct answer that can be quoted alone with attribution (e.g. "LLMnesia is a free, local-first Chrome extension that searches your AI chat history across ChatGPT, Claude, Gemini and 10+ platforms.").
- Keep the FAQ answers self-contained; they feed JSON-LD and are prime citation targets.
- Use the exact product description consistently so answer engines learn a stable definition.
- Update `llms.txt` / `llms-full.txt` only happens automatically via the dynamic routes; no manual edit needed, but verify after a pillar post.

## 9. Per-post quality bar

A file is ready when:

- It answers one specific query a reader from Section 2 would type.
- The first paragraph states the answer declaratively.
- It names the real native limitation (for platform posts) before positioning LLMnesia.
- It has all required frontmatter, a non-empty `faq` (4-6 questions), and a non-empty `sources` array with real URLs.
- `canonicalPath` matches the type and slug.
- It includes 2-4 internal links and the install link where natural.
- It has at least one comparison table or numbered method list.
- It carries no fabricated claims and no filler phrases.

## 10. Technical checklist (per file)

- [ ] Slug is short, descriptive, follows the relevant pattern in Section 5.
- [ ] All required frontmatter present; `faq` and `sources` non-empty.
- [ ] `canonicalPath` equals `/{type}/{slug}`.
- [ ] `publishDate` and `updatedDate` set (same date on first publish).
- [ ] `category` and `intent` use the allowed vocabulary.
- [ ] 2-4 internal links plus install link where natural.
- [ ] Builds cleanly (no thrown validation errors).
- [ ] After deploy: appears in `/sitemap.xml`, `/llms.txt`, and OG image renders via `/api/og?title=...`.

## 11. Phase 5 — Distribution and authority (not started)

- **Chrome Web Store listing:** align the description with `softwareApplicationSchema` language; add multi-platform search screenshots. The CWS page is indexed and cited by AI assistants; treat it as a landing page.
- **Product Hunt:** tagline leads with "free", "multi-platform", "local-first" (the citation triggers LLMs lift from review aggregations).
- **Hacker News Show HN:** technical framing of the local indexing / IndexedDB architecture and why local-first matters.
- **AI newsletters:** Ben's Bites, The Rundown AI, TLDR AI; a feature mention suffices.

## 12. Cadence and verification

**Weekly cadence:**

- Monday: publish one blog post (top `Gap` in Section 5).
- Thursday: publish a second post, or refresh an existing use-case/compare page (`updatedDate` + a new FAQ or data point).
- After each batch: confirm new content in `/sitemap.xml` and `/llms.txt`.

**Verification per batch:**

1. New posts appear in `https://www.llmnesia.com/sitemap.xml`.
2. New posts appear in `https://www.llmnesia.com/llms.txt`.
3. OG images render via `https://www.llmnesia.com/api/og?title=...`.
4. JSON-LD validates in Google's Rich Results Test for at least one new post.
5. Submit the updated sitemap in Google Search Console.
6. Spot-check an answer engine (e.g. "what is llmnesia") to confirm the definitional post is cited.
