import Page from '../components/core-about';
import { corePageMetadata } from '../../lib/core-page-metadata';

export const metadata = corePageMetadata('about', 'en');
export default function AboutPage() { return <Page />; }
