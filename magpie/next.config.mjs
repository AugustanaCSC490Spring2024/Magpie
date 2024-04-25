/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://api.openai.com/:path*',
        },
      ];
    },
  };

export default nextConfig;
