# Shared website localization

The English, German and prepared Spanish homepages render the same `Homepage` component and `content/index.template.html`. Language selects a catalog; it does not select another page design. All use the existing CSS, all 18 homepage sections, the kinetic demo, reveal animations, forms, platform lists and footer badges. German and Spanish installation guides render the same `LocalizedInstallation` component and shared homepage header/footer.

## Edit the site

- Change layout, classes, spacing, links or animation hooks in the shared template/CSS/components. That change reaches all homepages. Vault, MCP, Pricing and About use one shared `core-*.js` component per page, with English and locale routes as thin wrappers. The privacy policy keeps one shared HTML template.
- Change English copy in `content/locales/en.json`. Template slots such as `{{t:homepage.top.h1.1}}` identify the copy entry. IDs stay stable when text changes.
- Run `npm run translate:site -- --language=de --dry-run` to see the changed strings and bounded request size; run without `--dry-run` to translate them through the existing DeepL account.
- Review the changed locale strings against the effective English source. Preserve product meaning and the informal singular tone. Inline emphasis/icons are permitted in copy fragments, but tags, classes, attributes, URLs, keyboard labels and shared placeholders must retain their source structure. DeepL sometimes moves inline elements; correct those drafts during review.
- Record the SHA-256 of each reviewed final string in its `reviewedHash` in the locale’s `.translation.json`. A new or changed source requires review before the build passes.
- Run `npm run build` and `npm run test:site-language`, then inspect the changed layout at desktop and mobile widths.

The build rejects missing translations, changed source hashes, unreviewed text, changed inline markup/bindings and different homepage structures. The core-page checks also compare all five page structures across languages, canonical/hreflang URLs, same-page language switching, anchors, prices, policy identifiers and dates. It checks all 18 sections, headline emphasis and the kinetic-demo hooks. The English main content was also compared with the original template during this change and retained its original text and structure.

## Add a language

1. Add its code, native label, path, campaign prefix, language name, suggestion labels, localized chooser label and Open Graph locale to `SITE_LANGUAGES` in `lib/site-language.js`.
2. Add its JSON catalog to `content/locales/` and register it in `SITE_CATALOGS` in `lib/site-copy.js`. Use the English IDs; do not copy or fork the page template.
3. Use `npm run translate:site -- --language=CODE`, then review the text and its translation record. The generic script accepts registered languages, checks the existing allowance and saves each completed batch for review. The `translate:german` command remains as a convenience alias.
4. Create the locale's route as a thin wrapper that exports `homepageMetadata('CODE')` and renders `<Homepage language="CODE" />`, following `app/de/page.js`. Use a thin guide wrapper around `LocalizedInstallation` and `installationMetadata` when its content is ready, and set its `guidePath` in the language registry. This adds its homepage link, sitemap entry and exported document language; languages without a guide do not get a broken guide link.
5. Verify the exported page, metadata, translated content and layouts. Registering a language automatically adds it to the compact picker, equivalent-page alternate links, sitemap home routes and exported document-language step. New routes still need to exist before the build can succeed.

The picker is separate from the main menu. It shows only the current code and a globe; the dropdown contains native language names and can scroll as the list grows. It supports native keyboard interaction, Escape and outside-click dismissal. Adding an option does not widen the closed header control.

## Scope and truthful presentation

The homepage, installation guide and five core pages (Vault, MCP, Pricing, About and Privacy Policy) are prepared in German and Spanish. The on-site subscription widget is translated too; the extension, Vault web app, account-management page, external payment pages and wider documentation remain English. The original animated and static extension demos retain their English interface and examples, matching the actual product. Each localized hero’s support copy discloses the English interface and links to the localized installation guide. The search feature explains that target-language and cross-language semantic-search quality is unverified.

Form labels and client-side contact/signup messages use the selected catalog. Form destinations and submitted field values remain the existing ones. No test message or signup was submitted.

Language choices are remembered locally. The primary browser language or a remembered choice may suggest any registered language on the English homepage; there are no IP lookups or forced geographic redirects. Translations are prepared in advance, so builds and page views never call DeepL. The key stays in ignored `.env.local` and is not included in exported files.

## Prepared Spanish pilot

Spanish is prepared locally at `/es`, `/es/installation`, `/es/vault`, `/es/mcp`, `/es/pricing`, `/es/about` and `/es/privacy-policy`; it has not been deployed. Both share the existing design and the same tracking contract. `spanish_pilot` is its store campaign. The generic language suggestion supports `es-ES`, `es-MX` and `es-419` without geography-based redirects.

`translationSource` adapts only language-specific pilot disclosures (language name and landing-page URL), so Spanish does not inherit statements about a German guide. Source hashes use that effective source. All ordinary marketing copy stays shared. Build checks compare every registered homepage and localized guide’s structure, markup, keyboard labels and review hashes.

## Core-page localization expansion (9 October 2026)

`app/components/core-vault.js`, `core-mcp.js`, `core-pricing.js` and `core-about.js` render English, German and Spanish from the same layout. `core-privacy.js` fills the existing policy template. Copy lives in the same three catalogs; `siteHtml` preserves checked source markup and escapes dynamic price/platform bindings. `LOCALIZED_CORE_PAGES` registers equivalent routes for navigation, the compact picker, sitemap and document-language export. Changing language on a core page keeps that page. Untranslated documentation retains its existing English URL.

Translate larger updates in bounded groups, for example `npm run translate:site -- --language=de --prefix=privacy. --dry-run`. The prefix filter supports comma-separated prefixes, retains the 25,000-character cap and never discards other catalog entries. Review remains required after translating.

The on-page purchase widget receives only its copy map from the server. Authentication calls, entitlement checks, billing plans and Stripe destinations are unchanged. The loading state now provides the purchase anchor before hydration, and core-page help links lead to the corresponding localized homepage contact form. No valid email, sign-in code or payment was submitted during verification.

See [core-page-localization.md](core-page-localization.md) for routes, review and usage evidence. These additions are local and have not been deployed; the earlier German homepage/guide release remains the production baseline.
