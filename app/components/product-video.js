'use client';

// Click-to-play YouTube video. Shows a local poster and a play button; the
// YouTube player (privacy-enhanced youtube-nocookie.com) loads only when the
// visitor presses play.

import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/analytics';
import { embedUrl, isPublished } from '../../lib/videos';

// The video to show now: the video itself if it is live, else its fallback if
// that is live, else nothing.
const pickLive = (video) => [video, video?.fallback].find((v) => v?.id && isPublished(v)) || null;

export default function ProductVideo({ video: wanted, name, label = 'Play the video' }) {
  const [playing, setPlaying] = useState(false);
  // A video with publishAt stays hidden until then. Start with only videos that
  // have no publishAt (so server and client markup agree), then switch after
  // mount, or when a go-live time arrives.
  const [current, setCurrent] = useState(() => [wanted, wanted?.fallback].find((v) => v?.id && !v.publishAt) || null);
  useEffect(() => {
    setCurrent(pickLive(wanted));
    const timers = [wanted, wanted?.fallback]
      .filter((v) => v?.publishAt && !isPublished(v))
      .map((v) => Date.parse(v.publishAt) - Date.now())
      // setTimeout caps near 24.8 days; a longer wait just re-checks on next visit.
      .filter((wait) => wait <= 2 ** 31 - 1)
      .map((wait) => setTimeout(() => setCurrent(pickLive(wanted)), wait));
    return () => timers.forEach(clearTimeout);
  }, [wanted]);
  const video = current;
  if (!video?.id) return null;
  const src = embedUrl(video.id);
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
          <span className="product-video-length" aria-hidden="true">{video.length}</span>
        </button>
      )}
    </figure>
  );
}
