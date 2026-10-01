import SiteChrome from '../components/site-chrome';
import InstallLink from '../components/install-link';
import JsonLd from '../components/json-ld';
import { buildPageMetadata } from '../../lib/metadata';
import { softwareApplicationSchema, homepageFaqSchema } from '../../lib/schema';

export const metadata = buildPageMetadata({
  title: 'Search Your ZCode Sessions — LLMnesia',
  description:
    'LLMnesia indexes your local ZCode sessions — prompts and replies only, never subagent runs or tool output — into one search, alongside your Claude Code and Codex sessions and your web AI chats. Free, local, no account.',
  canonicalPath: '/zcode'
});

const CTA_UTM = {
  utm_source: 'zcode_page',
  utm_medium: 'cta',
  utm_campaign: 'zcode_product'
};

const SETUP = [
  {
    kicker: 'Option A',
    title: 'Index your ZCode sessions',
    body: 'Your ZCode history lives on this machine, under ~/.zcode — not on a server. LLMnesia reads the sessions already there and indexes your prompts and the assistant\u2019s replies, so everything you\u2019ve worked through becomes searchable in one click.',
    note: 'Best if you want your existing ZCode history searchable.'
  },
  {
    kicker: 'Option B',
    title: 'Bring everything else in',
    body: 'The same search also covers your local Claude Code and Codex sessions, plus ChatGPT, Claude, Gemini and 10+ web AI platforms — so one box spans every AI conversation you have, wherever it happened.',
    note: 'Best if you work across more than one AI tool.'
  }
];

const FAQS = [
  {
    q: 'Which ZCode sessions does it index?',
    a: 'The ZCode sessions on this machine — every conversation you\u2019ve had in ZCode, across all of your projects. ZCode keeps them locally under ~/.zcode, and LLMnesia reads that history so a single search covers all of it.'
  },
  {
    q: 'What exactly gets indexed?',
    a: 'Only your prompts and the assistant\u2019s replies. Subagent runs, shell commands, and tool output are never stored, so search results read like a clean transcript, not raw logs. That index lives in your browser\u2019s local storage and is never uploaded anywhere.'
  },
  {
    q: 'Does anything leave my device?',
    a: 'Your sessions, prompts, replies, and search index never do — they stay in local browser storage, full stop. LLMnesia does send limited, anonymized product analytics to PostHog (extension version, which features you use, error categories, an anonymous install ID) so we can fix bugs and see what\u2019s useful. It never includes conversation content, prompts, replies, or search queries. Full detail in the',
    aLink: { text: 'privacy policy', href: '/privacy-policy' }
  },
  {
    q: 'Can ZCode itself search this history?',
    a: 'Yes. The free MCP connection lets ZCode search your indexed history locally — ask \u201cwhat did we decide about the auth refactor?\u201d and it answers from your past conversations, with links back to the sources. Setup configures ZCode\u2019s MCP settings for you.',
    aLink: { text: 'See the MCP connection', href: '/mcp' }
  },
  {
    q: 'Does it work with Claude Code and Codex too?',
    a: 'Yes. Local Claude Code and Codex sessions are indexed into the same search, alongside your web AI chats — so your terminal sessions and browser chats are covered by one box, not a separate tool for each.'
  }
];

export default function ZCodePage() {
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
              For ZCode
            </p>
            <h1>
              Every ZCode session,{' '}
              <span className="text-gradient">searchable from one box.</span>
            </h1>
            <p className="subheadline cc-hero-sub">
              ZCode keeps your sessions on your machine — which is great for privacy,
              and terrible for finding anything. LLMnesia indexes your ZCode prompts
              and replies locally into one search, alongside your Claude Code and
              Codex sessions and your web AI chats. Want ZCode itself to search this
              history for you? <a href="/mcp">See the free MCP connection.</a>
            </p>
            <div className="cc-hero-actions">
              <InstallLink className="button button-large" utm={CTA_UTM}>
                Add to Chrome — free
              </InstallLink>
              <a className="cc-hero-guide" href="/blog/where-does-zcode-store-session-history">
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

        {/* Result — one look at what a search returns, and the MCP payoff */}
        <section className="section cc-result">
          <div className="container cc-result-inner">
            <div className="cc-result-copy">
              <p className="section-eyebrow">What a result looks like</p>
              <h2>Find the session, get the context.</h2>
              <p className="section-intro">
                Search a phrase you remember — a function name, an error, a decision
                you talked through. Every match shows which project it came from and
                reads like a clean transcript: what you asked, and what the assistant
                answered. Then bring the context straight back into ZCode — connect
                the free MCP link and ask ZCode itself.
              </p>
            </div>

            <div className="cc-mock" aria-label="Example LLMnesia search result for a ZCode session">
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
                    <span className="cc-mock-tag">ZCode</span>
                  </div>
                  <p className="cc-mock-snippet">
                    “…the fix was awaiting the <mark>refresh</mark> before the test’s first
                    request — the <mark>race condition</mark> was in the{' '}
                    <mark>token</mark> refresh, not the mock clock…”
                  </p>
                  <div className="cc-mock-meta">
                    <span>~/projects/api-server</span>
                    <span>·</span>
                    <span>desktop</span>
                    <span>·</span>
                    <span>18 Jul 2026</span>
                  </div>
                  <div className="cc-mock-cmd">
                    <span className="cc-mock-cmd-label">Ask ZCode</span>
                    <code>“Where did we fix the refresh token race condition?”</code>
                    <span className="cc-mock-copy" aria-hidden="true">Copy</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — the questions people actually ask */}
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
            <h2>Stop losing track of what you built in ZCode.</h2>
            <p className="section-intro">
              Install LLMnesia, index your sessions, and search every ZCode
              conversation — alongside your Claude Code, Codex, and web chats — from
              one box. Free, local, no account.
            </p>
            <div className="cc-hero-actions">
              <InstallLink className="button button-large" utm={{ ...CTA_UTM, utm_medium: 'cta_closing' }}>
                Add to Chrome — free
              </InstallLink>
              <a
                className="cc-hero-guide"
                href="/blog/search-zcode-session-history"
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
