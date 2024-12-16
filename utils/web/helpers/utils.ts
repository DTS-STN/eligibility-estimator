export function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16)
  })
}

export async function dataFetcher(url) {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

export const sendAnalyticsRequest = (
  lang: string,
  title: string,
  creator: string,
  window: Window & typeof globalThis & { adobeDataLayer: any; _satellite: any }
) => {
  if (typeof window !== undefined && window.adobeDataLayer) {
    window.adobeDataLayer.push({
      event: 'pageLoad',
      page: {
        title: title.trim(),
        language: lang.trim(),
        creator: creator.trim(),
        accessRights: '2',
        service:
          'ESDC-EDSC_OldAgeBenefitsEstimator-EstimateurDePrestationsDeVieillesse',
      },
    })
  }
}

export const consoleDev = (...messages) => {
  if (process.env.APP_ENV !== 'production') console.log(...messages)
}
