import { homepageMarkup } from '../../lib/homepage';

import { SITE_LANGUAGES } from '../../lib/site-language';

export default function LocalizedChrome({ children, language }) {
  const config = SITE_LANGUAGES.find(item => item.code === language);
  const homepage = homepageMarkup(language);
  const anchorToHome = (html) => html.replace(/href="#/g, `href="${config.path}#`);
  const header = anchorToHome(homepage.slice(0, homepage.indexOf('</header>') + '</header>'.length))
    .replace(`href="${config.path}#main-content"`, 'href="#main-content"');
  const footer = anchorToHome(homepage.slice(homepage.lastIndexOf('<footer class="site-footer">')));
  return (
    <div lang={language} className="german-guide-page">
      <div dangerouslySetInnerHTML={{ __html: header }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: footer }} />
    </div>
  );
}
