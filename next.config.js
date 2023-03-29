module.exports = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  reactStrictMode: true,
  // this supposed to work
  outputStandalone: true,
  // .
  async redirects() {
    return [
      {
        source: '/interact',
        destination: '/interact.html',
        permanent: false,
      },
    ]
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_AUTH_USERNAME: process.env.NEXT_AUTH_USERNAME,
    NEXT_AUTH_PASSWORD: process.env.NEXT_AUTH_PASSWORD,
  },
}
