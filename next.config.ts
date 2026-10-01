import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Route navigations animate through React's <ViewTransition> (crossfade + shared-element morphs).
    viewTransition: true,
  },
  // Systems and Intelligence were folded into project pages; keep old links working.
  async redirects() {
    return [
      { source: '/systems', destination: '/journey/axelliant', permanent: true },
      { source: '/intelligence', destination: '/products/deepshield', permanent: true },
    ];
  },
};

export default nextConfig;
