import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { personSchema, organizationSchema } from '../../lib/schema';
import { absoluteUrl } from '../../lib/site';

export const metadata = buildPageMetadata({
  title: 'About Keiran Flynn — Founder of LLMnesia',
  description:
    'Keiran Flynn is the founder of LLMnesia, a local-first Chrome extension for searching AI chat history across ChatGPT, Claude, Gemini, and 10+ platforms.',
  canonicalPath: '/about'
});

const founder = personSchema({
  name: 'Keiran Flynn',
  url: absoluteUrl('/about'),
  description:
    'Keiran Flynn is the founder of LLMnesia, a local-first Chrome extension that indexes and searches AI conversations across ChatGPT, Claude, Gemini, and other platforms.',
  sameAs: [
    absoluteUrl('/'),
    'https://chromewebstore.google.com/detail/llmnesia/leekfgbdojiaabifbjbbgiiclannjdkf'
  ]
});

export default function AboutPage() {
  return (
    <SiteChrome>
      <JsonLd data={founder} />
      <JsonLd data={organizationSchema()} />

      <main id="main-content" className="section container content-main">
        <nav className="content-breadcrumb" aria-label="Breadcrumb">
          <span><a href="/">Home</a></span>
          <span>
            <span className="content-meta-sep" aria-hidden="true">/ </span>
            <a href="/about">About</a>
          </span>
        </nav>

        <article className="content-article">
          <header className="content-header">
            <div className="content-type-badges">
              <span className="content-type-badge">About</span>
            </div>
            <h1>About <span className="text-gradient">LLMnesia</span></h1>
            <p className="answer-first">
              LLMnesia is a free Chrome extension that automatically indexes AI conversations
              from ChatGPT, Claude, Gemini, and 10+ other platforms locally in your browser.
              No cloud sync. No account required. Search old prompts, answers, and decisions
              instantly.
            </p>
          </header>

          <div className="content-body">
            <h2>What is LLMnesia?</h2>
            <p>
              LLMnesia is a local-first browser extension built for people who work across
              multiple AI platforms daily. It runs in the background, indexing your conversations
              as you browse supported AI tools. When you need to find something — a solution you
              got three weeks ago, a decision you documented in a prompt, a code snippet you
              asked Claude to write — you search and it&apos;s there in seconds.
            </p>
            <p>
              Everything stays on your device. LLMnesia uses your browser&apos;s local storage
              to build and maintain the index. None of your conversations, queries, or data are
              sent to external servers.
            </p>

            <h2>Supported platforms</h2>
            <p>
              LLMnesia currently indexes conversations from: <strong>ChatGPT</strong>,{' '}
              <strong>Claude</strong>, <strong>Gemini</strong>, <strong>Perplexity</strong>,{' '}
              <strong>DeepSeek</strong>, <strong>Grok</strong>, <strong>Mistral</strong>,{' '}
              <strong>Kimi</strong>, <strong>Qwen</strong>, and{' '}
              <strong>Google AI Studio</strong>. Additional integrations are in progress.
            </p>

            <h2>How it works</h2>
            <p>
              When you visit a supported AI platform, LLMnesia reads the page content and
              stores a local index entry in your browser using the IndexedDB and{' '}
              <code>chrome.storage.local</code> APIs. The index is built incrementally —
              no bulk export or setup required. Search results are returned by querying that
              local index, so results appear immediately without any network request.
            </p>

            <h2>Why Keiran built it</h2>
            <blockquote>
              <p>
                I use AI constantly across ChatGPT, Claude, Gemini and other tools. I kept
                having the same frustrating experience: I knew I&apos;d already solved something,
                but I couldn&apos;t remember where. Useful prompts, answers, ideas, and decisions
                were disappearing into chat history. I built LLMnesia to fix that for myself.
                Now I&apos;m opening it up to other people who work the same way.
              </p>
              <footer>— Keiran Flynn, Founder</footer>
            </blockquote>

            <h2>Privacy commitment</h2>
            <p>
              The local-first architecture is not a feature — it&apos;s a constraint that
              shapes every technical decision. User conversation data never touches LLMnesia
              servers because there is no mechanism for it to do so. You can verify this by
              reviewing the extension in the Chrome Web Store or inspecting the network
              requests it makes (it makes none to llmnesia.com for indexing or search).
            </p>
            <p>
              You can clear all indexed data at any time from the extension settings.
              You can also export your conversation index in a portable format.
            </p>

            <h2>Contact</h2>
            <p>
              For bugs, questions, or feedback, use the{' '}
              <a href="/#contact">contact form on the homepage</a>. Messages go directly
              to the founder inbox.
            </p>
          </div>

          <div className="content-bottom-cta">
            <h2>Try LLMnesia free</h2>
            <p>
              Installs in seconds. No account, no setup, no data leaving your browser.
            </p>
            <InstallLink className="button button-large" />
          </div>
        </article>
      </main>
    </SiteChrome>
  );
}
