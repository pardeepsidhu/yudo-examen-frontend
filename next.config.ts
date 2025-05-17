import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows all domains (not officially recommended)
      },
      {
        protocol: 'http',
        hostname: '**', // allows all domains (not officially recommended)
      },
    ],
  },
};

export default nextConfig;