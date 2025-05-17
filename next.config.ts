/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['*'], // Allow images from all domains
  },
  // Prevent type errors during build time
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Prevent ESLint errors during build time
  eslint: {
    // Only run ESLint on these directories
    dirs: ['pages', 'components', 'lib', 'src'],
    // Don't run ESLint during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;