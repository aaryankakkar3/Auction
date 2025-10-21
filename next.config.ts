import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce verbose logging for Socket.IO polling requests
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Disable detailed request logging in development
  onDemandEntries: {
    // Keep pages in memory for 25 seconds
    maxInactiveAge: 25 * 1000,
    // Poll interval
    pagesBufferLength: 2,
  },
};

export default nextConfig;
