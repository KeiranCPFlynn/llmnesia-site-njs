import Page from '../../components/core-vault';
import { corePageMetadata } from '../../../lib/core-page-metadata';

export const metadata = corePageMetadata('vault', 'es');
export default function LocalizedPage() { return <Page language="es" />; }
