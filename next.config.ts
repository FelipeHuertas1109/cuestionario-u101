import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dejamos sin rewrites: el proxy se maneja con API Routes (app/api/*)
};

export default nextConfig;
