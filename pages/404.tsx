import { ErrorPage } from '@dts-stn/service-canada-design-system'
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
  }, [])

  return (
    <>
      <Head>
        {adobeAnalyticsUrl ? <script src={adobeAnalyticsUrl} /> : ''}

        {/* need to set up proper value
        <meta name="dcterms.title" content="[insert value here]"/> 
        <meta name="dcterms.language" content="[insert value here]"/> 
        <meta name="dcterms.creator" content="[insert value here]"/>	
        <meta name="dcterms.accessRights" content="[insert value here]"/> 
        <meta name="dcterms.service" content="[insert value here]"/> 
        */}
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
  console.log(
    'process.env.ADOBE_ANALYTICS_URL',
    process.env.ADOBE_ANALYTICS_URL
  )
  return {
    props: {
      adobeAnalyticsUrl: process.env.ADOBE_ANALYTICS_URL,
    },
  }
}
export default Custom404
