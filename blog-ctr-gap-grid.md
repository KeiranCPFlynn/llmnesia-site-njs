# Platform × action-intent gap grid

Source: GSC Pages.csv + Queries.csv (90 days to 2026-07-12). Content presence
checked against `content/blog/*.mdx`. Demand = summed impressions of
Queries.csv rows matching both the platform and the action intent.

Legend: `ok` = page exists · `MISS` = no page

| Platform | recover | export | search | organize | find-old |
|----------|:------:|:------:|:------:|:-------:|:-------:|
| ChatGPT | ok | ok | ok | ok | ok* |
| Claude | ok | ok | ok | ok | ok |
| Gemini | ok | ok | ok | ok | ok |
| Copilot | ok | ok | ok | ok | ok |
| Grok | ok | ok | ok | ok | ok |
| Perplexity | ok | ok | ok | ok | ok |
| DeepSeek | ok | ok | ok | ok | ok |
| Mistral | ok | ok | ok | ok | ok |
| Qwen | MISS | ok | ok | MISS | ok |
| Kimi | MISS | MISS | ok | MISS | ok |
| NotebookLM | MISS | MISS | ok | MISS | MISS |
| Meta AI | MISS | ok | ok | MISS | MISS |
| Poe | MISS | MISS | ok | MISS | ok |
| Character.AI | ok | MISS | ok | MISS | ok |

\* ChatGPT find-old exists at slug `find-old-chatgpt-conversations` (not the
`how-to-find-old-chatgpt-conversations` naming used elsewhere).

## Missing cells vs demonstrated demand

| Demand (impr / #queries) | Cell | Verdict |
|---|---|---|
| 27 / 2 | ChatGPT find-old | Already covered (`find-old-chatgpt-conversations`). Not a real gap. |
| 17 / 1 | NotebookLM export | Below threshold. Skip. |
| 0 / 0 | Qwen recover, Qwen organize | No demand. Skip. |
| 0 / 0 | Kimi recover / export / organize | No demand. Skip. |
| 0 / 0 | NotebookLM recover / organize / find-old | No demand. Skip. |
| 0 / 0 | Meta AI recover / organize / find-old | No demand. Skip. |
| 0 / 0 | Poe recover / export / organize | No demand. Skip. |
| 0 / 0 | Character.AI export / organize | No demand + platform not supported by the extension (do not imply LLMnesia searches Character.AI). Skip. |

## Conclusion

The core 8 platforms (ChatGPT, Claude, Gemini, Copilot, Grok, Perplexity,
DeepSeek, Mistral) are fully covered across all five action intents. Every
missing cell is a long-tail platform with **zero demonstrated query demand** in
Queries.csv. Under the brief's "demonstrated demand only" rule, **no new posts
are warranted.** Creating them would be speculative and, for Character.AI,
would contradict the product (not a supported platform).
