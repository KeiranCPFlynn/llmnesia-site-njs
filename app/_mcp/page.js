// DORMANT — do not rename this folder from _mcp to mcp until MP-01 on
// docs/REVENUE_LAUNCH_BOARD.md lands (@llmnesia/mcp published to npm).
// The folder underscore-prefix keeps the route out of the build so other
// site updates can ship freely without exposing a page for a package that
// isn't installable yet. When MP-01 is done, rename _mcp/ back to mcp/
// and the route goes live. First-pass reviewed 2026-08-05; further polish
// expected before activation.

import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { softwareApplicationSchema, homepageFaqSchema } from '../../lib/schema';

export const metadata = buildPageMetadata({
  title: 'Search Your AI Chats From Claude, Cursor, Codex — LLMnesia MCP',
  description:
    'Give Claude Desktop, Cursor, Codex and other MCP clients access to every conversation the LLMnesia browser extension has captured — ChatGPT, Claude, Gemini, Character.AI and more. One command, everything local, your history searchable from any client.',
  canonicalPath: '/mcp'
});

const CTA_UTM = {
  utm_source: 'mcp_page',
  utm_medium: 'cta',
  utm_campaign: 'mcp_product'
};

const SETUP = [
  {
    kicker: 'Step 1',
    title: 'Capture with the extension',
    body: 'Install the LLMnesia browser extension and run a one-time backfill. After that, every conversation you have on a supported AI platform is added to your local corpus as you chat.',
    note: 'The corpus lives at ~/.llmnesia/corpus on your machine.'
  },
  {
    kicker: 'Step 2',
    title: 'Run one command',
    body: '`npx @llmnesia/mcp install` sets up the native host that bridges the extension to disk, detects which MCP clients you have, and registers the server with each of them.',
    note: 'Requires Node.js 22.13 or newer.'
  },
  {
    kicker: 'Step 3',
    title: 'Search from any client',
    body: 'Ask Claude, Cursor, Codex or the rest to search your history. They call the MCP server over stdio, the server reads your local corpus, and the results come back as tool output — no network calls, no cloud.',
    note: 'Works with Claude Code, Claude Desktop, Cursor, Codex and any stdio-speaking client.'
  }
];

const TOOLS = [
  {
    name: 'search_conversations',
    oneLine: 'Full-text search across every past conversation.',
    body: 'Returns ranked matches with highlighted snippets. Supports platform, title and date filters, plus a match_mode (any / all / phrase) for when a wrong hit matters — existence and frequency questions should use all or phrase.'
  },
  {
    name: 'get_conversation',
    oneLine: 'Fetch the full transcript of one conversation.',
    body: 'Takes the id from a search result and returns the ordered messages with role and text, in block-formatted form where available.'
  },
  {
    name: 'list_recent',
    oneLine: 'Most recently updated conversations, newest first.',
    body: 'Title, summary, platform, message count. The quick "what was I working on last week?" call.'
  },
  {
    name: 'corpus_status',
    oneLine: 'How current the corpus is.',
    body: 'Reports when the corpus last received data and how many conversations it holds. Use this when an expected conversation cannot be found — it tells a genuinely missing chat apart from a corpus that has stopped receiving updates.'
  },
  {
    name: 'save_conversation',
    oneLine: 'Add or update a conversation in the corpus.',
    body: 'So MCP is also an ingestion route, not only a read path. Keyed on docId — re-saving the same conversation updates it in place.'
  }
];

const CLIENTS = [
  {
    name: 'Claude Code',
    how: 'Runs `claude mcp add llmnesia -- llmnesia-mcp serve` automatically. The cleanest path — detect `claude` on PATH and shell out.'
  },
  {
    name: 'Claude Desktop',
    how: 'Edits `claude_desktop_config.json` at the standard OS-specific path. Backs up first.'
  },
  {
    name: 'Cursor',
    how: 'Edits `~/.cursor/mcp.json` with the same stdio block.'
  },
  {
    name: 'Codex',
    how: 'Prints a TOML block for `~/.codex/config.toml` — auto-editing TOML is too fragile to do silently.'
  },
  {
    name: 'Others',
    how: 'Windsurf, Zed, LM Studio and anything else accepting a stdio `command` + `args` spec: the installer prints the generic block for you to paste.'
  }
];

