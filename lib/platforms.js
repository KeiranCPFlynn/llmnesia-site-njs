// Single source of truth for the AI platforms LLMnesia supports.
//
// Add a platform here when it ships and every derived figure updates on its own:
// the homepage "platforms indexed" stat, the meta description count, the hero
// "+ N more" overflow, the supported-platforms chip list, and the FAQ sentence.
// Names are the full, display-ready labels used in the chip list and prose.
//
// NOTE: local Claude Code session indexing is a separate capability, not a web
// platform, so it is deliberately NOT counted here — surface it with its own
// sentence wherever it is mentioned.
export const SUPPORTED_PLATFORMS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Perplexity',
  'Microsoft Copilot',
  'DeepSeek',
  'Grok',
  'Mistral',
  'Kimi',
  'Qwen',
  'Google AI Studio',
  'Character.AI',
  'Z.ai'
];

export const PLATFORM_COUNT = SUPPORTED_PLATFORMS.length;

// The subset with one-click history import (a backfill of chats you had before
// installing). Every platform is indexed automatically as you open chats; these
// are the ones that can also pull in your existing history in one go.
export const IMPORT_PLATFORMS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Perplexity',
  'DeepSeek',
  'Grok',
  'Character.AI',
  'Z.ai'
];

// The homepage hero names a curated handful of platforms inline, then links to
// "+ N more". Keep this in step with the inline <span>s in index.template.html.
export const HERO_NAMED_COUNT = 5;
export const HERO_OVERFLOW = PLATFORM_COUNT - HERO_NAMED_COUNT;

// "ChatGPT, Claude, … , and Character.AI" — an Oxford-comma sentence fragment.
export function platformListSentence(list = SUPPORTED_PLATFORMS) {
  if (list.length <= 1) return list.join('');
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}
