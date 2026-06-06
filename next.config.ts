import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // Prevent Next.js from using ~/package-lock.json as the monorepo root
  outputFileTracingRoot: projectRoot,
  transpilePackages: ["leaflet", "react-leaflet"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
