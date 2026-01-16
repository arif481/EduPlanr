/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },

  // Environment variables exposed to browser
  env: {
    APP_NAME: 'EduPlanr',
    APP_VERSION: '1.0.0',
  },
};

module.exports = nextConfig;
