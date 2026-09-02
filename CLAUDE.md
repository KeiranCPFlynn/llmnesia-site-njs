# CLAUDE.md

## Changelog entries (`app/data/changelog.json`)

Entries here are the **public, summarised** version of a release — never copy
the extension repo's dev-facing `CHANGELOG.md` in verbatim. A sync script may
paste raw paragraph-length bullets straight in; treat that as a draft, not a
publish-ready entry, and always do a manual lean pass afterward.

- Default to `curated: true` + a single `summary` paragraph, no `highlights`
  array. Only use bulleted `highlights` when a release has 2+ genuinely
  headline-worthy features and itemized detail is explicitly wanted.
- One tight sentence per real feature — no setup/CLI instructions, command
  names, troubleshooting steps, or "here's how the fix works" narration. That
  belongs in docs, not release notes.
- Fold every reliability fix into one trailing clause naming 2-4 standouts,
  not one bullet per fix.
- Cut minor UI polish and growth nudges entirely (pixel tweaks, redesigned
  pills, "leave a review" prompts, new waitlist form fields) — not a user
  benefit, don't mention them even folded into a sentence.
- **Never name an unreleased or waitlist-only product/feature** (e.g. the
  desktop MCP integration, Vault) in the public changelog, even inside an
  otherwise-legitimate fix description. Describe the fix by its visible
  surface instead of the internal product name.
- Title = the headline in plain language. No "& N fixes" bullet-counting when
  there's no `highlights` array.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
