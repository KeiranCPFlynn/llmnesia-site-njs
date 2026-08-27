import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { softwareApplicationSchema, homepageFaqSchema } from '../../lib/schema';

export const metadata = buildPageMetadata({
  title: 'Search Your Claude Code Sessions — LLMnesia',
  description:
    'LLMnesia indexes your local Claude Code sessions — from the terminal, the VS Code extension, and the desktop app — into one search, alongside your ChatGPT, Claude and Gemini chats. Point it at a folder, search, and it hands you the command to resume any session. Free, local, no account.',
  canonicalPath: '/claude-code'
});

const CTA_UTM = {
  utm_source: 'claude_code_page',
  utm_medium: 'cta',
  utm_campaign: 'claude_code_product'
};

const SETUP = [
  {
    kicker: 'Option A',
    title: 'Point it at your folder',
    body: 'Open LLMnesia, choose your Claude Code sessions folder — ~/.claude/projects — and it indexes every session already on disk. One click, and your whole history is searchable.',
    note: 'Best if you just want to search what you already have.'
  },
  {
    kicker: 'Option B',
    title: 'Install the background helper',
    body: 'Add the optional helper once and LLMnesia keeps itself in sync. Start a new Claude Code session in the terminal, VS Code, or the desktop app and it turns up in search on its own — nothing to re-import.',
    note: 'Best if you live in Claude Code every day.'
  }
];

const FAQS = [
  {
    q: 'Which Claude Code sessions does it index?',
    a: 'All of them, from every surface — the terminal CLI, the VS Code extension, and the desktop app. They all write sessions under ~/.claude/projects, and LLMnesia reads that one folder, so a single search covers everywhere you run Claude Code.'
  },
  {
    q: 'What exactly gets indexed?',
    a: 'Only your prompts and Claude’s replies. File reads, shell commands, and tool output are left out, so search results read like a clean transcript, not raw logs. That index lives in your browser’s local storage and is never uploaded anywhere.'
  },
  {
    q: 'Does anything leave my device?',
    a: 'Your sessions, prompts, replies, and search index never do — they stay in local browser storage, full stop. LLMnesia does send limited, anonymized product analytics to PostHog (extension version, which features you use, error categories, an anonymous install ID) so we can fix bugs and see what’s useful. It never includes conversation content, prompts, replies, or search queries. Full detail in the',
    aLink: { text: 'privacy policy', href: '/privacy-policy' }
  },
  {
    q: 'Does it work with my web AI chats too?',
    a: 'Yes. The same index also covers ChatGPT, Claude, Gemini and 10+ more, so one search spans your terminal sessions and your browser chats together — not a separate tool for each.'
  }
];

export default function ClaudeCodePage() {
  return (
    <SiteChrome minimalHeader headerCtaUtm={{ ...CTA_UTM, utm_medium: 'header_cta' }}>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd
        data={homepageFaqSchema(
          FAQS.map((item) => ({
            question: item.q,
            answer: item.aLink ? `${item.a} ${item.aLink.text}.` : item.a
          }))
        )}
      />
      <main id="main-content" className="cc-page">
        {/* Hero — what it does, in one line, with the install right there */}
        <section className="section cc-hero">
          <div className="container cc-hero-inner">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              For Claude Code
            </p>
            <h1>
              Every Claude Code session,{' '}
              <span className="text-gradient">searchable from one box.</span>
            </h1>
            <p className="subheadline cc-hero-sub">
              Your sessions are split across the terminal, VS Code, and the desktop app — and
              separate from your web chats. LLMnesia indexes all of them locally into one
              search, and hands you the command to resume any session in the right folder. Codex
              sessions are supported too. Want your desktop AI to search all of this history for
              you? <a href="/mcp">See the free MCP connection.</a>
            </p>
            <div className="cc-hero-actions">
              <InstallLink className="button button-large" utm={CTA_UTM}>
                Add to Chrome — free
              </InstallLink>
              <a className="cc-hero-guide" href="/blog/where-does-claude-code-store-history">
                Where are the files? Read the guide →
              </a>
            </div>
            <p className="cc-hero-note">No account. No cloud. Your sessions stay on your device.</p>
          </div>
        </section>

        {/* Setup — the two ways in */}
        <section className="section cc-setup">
          <div className="container">
            <p className="section-eyebrow">Set up in a minute</p>
            <h2>Two ways to get your sessions in.</h2>
            <div className="card-grid cc-setup-grid">
              {SETUP.map((step) => (
                <article className="card cc-setup-card" key={step.title}>
                  <p className="cc-setup-kicker">{step.kicker}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <p className="cc-setup-note">{step.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Result — one look at what a search returns, and the resume command */}
        <section className="section cc-result">
          <div className="container cc-result-inner">
            <div className="cc-result-copy">
              <p className="section-eyebrow">What a result looks like</p>
              <h2>Find the session, get the command.</h2>
              <p className="section-intro">
                Search a phrase you remember — a function name, an error, a decision you talked
                through. Every match shows which project and app it came from. Open it in the
                Claude desktop app, or copy the ready-to-run command that resumes that exact
                session in the right folder.
              </p>
            </div>

            <div className="cc-mock" aria-label="Example LLMnesia search result for a Claude Code session">
              <div className="cc-mock-head">
                <span className="cc-mock-dots" aria-hidden="true">
                  <span className="cc-mock-dot" />
                  <span className="cc-mock-dot" />
                  <span className="cc-mock-dot" />
                </span>
                <span className="cc-mock-search">refresh token race condition</span>
              </div>
              <div className="cc-mock-body">
                <article className="cc-mock-result">
                  <div className="cc-mock-result-top">
                    <h3>Fix flaky auth test</h3>
                    <span className="cc-mock-tag">Claude Code</span>
                  </div>
                  <p className="cc-mock-snippet">
                    “…the fix was awaiting the <mark>refresh</mark> before the test’s first
                    request — the <mark>race condition</mark> was in the{' '}
                    <mark>token</mark> refresh, not the mock clock…”
                  </p>
                  <div className="cc-mock-meta">
                    <span>~/projects/api-server</span>
                    <span>·</span>
                    <span>terminal</span>
                    <span>·</span>
                    <span>18 Jul 2026</span>
                  </div>
                  <div className="cc-mock-cmd">
                    <span className="cc-mock-cmd-label">Resume</span>
                    <code>cd ~/projects/api-server &amp;&amp; claude --resume e44171ac-b4be-4426-b9b6-c15435a0aca1</code>
                    <span className="cc-mock-copy" aria-hidden="true">Copy</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — the three questions people actually ask */}
        <section className="section cc-faq">
          <div className="container">
            <p className="section-eyebrow">Good to know</p>
            <h2>The essentials.</h2>
            <div className="faq-list cc-faq-list">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>
                    {item.a}
                    {item.aLink ? (
                      <>
                        {' '}
                        <a href={item.aLink.href}>{item.aLink.text}</a>.
                      </>
                    ) : null}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section cc-closing">
          <div className="container cc-closing-inner">
            <h2>Stop hunting through three apps for one session.</h2>
            <p className="section-intro">
              Install LLMnesia, point it at your sessions, and search every Claude Code
              conversation — and your web chats — from one box. Free, local, no account.
            </p>
            <div className="cc-hero-actions">
              <InstallLink className="button button-large" utm={{ ...CTA_UTM, utm_medium: 'cta_closing' }}>
                Add to Chrome — free
              </InstallLink>
              <a
                className="cc-hero-guide"
                href="/blog/search-claude-code-conversation-history"
              >
                The full how-to guide →
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
