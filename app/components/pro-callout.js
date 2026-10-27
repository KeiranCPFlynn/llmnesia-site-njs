import { siteText } from '../../lib/site-copy';

// "Pro early access" band placed just under the hero on pages whose visitors
// already work across several AI tools (MCP, Claude Code). /pro is English
// only, so translated pages link to the English page with translated copy.
// `slug` tags the click so we can see which page sends people to /pro.

export default function ProCallout({ slug, language = 'en' }) {
  const t = (id) => siteText(`chrome.${id}`, language);
  return (
    <aside className="pro-callout" aria-label="LLMnesia Pro">
      <div className="container pro-callout-inner">
        <div className="pro-callout-copy">
          <p className="pro-callout-tag">{t('proBarTag')} · LLMnesia Pro</p>
          <p className="pro-callout-text">{t('proCalloutText')}</p>
        </div>
        <a
          className="pro-callout-link"
          href="/pro"
          data-analytics="pro_callout_click"
          data-analytics-slug={slug}
        >
          {t('proBarCta')} <span aria-hidden="true">→</span>
        </a>
      </div>
    </aside>
  );
}
