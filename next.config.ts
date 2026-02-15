import type { NextConfig } from "next";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;