import InstallLink from './install-link';

// Friendly display names for the 11 platforms LLMnesia supports. Keys match the
// platform tokens produced by getCtaProps() in lib/content.js. Unsupported
// platforms are intentionally absent so their pages get generic, non-committal
// copy rather than a false "search your <platform>" claim.
const PLATFORM_LABELS = {
  copilot: 'Microsoft Copilot',
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  grok: 'Grok',
  perplexity: 'Perplexity',
  mistral: 'Mistral',
  qwen: 'Qwen',
  kimi: 'Kimi',
  'ai-studio': 'Google AI Studio'
};

// Returns a single framing sentence tuned to the page's intent family and, where
// known, its platform — so the CTA speaks to why the reader is on this page.
// Families come from getCtaFamily() in lib/content.js. Copy is plain and direct:
// no em dashes, no hype words.
function buildCopy(platform, family) {
  const label = PLATFORM_LABELS[platform];

  if (family === 'loss') {
    return label
      ? `Install LLMnesia free so this never happens again. It keeps a local copy of every ${label} chat automatically, even after one is deleted.`
      : `Install LLMnesia free so this never happens again. It keeps a local copy of every ChatGPT, Claude and Gemini chat automatically, even after one is deleted.`;
  }

  if (family === 'export') {
    return label
      ? `Skip the manual export. LLMnesia saves and indexes every ${label} conversation locally as you go, so you always own a copy.`
      : `Skip the manual export. LLMnesia saves and indexes every AI conversation locally as you go, so you always own a copy.`;
  }

  if (family === 'reliability') {
    return label
      ? `Never depend on ${label}'s servers for your history. LLMnesia keeps your own copy, indexed locally on your device.`
      : `Never depend on their servers for your history. LLMnesia keeps your own copy, indexed locally on your device.`;
  }

  // capability (search / organize / general) — the default family.
  return label
    ? `Search every ${label} chat you have ever had, instantly and locally, alongside ChatGPT, Claude, Gemini and 10+ more.`
    : `Search every ChatGPT, Claude and Gemini chat you have ever had, instantly and locally.`;
}

export default function InlineInstallCta({
  platform = null,
  family = 'capability',
  placement = 'inline',
  slug = null
}) {
  const framing = buildCopy(platform, family);
  const utm = {
    utm_source: 'blog',
    utm_medium: 'inline_cta',
    utm_campaign: 'blog_install_cta',
    // Segments installs by which page's CTA converted (e.g. copilot vs generic).
    utm_content: platform || 'generic',
    ...(slug && { utm_term: slug })
  };

  return (
    <aside
      className="inline-install-cta"
      aria-label="Install LLMnesia"
      data-cta-placement={placement}
      data-cta-family={family}
      {...(slug && { 'data-cta-slug': slug })}
    >
      <div className="inline-install-cta__body">
        <p className="inline-install-cta__title">{framing}</p>
      </div>

      <div className="inline-install-cta__action">
        {/* Desktop: the extension is Chrome-desktop only, so lead with install. */}
        <div className="inline-install-cta__desktop">
          <InstallLink className="button button-large" utm={utm}>
            Add to Chrome — free
          </InstallLink>
          <p className="inline-install-cta__note">No account. No cloud. Your chats stay local.</p>
        </div>

        {/* Mobile: install is a dead end, so capture an email to send the link. */}
        <div className="inline-install-cta__mobile cta-email-capture">
          <p className="cta-email-capture__lead">
            LLMnesia is a desktop Chrome extension. Email yourself the link for when you are at your
            computer.
          </p>
          <form className="cta-email-capture__form" noValidate>
            <div className="cta-email-capture__row">
              <input
                type="email"
                name="email"
                className="cta-email-capture__input"
                placeholder="you@example.com"
                required
                autoComplete="email"
                aria-label="Email address"
              />
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="form-honeypot"
                aria-hidden="true"
              />
              <button type="submit" className="button button-small cta-email-capture__submit">
                Email me the link
              </button>
            </div>
            <p className="cta-email-capture__msg" role="status" aria-live="polite">
              No spam. Just the install link.
            </p>
          </form>
          <div className="cta-email-capture__success" hidden>
            Check your inbox. We sent the LLMnesia link so you can add it next time you are on your
            computer.
          </div>
        </div>
      </div>
    </aside>
  );
}
