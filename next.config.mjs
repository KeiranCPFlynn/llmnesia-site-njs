/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Enforce www as canonical domain (apex -> www).
      // Handled by Vercel's routing layer — no middleware/function invocation.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'llmnesia.com' }],
        destination: 'https://www.llmnesia.com/:path*',
        permanent: true
      },
      // Legacy path redirects
      {
        source: '/index.html',
        destination: '/',
        permanent: true
      },
      {
        source: '/privacy-policy.html',
        destination: '/privacy-policy',
        permanent: true
      },
      // Common mistyped / aliased paths that were 404ing (see GA page_not_found).
      // Contact lives as an anchor on the homepage; privacy page is /privacy-policy.
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
