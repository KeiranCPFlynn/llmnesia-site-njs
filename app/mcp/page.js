import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { softwareApplicationSchema, homepageFaqSchema } from '../../lib/schema';

export const metadata = buildPageMetadata({
  title: 'Use Your AI Chat History in Claude, Cursor & Codex — LLMnesia MCP',
  description:
    'Let Claude Desktop, Cursor, Codex and other desktop AI apps search the conversations LLMnesia has captured across ChatGPT, Claude, Gemini and more. Local setup, linked sources, no conversation uploads.',
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
    title: 'Build your private history',
    body: 'Install LLMnesia and import the older chats you want available. New conversations from supported AI platforms are captured automatically as you use them.',
    note: 'Your searchable archive stays on this computer.'
  },
  {
    kicker: 'Step 2',
    title: 'Follow the guided connection',
    body: 'Open LLMnesia → Full settings → Connect desktop AI. Enable automatic sync, install Node.js if prompted, then copy the complete command into PowerShell on Windows or Terminal on macOS.',
    note: 'Follow every step shown for your computer. Windows Claude Desktop users have one additional guided step.'
  },
  {
    kicker: 'Step 3',
    title: 'Restart, then ask naturally',
    body: 'Fully quit and reopen the browser and connected AI app when Settings tells you to. Then ask what you decided, where you solved a problem, or what you discussed before.',
    note: 'Answers include links back to the original chats whenever those links are available.'
  }
];

const USE_CASES = [
  {
    name: 'Revisit an important decision',
    oneLine: '“Why did we choose an invite-only beta?”',
    body: 'Bring back the options, trade-offs, and decision you reached without remembering which AI app or conversation contained it.'
  },
  {
    name: 'Resume a complex project',
    oneLine: '“Where did I leave off planning the migration?”',
    body: 'Find the latest useful thread, recover what you already worked through, and continue from the next step instead of reconstructing the whole project.'
  },
  {
    name: 'Reuse research across tools',
    oneLine: '“Pull together what I learned about local-first apps.”',
    body: 'Combine useful context from ChatGPT, Claude, Gemini, and other supported sessions into one sourced answer you can inspect.'
  },
  {
    name: 'Reuse your working preferences',
    oneLine: '“What does my preferred project brief look like?”',
    body: 'Recover the formats, patterns, and preferences you have already established. Suggested memories remain under your review and control.'
  }
];

const CLIENTS = [
  {
    name: 'Claude Code',
    how: 'Connected automatically for your user account when Claude Code is installed.'
  },
  {
    name: 'Claude Desktop',
    how: 'Connected automatically on macOS. Windows users get one additional guided Claude extension step.'
  },
  {
    name: 'Cursor',
    how: 'Connected automatically, with existing settings preserved and backed up.'
  },
  {
    name: 'Codex',
    how: 'Connected through the Codex CLI, including the copy bundled with supported desktop apps.'
  },
  {
    name: 'Other desktop clients',
    how: 'For other local MCP apps, setup prints a standard connection block you can paste into their settings.'
  }
];

