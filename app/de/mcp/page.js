import Page from '../../components/core-mcp';
import { corePageMetadata } from '../../../lib/core-page-metadata';

export const metadata = corePageMetadata('mcp', 'de');
export default function LocalizedPage() { return <Page language="de" />; }
