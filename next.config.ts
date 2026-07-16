import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/dashboard/bookings/:id*",
        destination: "/bookings/:id*",
        permanent: true,
      },
      {
        source: "/dashboard/bookings",
        destination: "/bookings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
