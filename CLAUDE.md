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
