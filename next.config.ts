import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        //TODO: security fix currently it permits loading image from any https domian. fix it later
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      }
    ],
  },
  reactCompiler: true,
};

export default nextConfig;