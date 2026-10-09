import Page from '../../components/core-privacy';
import { corePageMetadata } from '../../../lib/core-page-metadata';

export const metadata = corePageMetadata('privacy-policy', 'es');
export default function LocalizedPage() { return <Page language="es" />; }
