import Homepage from '../components/homepage';
import { homepageMetadata } from '../../lib/homepage';

export const metadata = homepageMetadata('es');

export default function SpanishHomePage() {
  return <Homepage language="es" />;
}
