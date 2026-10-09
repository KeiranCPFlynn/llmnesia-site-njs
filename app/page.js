import Homepage from './components/homepage';
import { homepageMetadata } from '../lib/homepage';

export const metadata = homepageMetadata('en');

export default function HomePage() {
  return <Homepage language="en" />;
}
