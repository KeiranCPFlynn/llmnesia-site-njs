import InstallLink from './install-link';

// Friendly display names for the platforms we publish guides about. Keys match
// the tokens produced by detectPlatform() in lib/content.js.
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
  notebooklm: 'NotebookLM',
  'character-ai': 'Character.AI',
  meta: 'Meta AI',
  'ai-studio': 'Google AI Studio',
  poe: 'Poe'
};

const GENERIC_TOOLS = 'ChatGPT, Claude, Gemini, Copilot and 10+ tools';

// Returns { title, text } tuned to the page's platform and intent so the CTA
// speaks to why the reader is here. `tone` is 'recovery' for deleted/missing/
// not-loading pages (loss-framed) and 'default' for find/search/organize pages
// (retrieval-framed).
function buildCopy(platform, tone) {
  const label = PLATFORM_LABELS[platform];

  if (tone === 'recovery') {
    if (label) {
      return {
        title: `Don't lose another ${label} answer`,
        text: `LLMnesia indexes your ${label} chats locally as you browse — so a deleted or vanished conversation stays searchable on your device, even after it's gone from ${label}.`
      };
    }
    return {
      title: "Don't lose another AI answer",
      text: `LLMnesia indexes your AI chats locally as you browse, so a deleted or vanished conversation stays searchable on your device. Works across ${GENERIC_TOOLS}.`
    };
  }

  if (label) {
    return {
      title: `Search your ${label} history instantly`,
      text: `LLMnesia adds private, full-text search across your ${label} conversations — plus ChatGPT, Claude, Gemini and 10+ tools — all indexed locally on your device.`
    };
  }

  return {
    title: 'Searching for an old AI answer?',
    text: `LLMnesia searches ${GENERIC_TOOLS} — privately on your device.`
  };
}

export default function InlineInstallCta({ platform = null, tone = 'default' }) {
  const copy = buildCopy(platform, tone);
  const utm = {
    utm_source: 'blog',
    utm_medium: 'inline_cta',
    utm_campaign: 'blog_install_cta',
    // Segments installs by which page's CTA converted (e.g. copilot vs generic).
    utm_content: platform || 'generic'
  };

  return (
    <aside className="inline-install-cta" aria-label="Install LLMnesia">
      <div className="inline-install-cta__body">
        <p className="inline-install-cta__title">{copy.title}</p>
        <p className="inline-install-cta__text">{copy.text}</p>
      </div>
      <div className="inline-install-cta__action">
        <InstallLink className="button button-large" utm={utm}>
          Install free Chrome extension
        </InstallLink>
        <p className="inline-install-cta__note">No account. No chat data leaves your device.</p>
      </div>
    </aside>
  );
}
