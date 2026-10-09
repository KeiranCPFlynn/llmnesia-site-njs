import Page from '../../components/core-about';
import { corePageMetadata } from '../../../lib/core-page-metadata';

export const metadata = corePageMetadata('about', 'es');
export default function LocalizedPage() { return <Page language="es" />; }
