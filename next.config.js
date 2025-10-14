/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Webpack configuration for canvas/PDF handling
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  
  // Production optimizations
  swcMinify: true,
  
  // Output configuration for standalone build
  output: 'standalone',
  
  // Image optimization (add domains if using external images)
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

