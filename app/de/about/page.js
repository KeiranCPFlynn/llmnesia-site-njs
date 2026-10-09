import Page from '../../components/core-about';
import { corePageMetadata } from '../../../lib/core-page-metadata';

export const metadata = corePageMetadata('about', 'de');
export default function LocalizedPage() { return <Page language="de" />; }
