import LocalizedInstallation, { installationMetadata } from '../../components/localized-installation';

export const metadata = installationMetadata('es');

export default function InstallationPage() {
  return <LocalizedInstallation language="es" />;
}
