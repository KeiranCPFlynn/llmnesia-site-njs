import Page from '../../components/core-pricing';
import { corePageMetadata } from '../../../lib/core-page-metadata';

export const metadata = corePageMetadata('pricing', 'de');
export default function LocalizedPage() { return <Page language="de" />; }
