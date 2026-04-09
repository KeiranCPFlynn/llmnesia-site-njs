import { CHROME_WEB_STORE_URL } from '../../lib/site';

export default function InstallLink({ className = 'button', children = 'Add to Chrome — Free' }) {
  return (
    <a
      className={className}
      href={CHROME_WEB_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
