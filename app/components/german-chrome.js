import LocalizedChrome from './localized-chrome';
import { languageCampaign } from '../../lib/site-language';

export const GERMAN_CTA_UTM = languageCampaign('de');

export default function GermanChrome({ children }) {
  return <LocalizedChrome language="de">{children}</LocalizedChrome>;
}
