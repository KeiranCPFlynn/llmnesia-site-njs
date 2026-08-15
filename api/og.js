import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';

const COLORS = {
  background: '#fffef8',
  paper: '#faf6e4',
  border: '#d9decb',
  text: '#142430',
  muted: '#5b6b74',
  brand: '#2f7f99',
  accent: '#9ab458'
};

function loadFont(filename) {
  return readFileSync(path.join(process.cwd(), 'public', 'fonts', filename));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'LLMnesia';
  const description =
    searchParams.get('description') || 'Stop losing answers in AI chats.';
  const shortDescription =
    description.length > 120 ? `${description.slice(0, 117)}…` : description;

  const image = h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.background,
        padding: '56px 64px',
        fontFamily: 'Inter',
        position: 'relative'
      }
    },
    h('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${COLORS.brand}, ${COLORS.accent})`
      }
    }),
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' } },
      h(
        'div',
        {
          style: {
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${COLORS.brand}, #23687d)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: '#ffffff'
          }
        },
        'L'
      ),
      h(
        'span',
        {
          style: {
            fontSize: '22px',
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '-0.02em'
          }
        },
        'LLMnesia'
      )
    ),
    h(
      'div',
      {
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }
      },
      h(
        'h1',
        {
          style: {
            fontSize: title.length > 55 ? '42px' : '52px',
            fontWeight: 700,
            color: COLORS.text,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 20px 0',
            maxWidth: '900px'
          }
        },
        title
      ),
      h(
        'p',
        {
          style: {
            fontSize: '24px',
            color: COLORS.muted,
            lineHeight: 1.5,
            margin: 0,
            maxWidth: '820px'
          }
        },
        shortDescription
      )
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '32px',
          borderTop: `1px solid ${COLORS.border}`
        }
      },
      h('span', { style: { fontSize: '18px', color: COLORS.muted } }, 'llmnesia.com'),
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: COLORS.paper,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '8px',
            padding: '10px 20px'
          }
        },
        h('span', {
          style: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: COLORS.accent,
            display: 'block'
          }
        }),
        h(
          'span',
          { style: { fontSize: '16px', fontWeight: 600, color: COLORS.text } },
          'Free Chrome Extension'
        )
      )
    )
  );

  return new ImageResponse(image, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: loadFont('Inter-Regular.woff'), weight: 400, style: 'normal' },
      { name: 'Inter', data: loadFont('Inter-Bold.woff'), weight: 700, style: 'normal' }
    ]
  });
}
