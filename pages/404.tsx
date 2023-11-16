import { ErrorPage } from '../components/Layout/ErrorPage'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Layout } from '../components/Layout'
import { useTranslation } from '../components/Hooks'
import { WebTranslations } from '../i18n/web'
import Head from 'next/head'

const Custom404: NextPage<{ adobeAnalyticsUrl: string }> = ({
  adobeAnalyticsUrl,
}) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    if (adobeAnalyticsUrl) {
      window.adobeDataLayer = window.adobeDataLayer || []
      window.adobeDataLayer.push({ event: 'pageLoad' })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        {adobeAnalyticsUrl ? <script src={adobeAnalyticsUrl} /> : ''}
        <meta
          name="dcterms.title"
          content={`${tsln.introPageTitle} - ${tsln.pageNotFound}`}
        />
        <meta name="dcterms.language" content={router.locale} />
        <meta
          name="dcterms.creator"
          content="Employment and Social Development Canada/Emploi et Développement social Canada"
        />
        <meta name="dcterms.accessRights" content="2" />
        <meta name="dcterms.service" content="ESDC-EDSC_DC-CD" />
      </Head>
      <Layout title={tsln.pageNotFound}>
        <ErrorPage lang={router.locale} errType="404" isAuth={false} />
      </Layout>
      {adobeAnalyticsUrl ? (
        <script type="text/javascript">_satellite.pageBottom()</script>
      ) : (
        ''
      )}
    </>
  )
}

export const getStaticProps = async () => {
  return {
    props: {
      adobeAnalyticsUrl: process.env.ADOBE_ANALYTICS_URL,
    },
  }
}
export default Custom404
