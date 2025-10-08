/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for Amplify deployment
  // Amplify handles the build process

  // Image optimization for Amplify
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },

  // Trailing slash for better compatibility
  trailingSlash: true,

  // Experimental features
  experimental: {
    esmExternals: 'loose',
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Budget Tracker',
    NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'COP',
  },

  // Webpack configuration for better bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        canvas: false,
      };
    }

    // Handle jsPDF and related dependencies
    config.externals = config.externals || [];
    config.externals.push({
      'html2canvas': 'html2canvas',
      'dompurify': 'dompurify',
      'canvg': 'canvg'
    });

    // Ignore optional dependencies that might cause issues
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
    };

    return config;
  },
}

module.exports = nextConfig