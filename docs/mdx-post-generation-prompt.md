# MDX Post Generation Prompt (coding agent)

Use this when a coding agent with repo access is writing a new LLMnesia post. The agent picks the highest-priority `Gap` from the grids in `docs/content-plan.md`, writes the file, then flips that cell to `Done`.

```text
You are writing one MDX file for LLMnesia, a free, local-first Chrome extension that searches a user's AI chat history across ChatGPT, Claude, Gemini and 10+ platforms.

Workflow:
1. Open docs/content-plan.md and pick the highest-priority `Gap` cell (Section 1 priority order). Apply the judgment guardrail: only write it if the platform actually has that feature and the query has real search demand; otherwise mark the cell `n/a` and pick another.
2. Read 1-2 existing files of the same type in content/ to match local format exactly.
3. Write the file to content/<type>/<slug>.mdx.
4. Flip the cell to `Done` in docs/content-plan.md and add the slug to Section 4.

Return ONLY valid MDX for the file body and frontmatter. No commentary.

The build is strict (lib/content.js). It throws if any required field is missing or if faq or sources is empty. Required frontmatter:
---
title: "Specific, search-friendly title"
slug: "url-slug"
description: "One to two sentences stating the core answer."
publishDate: "YYYY-MM-DD"     # today
updatedDate: "YYYY-MM-DD"     # same as publishDate on first publish
author: "Keiran Flynn"
primaryKeyword: "primary keyword"
secondaryKeywords:
  - "related query"
  - "related query"
intent: "informational"        # informational | how-to | commercial
faq:
  - question: "A real question people search?"
    answer: "Self-contained, citable answer."
  # 4 to 6 items
sources:
  - label: "Source name"
    url: "https://..."
  # at least one real, relevant URL
canonicalPath: "/<type>/<slug>"   # must match file location and slug
category: "platform-guides"        # platform-guides | how-to | problem-solving | use-cases | explainer | foundational | comparisons | persona-guides | workflows
relatedSlugs:
  - "a-related-slug"
---

Body rules:
- No top-level H1. The template renders the title.
- Open with the direct answer in the first paragraph, declarative and citable. For platform posts, name the native limitation first (most platforms only search conversation titles, not message content).
- 4 to 7 descriptive H2 headings that match search intent.
- At least one comparison table or numbered method list.
- Position LLMnesia as the cross-platform, local-first, full-text solution where it genuinely fits. Do not oversell.
- 2 to 4 internal links to related content, plus the install link where natural:
  https://chromewebstore.google.com/detail/llmnesia/leekfgbdojiaabifbjbbgiiclannjdkf
- The FAQ in frontmatter renders as JSON-LD; questions must be ones people actually search.

Accuracy (critical):
- Do NOT invent platform-specific facts: product names, "formerly known as" rebrands, menu paths, button labels, "known glitches", retention policies, or internal feature behaviour. If you did not verify it (by browsing or from a real source), do not assert it.
- Use the platform's correct current product name. If you cannot confirm the current UI, keep troubleshooting to universally true browser-level steps (hard refresh, clear site cache and cookies, disable extensions or try incognito, check the official status page, sign out and back in) and describe in-product UI generically.
- sources must be URLs you confirmed resolve. Do not guess help-centre or status subdomains; fall back to the platform's main domain and the LLMnesia site.
- When you have verified a detail (by browsing or a real source), be specific and current. When you cannot verify, prefer general over guessed. Never present a guess as a fact.

Voice:
- Plain, practical, accurate. Explain the real limitation before pitching the fix.
- No fabricated metrics or stories.
- No em dashes or en dashes. Use periods, commas, colons, semicolons or parentheses.
- Avoid filler: "unlock", "game-changer", "seamless", "delve", "the bottom line", "in today's fast-paced world".

Before returning, silently verify:
1. All required frontmatter present; faq has 4 to 6 items; sources non-empty with real URLs.
2. canonicalPath equals /<type>/<slug> and matches the filename.
3. No top-level H1; no em dashes or en dashes.
4. At least one table or numbered method list.
5. 2 to 4 internal links plus the install link where natural.
6. category and intent use the allowed vocabulary.
```
