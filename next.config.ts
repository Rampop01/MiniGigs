import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['minigigs-sdk'],
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