const FAQS = [
  {
    q: 'Do I need the browser extension?',
    a: 'Yes. The MCP package does not collect conversations on its own — it only reads the corpus that the LLMnesia browser extension builds. Without the extension, every search comes back empty. The extension is free on the Chrome Web Store and captures ChatGPT, Claude, Gemini, Character.AI, Grok, DeepSeek and the rest of the supported platforms as you chat.'
  },
  {
    q: 'Does anything leave my device?',
    a: 'No. The corpus, the search index, and the MCP server all stay on your machine. The only network call the extension makes is the limited, anonymised product analytics covered in the privacy policy — and that never includes conversation content, prompts, replies, or search queries. The MCP server itself makes zero network calls.'
  },
  {
    q: 'Which clients can reach the server?',
    a: 'Any MCP client that can spawn a local stdio process — Claude Code, Claude Desktop, Cursor, Codex, Windsurf, Zed, LM Studio and the rest. Cloud-only clients (web ChatGPT, Lovable, and similar) cannot reach a local stdio server. That is architectural, not a packaging gap, and no amount of repackaging changes it.'
  },
  {
    q: 'Why is Node 22.13 the minimum?',
    a: 'The search index uses Node\'s built-in `node:sqlite` module, which is unflagged from 22.13. That means no `--experimental-sqlite` in the spawn command and no native add-ons to compile on install — which is what used to turn a one-liner into a support ticket.'
  },
  {
    q: 'Is this the same thing as Vault?',
    a: 'No. Vault is the paid tier that syncs your corpus encrypted across your devices and lets you chat with your history from the browser and phone. The MCP server is free, local-only, desktop-only, and reads the corpus the extension builds on this machine. Same corpus, different experience — MCP for developers who live in their AI clients, Vault for anyone who wants their history everywhere.'
  }
];

