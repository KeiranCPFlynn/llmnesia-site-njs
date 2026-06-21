import { CHROME_WEB_STORE_URL } from '../../lib/site';

function withUtm(url, utm) {
  if (!utm) return url;
  const target = new URL(url);
  for (const [key, value] of Object.entries(utm)) {
    if (value) target.searchParams.set(key, value);
  }
  return target.toString();
}

export default function InstallLink({
  className = 'button',
  children = 'Add to Chrome — Free',
  utm
}) {
  // Click tracking is handled centrally by the delegated install_click handler
  // in site-behavior.js, which reads platform/placement from the href's UTM
  // params — so this stays a plain (server) anchor with no client handler.
  return (
    <a
      className={className}
      href={withUtm(CHROME_WEB_STORE_URL, utm)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
