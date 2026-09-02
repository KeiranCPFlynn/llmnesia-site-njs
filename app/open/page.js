import ViewerHandoff from './viewer-handoff';

export const metadata = {
  title: 'Open in LLMnesia Viewer',
  description: 'Open a locally saved AI conversation in the LLMnesia Viewer.',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/open'
  }
};

export default function OpenViewerPage() {
  return <ViewerHandoff />;
}
