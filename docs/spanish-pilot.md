# Spanish website pilot, prepared 9 October 2026

**Status: local preparation complete; not deployed.** German is already live. Preview: http://127.0.0.1:3100/es and http://127.0.0.1:3100/es/installation.

## Scope

The homepage and installation guide use the original shared design, kinetic demos, compact language picker and existing forms. English, German and Spanish use one homepage template; German and Spanish share one guide component. The extension, Vault web app, external payment pages, videos and wider linked documentation remain English, disclosed on the page. Conversations retain their original language. Spanish semantic-search quality and cross-language search remain unverified.

The picker lists English, Deutsch and Español. A primary Spanish browser language or remembered Spanish choice can suggest Spanish on the English homepage. An explicit English choice dismisses suggestions. There is no IP lookup or forced redirect.

## Translation and review

The initial homepage/guide batch of 336 copy strings was translated once with DeepL’s quality-optimized model. International Spanish uses informal singular tú and neutral wording for Spain and Latin America. AI-assisted comparison and editorial corrections covered all source strings; there is no native human review. Corrected privacy mistranslations, form labels, comparison subjects, brand names, keyboard labels, avatar initials and inline demo markup. Review hashes bind the reviewed strings to their effective English source. Future source edits fail the build until reviewed.

The batch contained 22,938 source characters including markup and used **17,391 billable characters**. DeepL’s usage endpoint then reported **39,825 / 1,000,000 characters (3.98%)**, with **960,175 remaining**. The previous counter was 22,434. This is the allowance returned by the account, not a promise of recurring free use or an ROI measure. Page views and builds make no translation API calls.

## Measurement when released

Use the existing `localized_page_viewed`, `site_language_selected` and `install_click` events with `site_language=es`, the same page types and CTA positions. The guide link is `spanish_setup_guide_click`; store links use `utm_source=spanish_page`, `utm_campaign=spanish_pilot` and guide-specific `utm_content`. Production hosts only collect tracking; this local preview sends no events.

Follow [the measurement plan](localization-measurement.md). Website clicks indicate install intent, not completed installs. A Spanish release needs separate approval. Do not infer success from country totals or cheap translation alone.

## Verification

Production build, all 223 existing content exports, 3 shared homepage catalogs/designs, 2 shared guides, language preference checks, analytics checks and private Viewer tests passed. Desktop and mobile previews retained the kinetic demo and compact selector with no horizontal overflow. No form message, signup or purchase was submitted.

## Core pages prepared

The local Spanish preparation now also includes Vault, MCP, Pricing, About and Privacy Policy, using the shared English components. The on-site purchase widget has translated labels and feedback; the external app, account management and Stripe pages remain English. See [core-page-localization.md](core-page-localization.md) for the current scope, review, checks and latest usage. None of the Spanish routes has been deployed.
