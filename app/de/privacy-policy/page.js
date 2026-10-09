import Page from '../../components/core-privacy';
import { corePageMetadata } from '../../../lib/core-page-metadata';

export const metadata = corePageMetadata('privacy-policy', 'de');
export default function LocalizedPage() { return <Page language="de" />; }
