/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.llmnesia.com' }],
        destination: 'https://llmnesia.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
