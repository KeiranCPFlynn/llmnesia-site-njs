// Small "Pro early access" band for pages whose visitors already work across
// several AI tools (MCP, Claude Code). English only: /teams is not translated.
// `slug` tags the click so we can see which page sends people to /teams.

export default function ProCallout({ slug }) {
  return (
    <aside className="pro-callout" aria-label="LLMnesia Pro early access">
      <div className="container pro-callout-inner">
        <div className="pro-callout-copy">
          <p className="pro-callout-tag">New · LLMnesia Pro</p>
          <p className="pro-callout-text">
            Working across several AIs? Pro keeps track of every project for you: what’s decided,
            what’s in progress, what’s next.
          </p>
        </div>
        <a
          className="pro-callout-link"
          href="/teams"
          data-analytics="pro_callout_click"
          data-analytics-slug={slug}
        >
          Join early access <span aria-hidden="true">→</span>
        </a>
      </div>
    </aside>
  );
}
