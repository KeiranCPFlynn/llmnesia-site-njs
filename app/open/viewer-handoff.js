'use client';

import { useEffect, useState } from 'react';
import { viewerUrlFromHash } from './viewer-link';

const styles = {
  main: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '32px 20px',
    background: '#fffef8',
    color: '#243342'
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
  button: {
    display: 'inline-block',
    marginTop: '24px',
    padding: '12px 18px',
    borderRadius: '10px',
    background: '#2b6588',
    color: '#ffffff',
    fontWeight: 700,
    textDecoration: 'none'
  },
  privacy: {
    margin: '22px 0 0',
    fontSize: '13px',
    lineHeight: 1.5,
    color: '#70808d'
  }
};

export default function ViewerHandoff() {
  const [viewerUrl, setViewerUrl] = useState('');
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const target = viewerUrlFromHash(window.location.hash);
    if (!target) {
      setInvalid(true);
      return undefined;
    }

    setViewerUrl(target);
    const timer = window.setTimeout(() => {
      window.location.replace(target);
    }, 50);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main style={styles.main}>
      <section style={styles.card} aria-live="polite">
        <p style={styles.eyebrow}>LLMnesia source</p>
        <h1 style={styles.title}>
          {invalid ? 'This source link is incomplete' : 'Opening your saved conversation'}
        </h1>
        <p style={styles.body}>
          {invalid
            ? 'Return to your desktop AI answer and open the source again.'
            : 'LLMnesia is handing this source to the private Viewer in your browser extension.'}
        </p>
        {viewerUrl ? (
          <a href={viewerUrl} style={styles.button}>
            Open LLMnesia Viewer
          </a>
        ) : null}
        <p style={styles.privacy}>
          The conversation identifier stays after the # in this address. Browsers do not send that fragment to this website.
        </p>
      </section>
    </main>
  );
}
