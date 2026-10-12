# Site release for extension 0.4.17

Published on 12 October 2026 with the user's approval: "make it live!"

- Live page: https://www.llmnesia.com/changelog
- Release-notes source: `cd410137e94641c509798a926ee61ae25556c519`
- Git branch: `codex/site-0.4.17`, pushed to origin.
- Existing Vercel project: `llmnesia-site-njs` (`prj_PdeeqYxiRqRNFKpO6pkXngd7nuNy`).
- Production deployment: `dpl_9UBHSpySm4MzKYjkGrzk5QDSCFud`.
- Deployment URL: https://llmnesia-site-f4glpr3hl-keiranflynns-projects.vercel.app
- Rollback: `dpl_5WzRD4GEuBPRqSjnaoa7grRUaP2G` at https://llmnesia-site-q98pdtndu-keiranflynns-projects.vercel.app.

The production artifact preserves the previous deployment and replaces only
the six changelog HTML and navigation-payload files generated from a clean
archive of the release-notes commit. Existing assets, other pages, routing,
functions and the private Google AI Mode test download were verified unchanged.
This preserves the already-live article instructions from `a99433c`, which
were not on `origin/main` when this release was prepared. A future deployment
from Git must preserve both those instructions and the private download.

Both the local build and clean production-environment build passed, including
static content and homepage/core localization checks. Public verification
confirmed 0.4.17 as the latest release with its complete title and summary.
The homepage, pricing, German and Spanish homepages, Google AI Mode article,
private test instructions and three sampled assets returned 200. The private
ZIP's HEAD request returned 200 with `noindex`; the apex changelog URL redirected
to the canonical www URL. No forms or emails were submitted.

Local deployment artifacts and verification receipts:
`/private/tmp/llmnesia-site-0417-live-7qoddkx1/`.
