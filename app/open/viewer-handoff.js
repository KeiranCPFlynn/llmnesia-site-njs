'use client';

import { useEffect, useRef, useState } from 'react';
import { parseHandoffHash } from './viewer-link';
import { abbreviatedExtensionId, createViewerHandoffController, resolveUnavailableState } from './viewer-bridge';

const styles = {
  main: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '32px 20px',
    background: '#fffef8',
    color: '#243440'
  },
  card: {
    width: 'min(560px, 100%)',
    padding: '32px',
    border: '1px solid #dbe2cf',
    borderRadius: '18px',
    background: '#ffffff',
    boxShadow: '0 18px 50px rgba(36, 51, 66, 0.1)',
    textAlign: 'center'
  },
  eyebrow: {
    margin: '0 0 10px',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#526771'
  },
  title: {
    margin: '0',
    fontSize: 'clamp(28px, 6vw, 42px)',
    lineHeight: 1.08,
    letterSpacing: '-0.03em'
  },
  body: {
    margin: '16px auto 0',
    maxWidth: '430px',
    lineHeight: 1.6,
    color: '#52616f'
  },
  found: {
    margin: '10px auto 0',
    maxWidth: '430px',
    fontSize: '13px',
    lineHeight: 1.5,
    color: '#70808d'
  },
  choices: {
    marginTop: '24px',
    display: 'grid',
    gap: '10px',
    justifyItems: 'center'
  },
  choiceButton: {
    display: 'block',
    width: 'min(100%, 340px)',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #b9c7d2',
    background: '#ffffff',
    color: '#2b6588',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '15px',
    textAlign: 'center'
  },
  choiceHint: {
    margin: '8px 0 0',
    fontSize: '12px',
    color: '#70808d'
  },
  actions: {
    marginTop: '24px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  actionButton: {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '10px',
    border: 'none',
    background: '#2b6588',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '16px'
  },
  actionGhost: {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '10px',
    border: '1px solid #b9c7d2',
    background: '#ffffff',
    color: '#2b6588',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '16px'
  },
  fallback: {
    margin: '18px auto 0',
    maxWidth: '430px',
    fontSize: '13px',
    lineHeight: 1.55,
    color: '#52616f',
    textAlign: 'left'
  },
  privacy: {
    margin: '22px 0 0',
    fontSize: '13px',
    lineHeight: 1.5,
    color: '#70808d'
  }
};

// The hand-off phases are owned by the discovery controller (viewer-bridge.js);
// this component renders them and offers the local fallbacks (retry, copy the
// link for the right browser, search inside LLMnesia). The only chrome-
// extension:// navigation is the pre-bridge fallback resolved by
// resolveUnavailableState: when no build answers discovery and the link names
// its own extension, that redirect is the sole path installs released before
// the handshake (extension 0.4.10) can still be opened through.
const PHASE_COPY = {
  searching: {
    title: 'Opening your saved conversation',
    body: 'Looking for the LLMnesia extension in this browser.'
  },
  opening: {
    title: 'Opening your saved conversation',
    body: 'Your extension accepted the hand-off. Opening the saved conversation in its private Viewer.'
  },
  choice: {
    title: 'Choose an LLMnesia installation',
    body: 'More than one LLMnesia build responded in this browser. Pick the one holding this conversation.'
  },
  failed: {
    title: 'The hand-off did not complete',
    body: ''
  },
  legacy: {
    title: 'Opening your saved conversation',
    body: 'No extension answered the handshake, so this link is opening with the extension ID saved in it.'
  },
  unavailable: {
    title: 'No LLMnesia extension responded',
    body: 'This browser did not answer the hand-off. Open the link in the browser profile where LLMnesia is installed, or enable and update the extension here, then try again.'
  }
};

