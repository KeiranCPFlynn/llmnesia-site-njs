import Homepage from '../components/homepage';
import { homepageMetadata } from '../../lib/homepage';

export const metadata = homepageMetadata('de');

export default function GermanHomePage() {
  return <Homepage language="de" />;
}
