module.exports = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  reactStrictMode: true,
  experimental: {
    // https://nextjs.org/docs/advanced-features/output-file-tracing
    outputStandalone: true,
  },
  async redirects() {
    return [
      {
        source: '/interact',
        destination: '/interact.html',
        permanent: false,
      },
    ]
  },
}
