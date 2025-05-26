import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdf-parse",
  ],
  images: {
    domains: ['avatars.githubusercontent.com'],
  }
};

export default nextConfig;
