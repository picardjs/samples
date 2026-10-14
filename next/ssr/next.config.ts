import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // picard-js is loaded from node_modules at runtime instead of being bundled
  serverExternalPackages: ["picard-js"],
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
