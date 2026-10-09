'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '../../lib/analytics';
import { LANGUAGE_PREFERENCE_KEY, SITE_LANGUAGES, languageForPath, suggestedLanguage } from '../../lib/site-language';

export default function SiteLanguage() {
  const pathname = usePathname() || '/';
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    document.documentElement.lang = languageForPath(pathname);
    // The private Viewer hand-off must stay free of general site behavior.
    if (pathname === '/open' || pathname === '/open/') return;
    let preference;
    try { preference = localStorage.getItem(LANGUAGE_PREFERENCE_KEY); } catch { /* Storage is optional. */ }
    setSuggestion(suggestedLanguage(pathname, preference, navigator.languages || [navigator.language]));

    const rememberChoice = (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[data-site-language]') : null;
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const language = link.dataset.siteLanguage;
      if (!SITE_LANGUAGES.some(item => item.code === language)) return;
      try { localStorage.setItem(LANGUAGE_PREFERENCE_KEY, language); } catch { /* Keep links usable. */ }
      trackEvent('site_language_selected', { language });
    };
    const closePickers = (event) => {
      if (event.type === 'click' && event.target instanceof Element && event.target.closest('[data-language-picker] summary')) {
        document.getElementById('primary-nav')?.classList.remove('open');
        document.getElementById('nav-toggle')?.setAttribute('aria-expanded', 'false');
      }
      document.querySelectorAll('[data-language-picker][open]').forEach(picker => {
        if (event.type === 'keydown' && event.key === 'Escape') {
          picker.removeAttribute('open');
          picker.querySelector('summary')?.focus();
        } else if (event.type === 'click' && !picker.contains(event.target)) picker.removeAttribute('open');
      });
    };
    document.addEventListener('click', rememberChoice);
    document.addEventListener('click', closePickers);
    document.addEventListener('keydown', closePickers);
    return () => {
      document.removeEventListener('click', rememberChoice);
      document.removeEventListener('click', closePickers);
      document.removeEventListener('keydown', closePickers);
    };
  }, [pathname]);

  function dismissSuggestion() {
    try { localStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'en'); } catch { /* Storage is optional. */ }
    setSuggestion(null);
  }

  if (!suggestion || pathname !== '/') return null;
  return (
    <aside className="language-suggestion" aria-label="Language suggestion">
      <div className="container language-suggestion-inner">
        <a href={suggestion.path} lang={suggestion.code} data-site-language={suggestion.code}>{suggestion.viewLabel}</a>
        <span>{suggestion.suggestionLabel}</span>
        <button type="button" onClick={dismissSuggestion}>Keep English</button>
      </div>
    </aside>
  );
}
