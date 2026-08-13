// Single source of truth for the directory/launch badges in the site footer.
//
// The footer exists twice: as JSX in `app/components/site-chrome.js` (used by
// every page except the homepage) and as static HTML in
// `content/index.template.html` (the homepage). Both read this list, so adding
// a badge here puts it on every page — edit only this file.

export const FOOTER_BADGES = [
  {
    href: 'https://betalist.com/startups/llmnesia?utm_campaign=badge-llmnesia&utm_medium=badge&utm_source=badge-featured',
    title: 'LLMnesia on BetaList',
    label: 'LLMnesia on BetaList',
    alt: 'LLMnesia - Search all your AI chats locally and jump to exact messages | BetaList',
    src: 'https://betalist.com/badges/featured?id=179113&theme=color',
    width: 156,
    height: 54,
    className: 'footer-badge footer-badge--betalist'
  },
  {
    href: 'https://openhunts.com',
    title: 'OpenHunts Club',
    label: 'OpenHunts Club Member',
    alt: 'OpenHunts Club Member',
    src: 'https://cdn.openhunts.com/badges/club.webp',
    width: 486,
    height: 105
  },
  {
    href: 'https://startupbase.io/products/llmnesia?utm_source=startupbase&utm_medium=badge&utm_campaign=featured-badge-light',
    title: 'Featured on StartupBase',
    label: 'Featured on StartupBase',
    alt: 'Featured on StartupBase',
    src: 'https://statics.startupbase.io/site/badges/featured-on-sb.svg',
    width: 300,
    height: 80
  },
  {
    href: 'https://nicklaunches.com/products/llmnesia/?utm_source=llmnesia.com&utm_medium=badge&utm_campaign=featured',
    title: 'Featured on Nick Launches',
    label: 'Featured on Nick Launches',
    alt: 'LLMnesia on Nick Launches',
    src: 'https://nicklaunches.com/badges/featured.png',
    width: 244,
    height: 56
  }
];

function escapeAttr(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

// Renders the same markup as the JSX version, for the `{{FOOTER_BADGES}}`
// placeholder in the homepage template.
export function footerBadgesHtml() {
  return FOOTER_BADGES.map(
    (badge) =>
      `<a class="${escapeAttr(badge.className || 'footer-badge')}" href="${escapeAttr(badge.href)}" target="_blank" rel="noopener noreferrer" ` +
      `title="${escapeAttr(badge.title)}" aria-label="${escapeAttr(badge.label)}">` +
      `<img alt="${escapeAttr(badge.alt)}" src="${escapeAttr(badge.src)}" ` +
      `width="${badge.width}" height="${badge.height}" loading="lazy" decoding="async">` +
      `</a>`
  ).join('\n        ');
}
