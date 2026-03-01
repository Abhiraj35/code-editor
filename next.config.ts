import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"*",
        port:'',
        pathname:"/**"
      }
    ]
  },
  async headers() {
    return [
      {
        // Apply to all routes to ensure cross-origin isolation everywhere
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
        ],
      },
    ];
  },
  reactStrictMode:false
};

export default nextConfig;