import { NextPage } from 'next'
import { QuestionsPage } from '../../components/QuestionsPage'
import { Layout } from '../../components/Layout'
import { useTranslation } from '../../components/Hooks'
import { WebTranslations } from '../../i18n/web'
import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Questions: NextPage<{ adobeAnalyticsUrl: string }> = ({
  adobeAnalyticsUrl,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const language = useRouter().locale

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
        <meta name="robots" content="noindex" />
      </Head>

      <Layout title={tsln.questionPageTitle}>
        <QuestionsPage />
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

export default Questions
