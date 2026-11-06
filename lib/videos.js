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
    uploadDate: '2026-11-06'
  }
};

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
