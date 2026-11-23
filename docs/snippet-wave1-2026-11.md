# Snippet rewrite, wave 1 (G1), 23 November 2026

Task: rewrite the titles and descriptions of the nine low-click guides in
`docs/growth-plan-2026-11-23.md` (task G1). Branch: `growth/snippets-wave1`.
Local commit only; the founder deploys and the measurement clock starts on that
deploy date.

## What was changed

Only the `title` and `description` frontmatter fields were touched. No body
text, CTAs, URLs or `updatedDate` were modified. The rendered `<title>` appends
" | LLMnesia" (11 characters), so `Rendered` below is title length + 11.
Every claim in the new copy comes from the page's own article body; none
implies LLMnesia can recover chats it never saved.

### 1. recover-deleted-gemini-conversation

- Old title (37, rendered 48): Recover a Deleted Gemini Conversation
- New title (49, rendered 60): Deleted Gemini Chats: What Can Still Be Recovered
- Old description (161): Deleted a Gemini chat? Google also deletes its related activity. Check existing exports or saved copies, and distinguish missing history from permanent deletion.
- New description (150): Gemini has no undo: deleting a chat also deletes its related Gemini Apps Activity. Only a copy saved beforehand can restore it. Here is what to check.

### 2. google-ai-studio-conversation-history

- Old title (47, rendered 58): Google AI Studio Conversation History Explained
- New title (46, rendered 57): Where Google AI Studio Saves Your Chat History
- Old description (146): Find saved Google AI Studio chats, download their JSON files from Google Drive, and understand LLMnesia's manual capture and local import options.
- New description (143): Saved AI Studio chats appear in History or Library and they are stored as JSON files in a Google Drive folder. Find them and download a backup.

### 3. recover-deleted-grok-conversation

- Old title (60, rendered 71): Recover Deleted Grok Conversations in 2026: What Still Works
- New title (44, rendered 55): Deleted Grok Chats: No Undo, But Check These
- Old description (158): Can you recover a deleted Grok conversation? Usually not after deletion, but these immediate checks, existing backups, and prevention steps are worth knowing.
- New description (154): Grok has no trash folder, so deleted conversations cannot be restored. Act fast on the browser cache window, then check backups of chats saved beforehand.

### 4. why-cant-i-find-my-old-ai-conversations

- Old title (70, rendered 81): Why Can't I Find My Old AI Conversations? The Real Reasons and the Fix
- New title (49, rendered 60): Can't Find Old AI Chats? They're Not Usually Gone
- Old description (183): If you can never find old ChatGPT, Claude, or Gemini chats, it is usually not your memory. Native history searches titles, not content. Here is why, and how to fix retrieval for good.
- New description (149): ChatGPT, Claude and Gemini search titles only, not message content. Your chats are usually still there. Here is why you can't find them, and the fix.

### 5. find-old-chatgpt-conversations

- Old title (35, rendered 46): Find Old ChatGPT Conversations Fast
- New title (42, rendered 53): 6 Ways to Find an Old ChatGPT Conversation
- Old description (140): Cannot find an old ChatGPT chat? See exactly where past conversations hide and how to search them in seconds, even across hundreds of chats.
- New description (133): ChatGPT's search matches titles only. Six ways to find an old chat: smarter search terms, browser history, the data export, and more.

### 6. why-ai-chatbots-dont-remember-conversations

- Old title (44, rendered 55): Why AI Chatbots Don't Remember Conversations
- New title (47, rendered 58): Why Chatbots Forget: Context Windows, Explained
- Old description (151): ChatGPT, Claude, and Gemini forget past chats because of how context windows work. Here is why it happens, and how to keep your conversations findable.
- New description (137): Chatbots have no long-term memory: each new chat starts with an empty context window. Here is why, and how to keep past answers findable.

### 7. grok-conversation-history-limits

- Old title (60, rendered 71): Grok Conversation History Limits: Retention, Search & Export
- New title (42, rendered 53): How Long Does Grok Keep Your Chat History?
- Old description (146): Grok publishes no fixed chat-retention limit. See what is saved, what account loss changes, and where to search, export, or back up conversations.
- New description (142): Grok publishes no retention cap, and your history depends on your X account staying active. What is stored, and when you should export a copy.

## Pages skipped

Two of the nine pages had their `title` or `description` changed after
2026-10-25 (both in commit `640e121`, 2026-10-26), so the plan says skip them:

- search-gemini-conversation-history (27,253 impressions, 0.18% CTR, position
  7.1): title and description rewritten on 26 October 2026. Its current
  measurement window is still young, so it keeps its new copy untouched.
- gemini-conversation-history-limits (12,377 impressions, 0.19% CTR, position
  5.6): title and description rewritten on 26 October 2026, same commit.

None of the seven experiment pages listed as untouchable were edited
(recover-deleted-chatgpt-conversation, recover-deleted-claude-conversation,
does-chatgpt-keep-deleted-conversations, chatgpt-conversation-disappeared,
how-to-find-old-character-ai-conversations, google-ai-mode-history,
how-to-find-an-old-claude-code-conversation).

## Check

`npm run build` (with `nice -n 15`) passed on 23 November 2026: Next.js build
succeeded, static content export checks passed for 225 content routes and the
German pilot, homepage localization checks passed for 3 languages and 275 copy
slots, and core localization checks passed for 15 pages.

## Founder decisions

1. Deploy the `growth/snippets-wave1` branch to the site when happy with the
   copy. Note the deploy date; the four-week measurement window for these
   seven pages starts then.
2. The two skipped pages (search-gemini-conversation-history,
   gemini-conversation-history-limits) were already rewritten on 26 October.
   Decide after the S1 experiment read whether they need another pass.
