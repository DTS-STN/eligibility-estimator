import { ErrorPage } from '@dts-stn/service-canada-design-system'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSessionStorage } from 'react-use'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
import { Layout } from '../../components/Layout'
import { Language } from '../../utils/api/definitions/enums'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { useTranslation } from '../../components/Hooks'
import { WebTranslations } from '../../i18n/web'
import { useEffect } from 'react'
import Head from 'next/head'

/*
 It appears that the Design System components and/or dangerouslySetInnerHTML does not properly support SSR,
 which causes React Hydration errors. Not sure what needs to change to fix this properly, so this is
 just a workaround. Updating React seems to help, but also is stricter on these issues.
 https://nextjs.org/docs/messages/react-hydration-error
 https://nextjs.org/docs/advanced-features/dynamic-import
*/
const ResultsPage = dynamic(
  () => import('../../components/ResultsPage/index'),
  { ssr: false }
)

const Results: NextPage<{ adobeAnalyticsUrl: string }> = ({
  adobeAnalyticsUrl,
}) => {
  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', {})

  const langx = useRouter().locale as Language
  const language = langx === Language.EN || Language.FR ? langx : Language.EN

  const inputHelper = new InputHelper(inputs, setInputs, language)
  const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage)
  const response: ResponseSuccess | ResponseError = mainHandler.results
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

        <meta name="robots" content="noindex" />
      </Head>
      <Layout title={tsln.resultPageTitle}>
        {'results' in response ? (
          <ResultsPage
            inputs={inputHelper.asArray}
            results={response.results}
            partnerResults={response.partnerResults}
            summary={response.summary}
          />
        ) : (
          <ErrorPage lang={language} errType="500" isAuth={false} />
        )}
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

export default Results
