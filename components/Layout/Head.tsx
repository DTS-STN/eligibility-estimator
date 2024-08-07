import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Head: React.VFC<{ title: string }> = ({ title }) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const altLang = tsln._language === 'en' ? 'fr' : 'en'

  const [isAlpha, setIsAlpha] = useState(false)

  useEffect(() => {
    if (typeof window !== undefined) {
      const hostName = window.location.hostname
      setIsAlpha(hostName.includes('.alpha.service'))
    }
  }, [])

  return (
    <NextHead>
      <title>{title} - Canada.ca</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="author" content={tsln.meta.author} />
      <meta name="dcterms.creator" content={tsln.meta.author} />
      <meta name="dcterms.title" content={title} />
      <meta name="description" content={tsln.meta.homeDescription} />
      <meta name="dcterms.description" content={tsln.meta.homeDescription} />

      <meta name="dcterms.language" title="ISO639-2/T" content={tsln.ISOlang} />
      {/* commented out - causing issues with page render */}
      {/*<Script src="https://assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js" />*/}

      <link
        rel="canonical"
        href={
          isAlpha
            ? `http://ep-be.alpha.service.canada.ca/${tsln._language}${router.pathname}`
            : `https://estimateursv-oasestimator.service.canada.ca/${tsln._language}${router.pathname}`
        }
      />
      <link
        rel="alternate"
        lang={altLang}
        href={
          isAlpha
            ? `https://ep-be.alpha.service.canada.ca/${altLang}${router.pathname}`
            : `https://estimateursv-oasestimator.service.canada.ca/${altLang}${router.pathname}`
        }
      />

      <link
        rel="alternate"
        lang={tsln._language}
        href={
          isAlpha
            ? `https://ep-be.alpha.service.canada.ca/${tsln._language}${router.pathname}`
            : `https://estimateursv-oasestimator.service.canada.ca/${tsln._language}${router.pathname}`
        }
      />
      <meta name="keywords" content={tsln.meta.homeKeywords} />
      <meta
        name="dcterms.subject"
        title="gccore"
        content={tsln.meta.homeSubject}
      />
      <meta name="dcterms.issued" title="W3CDTF" content="2023-04-12" />

      <meta
        name="dcterms.modified"
        title="W3CDTF"
        content={process.env.NEXT_BUILD_DATE}
      />

      <meta name="dcterms.spatial" content="Canada" />
      <meta name="dcterms.accessRights" content="2" />
      <meta
        name="dcterms.service"
        content="ESDC-EDSC_estimateursv-oasestimator"
      />
    </NextHead>
  )
}
