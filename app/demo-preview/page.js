import SiteChrome from '../components/site-chrome';
import KineticDemo from '../components/kinetic-demo';
import {
  recoverScenes,
  exportScenes,
  searchScenes
} from '../components/kinetic-demo-scenes';

export const metadata = {
  title: 'Kinetic demo preview',
  robots: { index: false, follow: false }
};

const DEMOS = [
  {
    id: 'recover',
    heading: 'recover',
    blurb: 'A chat you thought was lost, surfaced across ChatGPT and Claude.',
    scenes: recoverScenes
  },
  {
    id: 'export',
    heading: 'export',
    blurb: 'Exporting and saving your history in a format you own.',
    scenes: exportScenes
  },
  {
    id: 'search',
    heading: 'search',
    blurb: 'The multi-platform search moment — one query, every assistant.',
    scenes: searchScenes
  }
];

export default function DemoPreviewPage() {
  return (
    <SiteChrome>
      <main id="main-content" className="section container">
        <div className="content-article">
          <header className="content-header">
            <p className="section-eyebrow">Internal preview</p>
            <h1>Kinetic demo — three configured instances</h1>
            <p className="section-intro">
              Each block below renders the reusable KineticDemo component at
              blog-content-column width. Not wired into any blog page yet.
            </p>
          </header>

          {DEMOS.map((demo) => (
            <section key={demo.id} style={{ marginBottom: '4rem' }}>
              <h2 style={{ marginBottom: '0.25rem' }}>{demo.heading}</h2>
              <p className="section-intro" style={{ marginTop: 0 }}>
                {demo.blurb}
              </p>
              <KineticDemo scenes={demo.scenes} />
            </section>
          ))}
        </div>
      </main>
    </SiteChrome>
  );
}
