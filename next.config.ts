/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['geist'],
  },
};

module.exports = nextConfig;