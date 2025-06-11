/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Ensure proper module resolution
  webpack: (config, { isServer }) => {
    // Add any custom webpack config if needed
    return config;
  },
};

export default nextConfig;