export default function McpPage() {
  return (
    <SiteChrome minimalHeader headerCtaUtm={{ ...CTA_UTM, utm_medium: 'header_cta' }}>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd
        data={homepageFaqSchema(
          FAQS.map((item) => ({ question: item.q, answer: item.a }))
        )}
      />
      <main id="main-content" className="mcp-page">
        {/* Hero — what it does, the command front and centre */}
        <section className="section mcp-hero">
          <div className="container mcp-hero-inner">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              For MCP clients
            </p>
            <h1>
              Every AI conversation,{' '}
              <span className="text-gradient">searchable from any client.</span>
            </h1>
            <p className="subheadline mcp-hero-sub">
              LLMnesia captures your chats in the browser — ChatGPT, Claude, Gemini,
              Character.AI, and the rest. The MCP server lets Claude Desktop, Cursor,
              Codex and other clients search that corpus locally, over stdio. One
              command to install, everything stays on your machine.
            </p>

            <div className="mcp-cmd" aria-label="Install command">
              <span className="mcp-cmd-prompt" aria-hidden="true">$</span>
              <code>npx @llmnesia/mcp install</code>
            </div>

            <div className="mcp-hero-actions">
              <InstallLink className="button button-large" utm={CTA_UTM}>
                Get the extension — free
              </InstallLink>
              <a className="mcp-hero-secondary" href="https://www.npmjs.com/package/@llmnesia/mcp">
                View on npm →
              </a>
            </div>
            <p className="mcp-hero-note">
              The extension builds the corpus. The MCP package reads it. Both are local.
            </p>
          </div>
        </section>

        {/* Setup — the three steps, extension → command → search */}
        <section className="section mcp-setup">
          <div className="container">
            <p className="section-eyebrow">Set up in a minute</p>
            <h2>Three steps, end to end.</h2>
            <p className="section-intro">
              The extension captures. The MCP server exposes. Your client reads.
              Nothing in between.
            </p>
            <div className="card-grid mcp-setup-grid">
              {SETUP.map((step) => (
                <article className="card mcp-setup-card" key={step.title}>
                  <p className="mcp-setup-kicker">{step.kicker}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <p className="mcp-setup-note">{step.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Tools — the five tool calls, in plain language */}
        <section className="section mcp-tools">
          <div className="container">
            <p className="section-eyebrow">What the server exposes</p>
            <h2>Five tools over your corpus.</h2>
            <p className="section-intro">
              Every read tool carries a freshness block saying when the corpus last
              received data. Check it before concluding a conversation is missing.
            </p>
            <div className="mcp-tools-list">
              {TOOLS.map((tool) => (
                <article className="mcp-tool" key={tool.name}>
                  <div className="mcp-tool-head">
                    <code className="mcp-tool-name">{tool.name}</code>
                    <p className="mcp-tool-oneline">{tool.oneLine}</p>
                  </div>
                  <p className="mcp-tool-body">{tool.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Clients — the detection matrix */}
        <section className="section mcp-clients">
          <div className="container">
            <p className="section-eyebrow">What it detects</p>
            <h2>Wires itself into the clients you have.</h2>
            <p className="section-intro">
              <code>install</code> scans for each client before editing anything,
              asks for confirmation, and backs up any config file it touches. If a
              client you use isn't detected, the generic stdio block is printed
              for you to paste.
            </p>
            <div className="card-grid mcp-clients-grid">
              {CLIENTS.map((client) => (
                <article className="card mcp-client-card" key={client.name}>
                  <h3>{client.name}</h3>
                  <p>{client.how}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Tool call mockup — what a search result looks like */}
        <section className="section mcp-result">
          <div className="container mcp-result-inner">
            <div className="mcp-result-copy">
              <p className="section-eyebrow">What a tool call returns</p>
              <h2>The client searches. The corpus answers.</h2>
              <p className="section-intro">
                Ask your AI client to look something up and it calls{' '}
                <code>search_conversations</code>. The server scans your local corpus
                and returns ranked matches — title, snippet, platform, date — so the
                client can answer from your actual history instead of from scratch.
              </p>
            </div>

            <div className="mcp-mock" aria-label="Example search_conversations response">
              <div className="mcp-mock-head">
                <span className="mcp-mock-dots" aria-hidden="true">
                  <span className="mcp-mock-dot" />
                  <span className="mcp-mock-dot" />
                  <span className="mcp-mock-dot" />
                </span>
                <span className="mcp-mock-label">search_conversations</span>
              </div>
              <div className="mcp-mock-body">
                <div className="mcp-mock-query">
                  <span className="mcp-mock-key">query</span>
                  <span className="mcp-mock-val">"refresh token race condition"</span>
                </div>
                <article className="mcp-mock-hit">
                  <div className="mcp-mock-hit-top">
                    <h3>Fix flaky auth test</h3>
                    <span className="mcp-mock-tag">chatgpt</span>
                  </div>
                  <p className="mcp-mock-snippet">
                    "…the fix was awaiting the <mark>refresh</mark> before the test's
                    first request — the <mark>race condition</mark> was in the{' '}
                    <mark>token</mark> refresh, not the mock clock…"
                  </p>
                  <div className="mcp-mock-meta">
                    <span>score 0.8421</span>
                    <span>·</span>
                    <span>18 Jul 2026</span>
                    <span>·</span>
                    <span>assistant turn 4</span>
                  </div>
                </article>
                <article className="mcp-mock-hit mcp-mock-hit-dim">
                  <div className="mcp-mock-hit-top">
                    <h3>OAuth callback loop on Safari</h3>
                    <span className="mcp-mock-tag">claude</span>
                  </div>
                  <p className="mcp-mock-snippet">
                    "…<mark>refresh</mark> flow only worked when the tab was
                    foregrounded — Safari was suspending the <mark>token</mark>…"
                  </p>
                  <div className="mcp-mock-meta">
                    <span>score 0.6108</span>
                    <span>·</span>
                    <span>3 Jun 2026</span>
                  </div>
                </article>
                <div className="mcp-mock-footer">
                  <span>2 results</span>
                  <span>·</span>
                  <span>corpus: 1,284 conversations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — the five questions people actually ask */}
        <section className="section mcp-faq">
          <div className="container">
            <p className="section-eyebrow">Good to know</p>
            <h2>The essentials.</h2>
            <div className="faq-list mcp-faq-list">
              {FAQS.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section mcp-closing">
          <div className="container mcp-closing-inner">
            <h2>The corpus starts in the browser.</h2>
            <p className="section-intro">
              Install LLMnesia, run a backfill once, and every new conversation on a
              supported platform flows into your local corpus automatically. From
              there, any MCP client can search it.
            </p>
            <div className="mcp-hero-actions">
              <InstallLink
                className="button button-large"
                utm={{ ...CTA_UTM, utm_medium: 'cta_closing' }}
              >
                Get the extension — free
              </InstallLink>
              <a
                className="mcp-hero-secondary"
                href="https://www.npmjs.com/package/@llmnesia/mcp"
              >
                View the package on npm →
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
