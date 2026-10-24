import SiteChrome from '../components/site-chrome';
import GoodbyeForm from '../components/goodbye-form';

export const metadata = {
  title: 'Thanks for trying LLMnesia',
  description: 'A one-tap note on why LLMnesia was not for you.',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/goodbye'
  }
};

export default function GoodbyePage() {
  return (
    <SiteChrome>
      <main id="main-content" className="section container content-main">
        <article className="content-article">
          <GoodbyeForm />
        </article>
      </main>
    </SiteChrome>
  );
}
