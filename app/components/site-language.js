'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '../../lib/analytics';
import { LANGUAGE_PREFERENCE_KEY, languageForPath, shouldSuggestGerman } from '../../lib/site-language';

export default function SiteLanguage() {
  const pathname = usePathname() || '/';
  const [suggestGerman, setSuggestGerman] = useState(false);

  useEffect(() => {
    document.documentElement.lang = languageForPath(pathname);
    // The private Viewer hand-off must stay free of general site behavior.
    if (pathname === '/open' || pathname === '/open/') return;
    let preference;
    try { preference = localStorage.getItem(LANGUAGE_PREFERENCE_KEY); } catch { /* Storage is optional. */ }
    setSuggestGerman(shouldSuggestGerman(pathname, preference, navigator.languages || [navigator.language]));

    const rememberChoice = (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[data-site-language]') : null;
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const language = link.dataset.siteLanguage;
      if (!['en', 'de'].includes(language)) return;
      try { localStorage.setItem(LANGUAGE_PREFERENCE_KEY, language); } catch { /* Keep links usable. */ }
      trackEvent('site_language_selected', { language });
    };
    document.addEventListener('click', rememberChoice);
    return () => document.removeEventListener('click', rememberChoice);
  }, [pathname]);

  function dismissSuggestion() {
    try { localStorage.setItem(LANGUAGE_PREFERENCE_KEY, 'en'); } catch { /* Storage is optional. */ }
    setSuggestGerman(false);
  }

  if (!suggestGerman || pathname !== '/') return null;
  return (
    <aside className="language-suggestion" aria-label="Language suggestion">
      <div className="container language-suggestion-inner">
        <a href="/de" lang="de" data-site-language="de">Auf Deutsch ansehen</a>
        <span>German introduction and installation guide</span>
        <button type="button" onClick={dismissSuggestion}>Keep English</button>
      </div>
    </aside>
  );
}
