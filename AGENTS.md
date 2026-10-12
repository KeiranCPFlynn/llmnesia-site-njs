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
