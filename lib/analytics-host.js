const PRODUCTION_HOSTS = new Set(['www.llmnesia.com', 'llmnesia.com']);

export function isProductionAnalyticsHost(hostname) {
  return PRODUCTION_HOSTS.has(hostname);
}
