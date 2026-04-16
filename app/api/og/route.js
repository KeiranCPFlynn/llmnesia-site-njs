import { readFileSync } from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';

const BG = '#0c1416';
const CARD = '#131b1e';
const BORDER = '#1c2a2e';
const TEXT = '#e6eef0';
const TEXT_MUTED = '#7a9aa5';
const BRAND = '#339eb5';
const ACCENT = '#5dd694';

function loadFont(filename) {
  return readFileSync(path.join(process.cwd(), 'public', 'fonts', filename));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'LLMnesia';
  const description =
    searchParams.get('description') || 'Stop losing answers in AI chats.';

  const interRegular = loadFont('Inter-Regular.woff');
  const interBold = loadFont('Inter-Bold.woff');

  // Truncate description to keep layout clean
  const shortDesc =
    description.length > 120 ? description.slice(0, 117) + '…' : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: BG,
          padding: '56px 64px',
          fontFamily: 'Inter',
          position: 'relative'
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`
          }}
        />

        {/* Brand badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '40px'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${BRAND}, ${ACCENT})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: BG
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: TEXT,
              letterSpacing: '-0.02em'
            }}
          >
            LLMnesia
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h1
            style={{
              fontSize: title.length > 55 ? '42px' : '52px',
              fontWeight: 700,
              color: TEXT,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: '0 0 20px 0',
              maxWidth: '900px'
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: TEXT_MUTED,
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '820px'
            }}
          >
            {shortDesc}
          </p>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '32px',
            borderTop: `1px solid ${BORDER}`
          }}
        >
          <span style={{ fontSize: '18px', color: TEXT_MUTED }}>
            llmnesia.com
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: '8px',
              padding: '10px 20px'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: ACCENT,
                display: 'block'
              }}
            />
            <span style={{ fontSize: '16px', fontWeight: 600, color: TEXT }}>
              Free Chrome Extension
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' }
      ]
    }
  );
}
