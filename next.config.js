module.exports = {
  i18n: {
    locales: ['en', 'fr', 'default'],
    defaultLocale: 'default',
  },
  reactStrictMode: true,
  outputStandalone: true,
  //
  async redirects() {
    return [
      {
        source: '/interact',
        destination: '/interact.html',
        permanent: false,
      },
      {
        source: '/default/:path*',
        destination: '/en/:path*',
        permanent: true,
        locale: false,
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
  env: {
    ADOBE_ANALYTICS_URL: process.env.ADOBE_ANALYTICS_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    APP_ENV: process.env.APP_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_AUTH_USERNAME: process.env.NEXT_AUTH_USERNAME,
    NEXT_AUTH_PASSWORD: process.env.NEXT_AUTH_PASSWORD,
  },
}
