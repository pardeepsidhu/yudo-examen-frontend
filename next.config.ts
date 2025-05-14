import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows all domains (not officially recommended)
      },
    ],
  },

};

export default nextConfig;
