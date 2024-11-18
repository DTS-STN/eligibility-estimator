import { NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { useTranslation } from '../../components/Hooks'
import { WebTranslations } from '../../i18n/web'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import StepperPage from '../../components/StepperPage'
import React from 'react'

const defaultStep = 'marital' // Define the first step here
const steps = ['marital', 'age', 'income', 'residence']

const Stepper: NextPage<{ adobeAnalyticsUrl: string }> = ({
  adobeAnalyticsUrl,
}) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const [pageTitle, setPageTitle] = useState(tsln.questionPageTitle)

  useEffect(() => {
    if (adobeAnalyticsUrl) {
      window.adobeDataLayer = window.adobeDataLayer || []
      window.adobeDataLayer.push({ event: 'pageLoad' })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { step } = router.query

  useEffect(() => {
    // Redirect to the default step if no step is specified or the step is invalid
    if (!step || typeof step !== 'string' || !steps.includes(step)) {
      router.replace(`/questions?step=${defaultStep}`)
    }
  }, [step, router])

  // Prevent rendering during redirect. Do not try to render when no step in URL.
  if (!step || typeof step !== 'string' || !steps.includes(step)) {
    return null
  }

  return (
    <>
      <Head>
        {adobeAnalyticsUrl ? <script src={adobeAnalyticsUrl} /> : ''}
        <meta name="robots" content="noindex" />
      </Head>

      <Layout title={`${tsln.introPageTitle} - ${pageTitle}`}>
        <StepperPage setPageTitle={setPageTitle} />
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

export default Stepper
