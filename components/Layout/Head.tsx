import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Head: React.VFC<{ title: string }> = ({ title }) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const altLang = tsln._language === 'en' ? 'fr' : 'en'

  const [isCanadaDotCa, setIsCanadaDotCa] = useState(false)

  useEffect(() => {
    if (typeof window !== undefined) {
      const hostName = window.location.hostname
      setIsCanadaDotCa(hostName.includes('.canada.ca'))
    }
  }, [])

  console.log('next_last_modified=', process.env.NEXT_LAST_MODIFIED) // test only to be deleted later
  console.log('next_build_date=', process.env.NEXT_BUILD_DATE) // test only to be deleted later
  console.log('test=', process.env.APP_ENV)
  console.log('test #2', process.env.NEXTAUTH_SECRET)

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
            ? `https://estimateursv-oasestimator.service.canada.ca/${tsln._language}${router.pathname}`
            : `http://ep-be.alpha.servicecanada.ca/${tsln._language}${router.pathname}`
        }
      />
      <link
        rel="alternate"
        lang={altLang}
        href={
          isCanadaDotCa
            ? `https://estimateursv-oasestimator.service.canada.ca/${altLang}${router.pathname}`
            : `https://ep-be.alpha.service.canada.ca/${altLang}${router.pathname}`
        }
      />

      <link
        rel="alternate"
        lang={altLang}
        href={
          isCanadaDotCa
            ? `https://estimateursv-oasestimator.service.canada.ca/${tsln._language}${router.pathname}`
            : `https://ep-be.alpha.service.canada.ca/${tsln._language}${router.pathname}`
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
