/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['droppurity.s3.ap-southeast-2.amazonaws.com'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  }
};

module.exports = nextConfig;
