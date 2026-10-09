import { homepageMarkup } from '../../lib/homepage';

export const GERMAN_CTA_UTM = {
  utm_source: 'german_page', utm_medium: 'cta', utm_campaign: 'german_pilot'
};

export default function GermanChrome({ children }) {
  const homepage = homepageMarkup('de');
  const anchorToHome = (html) => html.replace(/href="#/g, 'href="/de#');
  const header = anchorToHome(homepage.slice(0, homepage.indexOf('</header>') + '</header>'.length))
    .replace('href="/de#main-content"', 'href="#main-content"');
  const footer = anchorToHome(homepage.slice(homepage.lastIndexOf('<footer class="site-footer">')));
  return (
    <div lang="de" className="german-guide-page">
      <div dangerouslySetInnerHTML={{ __html: header }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: footer }} />
    </div>
  );
}
