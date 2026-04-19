import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Sandkorn',
  images: { unoptimized: true },
};

export default nextConfig;
