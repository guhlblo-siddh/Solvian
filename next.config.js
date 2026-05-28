/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error catching
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key:   'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },

  // Redirect www to non-www (optional)
  async redirects() {
    return [
      {
        source:      '/home',
        destination: '/',
        permanent:   true,
      },
    ]
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Disable powered-by header
  poweredByHeader: false,
}

module.exports = nextConfig