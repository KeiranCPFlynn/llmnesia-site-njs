# Homepage Pro bar and recovery article prompts, October 2026

Status: prepared on a branch. Record the deploy date and commit when published.

## Homepage

The homepage rebuild and site-wide Pro bar shipped on 27 October. GA4 install clicks per homepage view fell from 24.7 percent (117 of 473, 13 to 26 October) to 12.1 percent (13 of 107, 27 to 29 October). By button, hero fell from 16.3 to 8.4 percent and header from 8.0 to 3.7 percent. Three days is a thin sample and the event can repeat.

Change: remove the Pro bar from `content/index.template.html`, which is the homepage in every language. The More section still links to `/pro`, and every non-homepage page keeps the bar. Read after one full week, against 24.7 percent. If the rate does not recover, look at the rebuild itself and restore the bar.

## Recovery articles

These four articles already had install prompts, so this is a copy test, not new placement. The Google AI Mode article offers help with the history a reader has now and converts far better. The recovery articles offered protection for future chats only.

Change: frontmatter `ctaHeadline` and `ctaButtonLabel` on recover-deleted-claude, recover-deleted-chatgpt and chatgpt-conversation-disappeared; button label only on can-my-employer-see. No recovery of deleted chats is promised. Titles and descriptions are unchanged, so the snippet CTR experiment is not affected.

Read install clicks per view after two full weeks, against each page's prior four weeks.
