// Product videos hosted on YouTube. Pages show a local poster and only load
// YouTube (youtube-nocookie.com) when the visitor presses play, so the page
// stays fast and no YouTube cookies are set until then.
//
// To publish a video, set its YouTube id. With no id, the player renders
// nothing.

export const VIDEOS = {
  vault: {
    id: 'cJKT3OQvYjo',
    title: 'LLMnesia Vault: your AI chat history, on every device',
    description:
      'Vault syncs your LLMnesia archive across your computers and browsers, keeps it encrypted so only your devices can read it, restores it on a new laptop, and puts it on your phone with the Vault web app, including Ask Vault.',
    poster: '/assets/video/vault-poster.jpg',
    duration: 'PT51S',
    length: '0:51',
    uploadDate: '2026-11-06'
  },
  main: {
    id: 'kQOXrQGu1no',
    title: 'LLMnesia: every AI chat you’ve ever had, searchable',
    description:
      'LLMnesia saves every chat from ChatGPT, Claude, Gemini and more on your computer, brings in your old chats, and finds any conversation with one search, including Claude Code and Codex sessions. Your AI apps can search it too, and Vault adds encrypted sync and phone access.',
    poster: '/assets/video/main-poster.jpg',
    duration: 'PT49S',
    length: '0:49',
    uploadDate: '2026-11-07'
  },
  mcp: {
    id: 'MtQWy4zykas',
    title: 'LLMnesia MCP: give your AI apps your whole chat history',
    description:
      'Ask Claude Code, Claude Desktop, Cursor or Codex about your past work and it answers from your own AI chat history, with links to the chats it came from. The search runs on your computer and it is free to use.',
    poster: '/assets/video/mcp-poster.jpg',
    duration: 'PT45S',
    length: '0:45',
    uploadDate: '2026-11-07'
  }
};

/** Static click-to-play markup for HTML templates (the homepage); site-behavior
 * swaps in the player on click. Same look as <ProductVideo>. */
export function productVideoMarkup(video, name, label) {
  if (!video?.id) return '';
  return `<figure class="product-video"><button type="button" class="product-video-poster" data-video-id="${video.id}" data-video-name="${name}" data-video-title="${video.title.replace(/"/g, '&quot;')}" aria-label="${label}: ${video.title}"><img src="${video.poster}" alt="" width="1280" height="720" loading="lazy" decoding="async"><span class="product-video-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span class="product-video-length" aria-hidden="true">${video.length}</span></button></figure>`;
}

export const embedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0`;

export function videoObjectSchema(video, origin = 'https://www.llmnesia.com') {
  if (!video?.id) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: [origin + video.poster, `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`],
    uploadDate: video.uploadDate,
    duration: video.duration,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.id}`
  };
}
