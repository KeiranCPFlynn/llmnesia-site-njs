'use client';

// Click-to-play YouTube video. Shows a local poster and a play button; the
// YouTube player (privacy-enhanced youtube-nocookie.com) loads only when the
// visitor presses play.

import { useState } from 'react';
import { trackEvent } from '../../lib/analytics';

export default function ProductVideo({ video, name, label = 'Play the video' }) {
  const [playing, setPlaying] = useState(false);
  if (!video?.id) return null;
  const src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0`;
  return (
    <figure className="product-video">
      {playing ? (
        <iframe
          src={src}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="product-video-poster"
          aria-label={`${label}: ${video.title}`}
          onClick={() => { setPlaying(true); trackEvent('product_video_play', { video: name }); }}
        >
          <img src={video.poster} alt="" width="1280" height="720" loading="eager" decoding="async" />
          <span className="product-video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
          </span>
          <span className="product-video-length" aria-hidden="true">0:51</span>
        </button>
      )}
    </figure>
  );
}
