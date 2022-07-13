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
  async rewrites() {
    return [
      {
        source: '/fr',
        destination: '/index',
      },
      {
        source: '/fr/admissibilite',
        destination: '/eligibility',
        locale: false,
      },
      {
        source: '/admissibilite',
        destination: '/eligibility',
        locale: undefined,
      },
      {
        source: '/fr/resultats',
        destination: '/results',
        locale: false,
      },
      {
        source: '/résultats',
        destination: '/results',
        locale: undefined,
      },
    ]
  },
}