export default function ViewerHandoff() {
  const [handoff, setHandoff] = useState({ phase: 'searching' });
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [legacyUrl, setLegacyUrl] = useState('');
  const [attempt, setAttempt] = useState(0);
  const controllerRef = useRef(null);

  useEffect(() => {
    const parsed = parseHandoffHash(window.location.hash);
    if (!parsed) {
      setInvalid(true);
      return undefined;
    }

    // The pre-bridge fallback is resolved once per attempt so the escape-hatch
    // anchor can offer it while discovery is still running.
    const fallback = resolveUnavailableState(parsed.extensionId, parsed.docId);
    setLegacyUrl(fallback.legacyUrl || '');

    const controller = createViewerHandoffController({
      docId: parsed.docId,
      preferredExtensionId: parsed.extensionId,
      postMessage: (message) => window.postMessage(message, window.location.origin),
      addMessageListener: (handler) => {
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
      },
      expectedSource: window,
      expectedOrigin: window.location.origin,
      onState: (state) => {
        if (state.phase === 'unavailable') {
          // No bridge answered. With a hint, hand off to the link's own build
          // the way pre-handshake /open links always worked; without one,
          // keep the guidance page below.
          setHandoff(fallback);
          if (fallback.legacyUrl) {
            window.location.replace(fallback.legacyUrl);
          }
          return;
        }
        setHandoff(state);
      }
    });
    controllerRef.current = controller;
    controller.start();
    return () => {
      controller.stop();
      controllerRef.current = null;
    };
  }, [attempt]);

  const retry = () => {
    setCopied(false);
    setHandoff({ phase: 'searching' });
    setAttempt((n) => n + 1);
  };

  const chooseResponder = (extensionId) => {
    controllerRef.current?.choose(extensionId);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (invalid) {
    return (
      <main style={styles.main}>
        <section style={styles.card} aria-live="polite">
          <p style={styles.eyebrow}>LLMnesia source</p>
          <h1 style={styles.title}>This source link is incomplete</h1>
          <p style={styles.body}>
            Return to your desktop AI answer and open the source again.
          </p>
          <p style={styles.privacy}>
            The conversation identifier stays after the # in this address. Browsers do not send that fragment to this website.
          </p>
        </section>
      </main>
    );
  }

  const phase = PHASE_COPY[handoff.phase] ? handoff.phase : 'searching';
  const copy = PHASE_COPY[phase];
  const responders = handoff.phase === 'choice' ? handoff.responders : [];

  return (
    <main style={styles.main}>
      <section style={styles.card} aria-live="polite">
        <p style={styles.eyebrow}>LLMnesia source</p>
        <h1 style={styles.title}>{copy.title}</h1>
        <p style={styles.body}>
          {phase === 'failed'
            ? handoff.reason || copy.body || 'The extension could not open this source.'
            : copy.body}
        </p>
        {phase === 'opening' && handoff.responder ? (
          <p style={styles.found}>
            Responding build: {handoff.responder.label || 'LLMnesia extension'}
            {handoff.responder.extensionId ? ` (${abbreviatedExtensionId(handoff.responder.extensionId)})` : ''}
          </p>
        ) : null}
        {phase === 'choice' ? (
          <div style={styles.choices}>
            {responders.map((responder) => (
              <button
                key={responder.extensionId}
                type="button"
                style={styles.choiceButton}
                onClick={() => chooseResponder(responder.extensionId)}
              >
                {responder.label || 'LLMnesia extension'} ({abbreviatedExtensionId(responder.extensionId)})
              </button>
            ))}
            <p style={styles.choiceHint}>Not sure? Pick the build you use for searches.</p>
          </div>
        ) : null}
        {legacyUrl && (phase === 'searching' || phase === 'opening' || phase === 'legacy') ? (
          <a
            href={legacyUrl}
            style={{ ...styles.actionGhost, marginTop: '24px', display: 'inline-block' }}
          >
            Open LLMnesia Viewer
          </a>
        ) : null}
        {phase === 'failed' || phase === 'unavailable' ? (
          <div style={styles.actions}>
            <button type="button" style={styles.actionButton} onClick={retry}>
              Try again
            </button>
            <button type="button" style={styles.actionGhost} onClick={copyLink}>
              {copied ? 'Link copied' : 'Copy this link'}
            </button>
            {phase === 'failed' && legacyUrl ? (
              <a href={legacyUrl} style={styles.actionGhost}>
                Open with the link&rsquo;s saved extension
              </a>
            ) : null}
          </div>
        ) : null}
        {phase === 'unavailable' ? (
          <p style={styles.fallback}>
            Copied the link into another browser with LLMnesia? Open it there to view this conversation. You can also
            open the LLMnesia extension in that browser and search for the conversation directly; the saved copy lives
            locally in the extension.
          </p>
        ) : null}
        <p style={styles.privacy}>
          The conversation identifier stays after the # in this address. Browsers do not send that fragment to this website.
        </p>
      </section>
    </main>
  );
}
