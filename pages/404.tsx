import { ErrorPage } from '@dts-stn/service-canada-design-system'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Layout } from '../components/Layout'
import { useTranslation } from '../components/Hooks'
import { WebTranslations } from '../i18n/web'
import Head from 'next/head'

const Custom404: NextPage<{ adobeAnalyticsUrl: string }> = ({
  adobeAnalyticsUrl,
}) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <Head>{adobeAnalyticsUrl ? <script src={adobeAnalyticsUrl} /> : ''}</Head>
      <Layout title={tsln.pageNotFound}>
        <ErrorPage lang={router.locale} errType="404" isAuth={false} />
      </Layout>
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
