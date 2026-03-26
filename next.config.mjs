/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'turbomessengers.com',
      },
    ],
  },
};

export default nextConfig;
