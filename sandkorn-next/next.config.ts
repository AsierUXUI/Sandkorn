import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Sandkorn',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Sandkorn',
  },
};

export default nextConfig;
