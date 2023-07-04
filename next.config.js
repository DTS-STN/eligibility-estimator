module.exports = {
  i18n: {
    locales: ['en', 'fr', 'default'],
    defaultLocale: 'default',
  },
  reactStrictMode: true,
  outputStandalone: true,
  //
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  //
  async redirects() {
    return [
      {
        source: '/interact',
        destination: '/interact.html',
        permanent: false,
      },
      {
        source: '/en/index',
        destination: '/en',
        permanent: true,
        locale: false,
      },
      {
        source: '/fr/index',
        destination: '/fr',
        permanent: true,
        locale: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/fr/resultats',
        destination: '/fr/results',
        locale: false,
      },
    ]
  },
  env: {
    ADOBE_ANALYTICS_URL: process.env.ADOBE_ANALYTICS_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    APP_ENV: process.env.APP_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_AUTH_USERNAME: process.env.NEXT_AUTH_USERNAME,
    NEXT_AUTH_PASSWORD: process.env.NEXT_AUTH_PASSWORD,
  },
}
