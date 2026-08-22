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
  const edgeLabel =
    typeof children === 'string' && children.includes('Chrome')
      ? children.replaceAll('Chrome', 'Edge')
      : undefined;

  // Click tracking is handled centrally by the delegated install_click handler
  // in site-behavior.js, which reads platform/placement from the href's UTM
  // params. The same handler swaps this Chrome-first server fallback to the
  // Edge Add-ons listing when the visitor is using desktop Microsoft Edge.
  return (
    <a
      className={className}
      href={withUtm(CHROME_WEB_STORE_URL, utm)}
      target="_blank"
      rel="noopener noreferrer"
      data-install-link=""
      {...(edgeLabel && { 'data-edge-label': edgeLabel })}
    >
      {children}
    </a>
  );
}