const FAQS = [
  {
    q: 'Do I need the browser extension?',
    a: 'Yes. The MCP package does not collect conversations on its own — it only reads the corpus that the LLMnesia browser extension builds. Without the extension, every search comes back empty. The extension is free for Chrome and Microsoft Edge and captures ChatGPT, Claude, Gemini, Character.AI, Grok, DeepSeek and the rest of the supported platforms as you chat.'
  },
  {
    q: 'Does anything leave my device?',
    a: 'No. The corpus, the search index, and the MCP server all stay on your machine. The only network call the extension makes is the limited, anonymised product analytics covered in the privacy policy — and that never includes conversation content, prompts, replies, or search queries. The MCP server itself makes zero network calls.'
  },
  {
    q: 'Which clients can reach the server?',
    a: 'Desktop apps that can run a local MCP connection, including Claude Code, Claude Desktop, Cursor and Codex. Browser-only AI websites cannot directly reach a local connection on your computer.'
  },
  {
    q: 'What do I need to install?',
    a: 'The LLMnesia browser extension and Node.js 22.13 or newer. Settings detects whether you are on Windows or macOS, links to the right Node installer, tells you exactly how to open PowerShell or Terminal, and gives you the complete command to copy.'
  },
  {
    q: 'Is MCP the same as Vault?',
    a: 'No. MCP is free, local-only, and designed for desktop AI clients; it works without Vault. Vault is an optional paid feature for encrypted sync and backup across supported desktop devices. Using Vault can make MCP more useful by bringing more history into your local archive. Mobile Vault access is planned for a future update.'
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
        {/* Hero — lead into the guided flow; the command alone is not setup. */}
        <section className="section mcp-hero">
          <div className="container mcp-hero-inner">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              For your desktop AI
            </p>
            <h1>
              Let your desktop AI use{' '}
              <span className="text-gradient">what you already learned.</span>
            </h1>
            <p className="subheadline mcp-hero-sub">
              LLMnesia already keeps your ChatGPT, Claude, Gemini and other AI chats
              searchable. Its free MCP connection lets Claude Desktop, Cursor, Codex
              and other desktop AI apps search that history, answer from it, and link
              back to the original conversations. Everything stays on this computer.
            </p>

            <div className="mcp-hero-actions">
              <InstallLink className="button button-large" utm={CTA_UTM}>
                Get the extension — free
              </InstallLink>
              <a className="mcp-hero-secondary" href="#guided-setup">
                See the guided setup →
              </a>
            </div>
            <p className="mcp-hero-note">
              Install LLMnesia first. Then open Full settings → Connect desktop AI and
              follow the steps shown for your computer.
            </p>
          </div>
        </section>

        {/* Setup — the three steps, extension → command → search */}
        <section className="section mcp-setup" id="guided-setup">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow">Guided local setup</p>
              <h2>Three clear steps.</h2>
              <p className="section-intro">
                Settings walks you through the right order for Windows or macOS—no
                guessing which app to open or which command to run.
              </p>
            </div>
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

        {/* Use cases — lead with what a person can accomplish, not protocol internals. */}
        <section className="section mcp-tools">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow">Made for deep work</p>
              <h2>Ask about projects you already worked through.</h2>
              <p className="section-intro">
                Ask in your own words. Your desktop AI searches your history locally
                and brings back the useful context, with sources you can open.
              </p>
            </div>
            <div className="mcp-tools-list">
              {USE_CASES.map((useCase) => (
                <article className="mcp-tool" key={useCase.name}>
                  <div className="mcp-tool-head">
                    <strong className="mcp-tool-name">{useCase.name}</strong>
                    <p className="mcp-tool-oneline">{useCase.oneLine}</p>
                  </div>
                  <p className="mcp-tool-body">{useCase.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Clients — the detection matrix */}
        <section className="section mcp-clients">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow">Works where you do</p>
              <h2>Connect the desktop AI apps you use.</h2>
              <p className="section-intro">
                The installer connects supported apps on this computer, preserves
                their existing settings, and backs up any configuration it changes.
              </p>
            </div>
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

        {/* Answer mockup — show the user-facing result, including linked sources. */}
        <section className="section mcp-result">
          <div className="container mcp-result-inner">
            <div className="mcp-result-copy mcp-section-head">
              <p className="section-eyebrow">Sources included automatically</p>
              <h2>An answer you can verify.</h2>
              <p className="section-intro">
                Your assistant answers from the conversations LLMnesia found and
                includes links back to the originals whenever they are available.
                You can check the context instead of trusting a detached summary.
              </p>
            </div>

            <div className="mcp-mock" aria-label="Example answer using LLMnesia sources">
              <div className="mcp-mock-head">
                <span className="mcp-mock-dots" aria-hidden="true">
                  <span className="mcp-mock-dot" />
                  <span className="mcp-mock-dot" />
                  <span className="mcp-mock-dot" />
                </span>
                <span className="mcp-mock-label">Your desktop AI + LLMnesia</span>
              </div>
              <div className="mcp-mock-body">
                <div className="mcp-mock-query">
                  <span className="mcp-mock-key">You</span>
                  <span className="mcp-mock-val">“What did we decide for the beta launch?”</span>
                </div>
                <article className="mcp-mock-hit">
                  <div className="mcp-mock-hit-top">
                    <h3>Start invite-only, then open access gradually.</h3>
                    <span className="mcp-mock-tag">answer</span>
                  </div>
                  <p className="mcp-mock-snippet">
                    You chose a <mark>two-week invite-only beta</mark> so the team
                    could watch onboarding closely, fix the rough edges, and collect
                    feedback before opening access more widely.
                  </p>
                  <div className="mcp-mock-meta">
                    <span>Sources</span>
                  </div>
                </article>
                <article className="mcp-mock-hit mcp-mock-hit-dim">
                  <div className="mcp-mock-hit-top">
                    <h3>Beta rollout options ↗</h3>
                    <span className="mcp-mock-tag">ChatGPT</span>
                  </div>
                  <p className="mcp-mock-snippet">
                    Original conversation · 18 Jul 2026
                  </p>
                  <div className="mcp-mock-hit-top" style={{ marginTop: '0.8rem' }}>
                    <h3>Onboarding feedback plan ↗</h3>
                    <span className="mcp-mock-tag">Claude</span>
                  </div>
                  <p className="mcp-mock-snippet">Original conversation · 3 Jun 2026</p>
                </article>
                <div className="mcp-mock-footer">
                  <span>2 linked sources</span>
                  <span>·</span>
                  <span>searched locally</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — the five questions people actually ask */}
        <section className="section mcp-faq">
          <div className="container">
            <div className="mcp-section-head">
              <p className="section-eyebrow">Good to know</p>
              <h2>The essentials.</h2>
            </div>
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
            <div className="mcp-closing-copy">
              <p className="section-eyebrow">Bring your history with you</p>
              <h2>Your AI conversations can keep working for you.</h2>
              <p className="section-intro">
                Install LLMnesia, choose the history you want available, then open
                Full settings → Connect desktop AI. The guided setup takes it from
                there.
              </p>
            </div>
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
