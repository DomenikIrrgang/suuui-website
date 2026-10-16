import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the container image (see Dockerfile).
  output: "standalone",
  poweredByHeader: false,
  redirects() {
    return [
      // The presets moved from their own page into a section of Features.
      { source: "/presets", destination: "/features#presets", permanent: true },
    ];
  },
};

export default nextConfig;
