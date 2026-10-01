# ZCode discovery — paste-ready drafts

The site now has a `/zcode` landing page and a three-article ZCode cluster.
These drafts exist because citations and referrals come from answering where
ZCode users actually ask. Nothing here has been posted anywhere — paste when
you choose to; each is written to be useful first and promotional last.

## GitHub — zai-org/ZCode discussions / issues

Use when a discussion asks where sessions live, how to search them, or how to
back them up.

> ZCode keeps its session and task history locally under `~/.zcode` (SQLite
> databases, not plain-text files), so text tools like ripgrep can't search
> inside them. Quick options:
>
> - Browse recent sessions in ZCode's own history view.
> - Inspect a **copy** of the databases with `sqlite3` or DB Browser for SQLite.
> - I index mine with LLMnesia (free Chrome/Edge extension) — it reads the local
>   ZCode sessions and makes prompts + replies keyword-searchable next to my
>   Claude Code/Codex sessions and web chats. It also exposes the index over a
>   local MCP server, so ZCode itself can answer "what did we decide about X"
>   from past sessions. Write-up on storage layout:
>   https://www.llmnesia.com/blog/where-does-zcode-store-session-history

## Reddit — r/LocalLLaMA, r/ChatGPTCoding, ZCode threads

Comment-sized version for threads about coding-agent memory/history:

> Worth separating "memory" from "history" here. ZCode keeps every session on
> disk under ~/.zcode — nothing is lost, but it's SQLite, so grep finds nothing.
> I made mine searchable with LLMnesia (local index of prompts/replies only),
> and its MCP connection lets the agent itself search past sessions — I ask
> "where did we handle the retry logic?" mid-task instead of re-explaining.
> https://www.llmnesia.com/zcode

## Extension README — one line to add when the repo is next touched

> **ZCode users:** your local ZCode sessions are searchable too — see the
> [ZCode guide](https://www.llmnesia.com/zcode).

## Maintenance notes

- After publishing, consider `npm run indexnow` (or the dry run first) to ping
  the new URLs: `/zcode`, `/blog/where-does-zcode-store-session-history`,
  `/blog/search-zcode-session-history`, `/blog/how-to-find-an-old-zcode-session`.
- The three articles are in `DEMO_EXTRA_SLUGS` (lib/content.js); fold them into
  `blog-ctr-triage.csv` on the next GSC refresh, per the comment there.
- Watch GSC for emerging ZCode queries; the cluster should grow only on
  demonstrated demand (same rule as the platform gap grid).
