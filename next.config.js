/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Enable static export for better SEO
  trailingSlash: true,
  transpilePackages: [
    "@uiw/react-md-editor",
    "@uiw/react-markdown-preview",
    "rehype-prism-plus",
  ],
  // Image optimization
  images: {
    domains: ["theeasyq.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Optimize bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all";
    }
    return config;
  },

  // Enable gzip compression
  compress: true,

  // PWA configuration (optional)
  experimental: {
    //   optimizeCss: true,
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
