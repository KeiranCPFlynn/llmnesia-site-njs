# Site release preparation

When Keiran asks to prepare the site for the next extension release:

- Work directly on `main`. Do not create a release-preparation branch unless
  he explicitly asks for one or existing work makes isolation necessary.
- Assume the extension has already been submitted to the Chrome Web Store or
  is already live, with website publication imminent. Do not ask him to
  reconfirm this as a routine step.
- Prepare the changelog entry with `published: true` and `curated: true`,
  ready for the next production deployment. Use `published: false` only when
  he explicitly asks for a hidden draft or evidence shows publication must wait.
- Match the submitted or live release's actual contents. Curate a concise,
  complete summary rather than copying raw development notes.
- Run the relevant checks and make a focused local commit on `main`.

Preparing a release does not itself authorize pushing or deploying. Follow
Keiran's existing approval boundaries; an explicit request to push or make
the site live authorizes that action within the requested scope.

## Established production deployment workflow

- Pushing `main` to `origin` (`KeiranCPFlynn/llmnesia-site-njs` on GitHub)
  automatically triggers the Vercel production deployment for
  `https://www.llmnesia.com`. This is established configuration; do not
  rediscover or re-audit it for each routine release.
- A request to push the prepared site update authorizes that automatic live
  deployment. Do not ask for a separate deployment confirmation.
- After pushing, verify the deployment result and the changed public page.
  Checking completion is distinct from rechecking how deployment is configured.
- Revisit the configuration only when there is evidence it changed or a
  deployment failure requires investigation.

## Customer reply drafts

- Keep replies direct, warm and friendly. Avoid excessive apologies or guesses
  about how the customer feels.
- Address the actual LLMnesia question. Do not suggest unrelated tasks or
  offer to help import or export chats through another platform unless Keiran
  asks for that help.
- When asked to draft a customer email reply, save an unsent Gmail reply in
  the original email thread. Reply to the appropriate message and verify the
  sender, recipient, thread and saved draft. Do not create a standalone email
  or provide only chat text.
- Never send without Keiran's approval of the exact final draft and recipients.
