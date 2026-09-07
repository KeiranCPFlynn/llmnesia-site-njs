import InstallLink from './install-link';

// Friendly display names for the platforms LLMnesia supports (Z.ai is supported
// but has no content pages yet, so it has no CTA token). Keys match the
// platform tokens produced by getCtaProps() in lib/content.js. Unsupported
// platforms are intentionally absent so their pages get generic, non-committal
// copy rather than a false "search your <platform>" claim.
const PLATFORM_LABELS = {
  copilot: 'Microsoft Copilot',
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  'claude-code': 'Claude Code',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  grok: 'Grok',
  perplexity: 'Perplexity',
  mistral: 'Mistral',
  qwen: 'Qwen',
  kimi: 'Kimi',
  'ai-studio': 'Google AI Studio',
  'character-ai': 'Character.AI'
};

// A person who searches for recovery help has two materially different needs:
// their chat may only be hidden, or it may be permanently deleted. Give them a
// fast route to rule out the first case before presenting prevention for future
// conversations. Each link stays platform-specific where we have a matching
// guide; the generic guide is deliberately used for broad loss articles.
const RECOVERY_SEARCH_GUIDES = {
  chatgpt: {
    href: '/blog/find-old-chatgpt-conversations',
    label: 'Not sure it was deleted? Find an older ChatGPT chat first.'
  },
  claude: {
    href: '/blog/how-to-find-old-claude-conversations',
    label: 'Not sure it was deleted? Find an older Claude chat first.'
  },
  'claude-code': {
    href: '/blog/how-to-find-an-old-claude-code-conversation',
    label: 'Not sure the session was deleted? Find an older Claude Code session first.'
  },
  gemini: {
    href: '/blog/how-to-find-old-gemini-conversations',
    label: 'Not sure it was deleted? Find an older Gemini chat first.'
  },
  grok: {
    href: '/blog/how-to-find-old-grok-conversations',
    label: 'Not sure it was deleted? Find an older Grok chat first.'
  },
  deepseek: {
    href: '/blog/how-to-find-old-deepseek-conversations',
    label: 'Not sure it was deleted? Find an older DeepSeek chat first.'
  },
  perplexity: {
    href: '/blog/how-to-find-old-perplexity-conversations',
    label: 'Not sure it was deleted? Find an older Perplexity thread first.'
  },
  copilot: {
    href: '/blog/how-to-find-old-microsoft-copilot-conversations',
    label: 'Not sure it was deleted? Find an older Copilot chat first.'
  },
  mistral: {
    href: '/blog/how-to-find-old-mistral-conversations',
    label: 'Not sure it was deleted? Find an older Mistral chat first.'
  },
  qwen: {
    href: '/blog/how-to-find-old-qwen-conversations',
    label: 'Not sure it was deleted? Find an older Qwen chat first.'
  },
  kimi: {
    href: '/blog/how-to-find-old-kimi-conversations',
    label: 'Not sure it was deleted? Find an older Kimi chat first.'
  },
  'character-ai': {
    href: '/blog/how-to-find-old-character-ai-conversations',
    label: 'Not sure it was deleted? Find an older Character.AI chat first.'
  }
};

const GENERIC_RECOVERY_SEARCH_GUIDE = {
  href: '/blog/why-cant-i-find-my-old-ai-conversations',
  label: 'Not sure it was deleted? Check the common reasons old AI chats go missing.'
};

