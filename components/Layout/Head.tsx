import { is } from 'cypress/types/bluebird'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
//import Script from 'next/script'

export const Head: React.VFC<{ title: string }> = ({ title }) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const hostName = window.location.hostname
  const isCanadaDotCa = hostName.includes('.canada.ca')
  const altLang = tsln._language === 'en' ? 'fr' : 'en'

  return (
    <NextHead>
      <title>{title} - Canada.ca</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="author" content={tsln.meta.author} />
      <meta name="dcterms.creator" content={tsln.meta.author} />
      <meta name="dcterms.title" content={title} />
      <meta name="description" content={tsln.meta.homeDescription} />
      <meta name="dcterms.description" content={tsln.meta.homeDescription} />

      <meta
        name="dcterms.language"
        title="ISO639-2/T"
        content={tsln._language}
      />
      {/* commented out - causing issues with page render */}
      {/*<Script src="https://assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js" />*/}

      <link
        rel="canonical"
        href={
          isCanadaDotCa
            ? `oas-estimator.service.canada.ca/${tsln._language}${router.pathname}`
            : `http://ep-be.alpha.servicecanada.ca/${tsln._language}${router.pathname}`
        }
      />
      <link
        rel="alternate"
        lang={altLang}
        href={
          isCanadaDotCa
            ? `oas-estimator.service.canada.ca/${altLang}${router.pathname}`
            : `https://ep-be.alpha.service.canada.ca/${altLang}${router.pathname}`
        }
      />

      <link
        rel="alternate"
        lang={altLang}
        href={
          isCanadaDotCa
            ? `oas-estimator.service.canada.ca/${altLang}${router.pathname}`
            : `https://ep-be.alpha.service.canada.ca/${altLang}${router.pathname}`
        }
      />
      <meta name="keywords" content={tsln.meta.homeKeywords} />
      <meta
        name="dcterms.subject"
        title="gccore"
        content={tsln.meta.homeSubject}
      />
      <meta name="dcterms.issued" title="W3CDTF" content="2023-04-12" />

      {/* TODO: modify to be dynamic */}
      <meta name="dcterms.modified" title="W3CDTF" content="2023-04-12" />

      <meta name="dcterms.spatial" content="Canada" />
    </NextHead>
  )
}