// Returns a single framing sentence tuned to the page's intent family and, where
// known, its platform — so the CTA speaks to why the reader is on this page.
// Families come from getCtaFamily() in lib/content.js. Copy is plain and direct:
// no em dashes, no hype words.
function buildCopy(platform, family) {
  const label = PLATFORM_LABELS[platform];

  // Claude Code is a local source, not a website LLMnesia crawls, so the generic
  // "chats" / "even after one is deleted" framing does not fit. Speak to sessions
  // that live on the reader's own machine across the terminal, VS Code, and the
  // desktop app.
  if (platform === 'claude-code') {
    if (family === 'loss') {
      return `Install LLMnesia free so you never lose a Claude Code session again. It indexes your local sessions — from the terminal, the VS Code extension, and the desktop app — into one search, and lets you jump straight back into any of them.`;
    }
    return `Search every Claude Code session you have ever run — from the terminal, the VS Code extension, and the desktop app — from one box, indexed locally on your device alongside ChatGPT, Claude, Gemini and 10+ more.`;
  }

  if (family === 'loss') {
    return label
      ? `Prevent the next loss. LLMnesia saves and indexes every future ${label} chat locally as you use it, so a later deletion does not erase your searchable copy.`
      : `Prevent the next loss. LLMnesia saves and indexes future AI chats locally as you use them, so a later deletion does not erase your searchable copy.`;
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

  if (family === 'privacy') {
    return label
      ? `LLMnesia indexes your ${label} chats locally, on your own device. Nothing is uploaded, so there is nothing on a server for an employer, IT admin, or anyone else to pull.`
      : `LLMnesia indexes your AI chats locally, on your own device. Nothing is uploaded, so there is nothing on a server for an employer, IT admin, or anyone else to pull.`;
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
  const recoveryGuide = RECOVERY_SEARCH_GUIDES[platform] || GENERIC_RECOVERY_SEARCH_GUIDE;
  // Readers on loss/export pages have the exact permanent-backup pain Vault
  // solves, so surface a single subordinate teaser to them only. Other families
  // stay untouched, keeping the demo/CTA-order experiment on capability pages clean.
  const showVaultTeaser = family === 'loss' || family === 'export';
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
        {family === 'loss' && placement === 'inline' && (
          <a
            className="inline-install-cta__recovery-route"
            href={recoveryGuide.href}
            data-analytics="recovery_search_guide_click"
            data-analytics-platform={platform || 'generic'}
            {...(slug && { 'data-analytics-slug': slug })}
          >
            {recoveryGuide.label} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      <div className="inline-install-cta__action">
        {/* Desktop: lead with the native store for the visitor's browser. */}
        <div className="inline-install-cta__desktop">
          <InstallLink className="button button-large" utm={utm}>
            Add to Chrome — free
          </InstallLink>
          <p className="inline-install-cta__note">No account. No cloud. Your chats stay local.</p>
        </div>

        {/* Mobile: install is a dead end, so capture an email to send the link. */}
        <div className="inline-install-cta__mobile cta-email-capture">
          <p className="cta-email-capture__lead">
            LLMnesia is a desktop extension for Chrome and Edge. Email yourself the link for when you are at your
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
          {/* Two outcomes, two messages. The API reports whether the install
              email actually went out; site-behavior.js reveals the matching one
              so the success state never claims a delivery that did not happen. */}
          <div className="cta-email-capture__success" hidden>
            <p className="cta-email-capture__result" data-capture-result="sent" hidden>
              Check your inbox. We sent the LLMnesia install link so you can add it next time you
              are on your computer.
            </p>
            <p className="cta-email-capture__result" data-capture-result="fallback" hidden>
              Saved. The email did not go through, so here is the link for when you are at your
              computer:{' '}
              <InstallLink
                className="cta-email-capture__result-link"
                utm={{
                  utm_source: 'blog',
                  utm_medium: 'mobile_capture_fallback',
                  utm_campaign: 'mobile_install_link',
                  ...(slug && { utm_term: slug })
                }}
              >
                Add LLMnesia to Chrome
              </InstallLink>
            </p>
          </div>
        </div>
      </div>

      {showVaultTeaser && (
        <p className="inline-install-cta__vault" data-cta-vault={family}>
          Want it backed up and synced everywhere, automatically?{' '}
          <a href="/vault?utm_source=blog&utm_medium=inline_cta&utm_campaign=blog_vault_teaser">
            See LLMnesia Vault →
          </a>
        </p>
      )}
    </aside>
  );
}
