import { ErrorPage } from '@dts-stn/service-canada-design-system'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSessionStorage } from 'react-use'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
import { Layout } from '../../components/Layout'
import { Language, ResultKey } from '../../utils/api/definitions/enums'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { useTranslation } from '../../components/Hooks'
import { WebTranslations } from '../../i18n/web'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { buildQuery } from '../../utils/api/helpers/utils'

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
  const [_inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', {})

  const langx = useRouter().locale as Language
  const language =
    langx === Language.EN || langx === Language.FR ? langx : Language.EN

  const [response, setResponse]: [any, (value: any) => void] =
    useSessionStorage('calculationResults', {})

  const [psdResponse, setPsdResponse]: [any, (value: any) => void] = useState(
    {}
  )

  const [originalResposne, setOriginalResponse]: [any, (value: any) => void] =
    useSessionStorage('originalResponse', {})

  const [savedInputs, _setSavedInputs]: [any, (value: any) => void] =
    useSessionStorage('resultPageInputs', {})

  const inputHelper = new InputHelper(
    'inputs' in savedInputs ? savedInputs.inputs : {},
    setInputs,
    language
  )

  const [psdAge, setPsdAge] = useState(null)

  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    if (adobeAnalyticsUrl) {
      window.adobeDataLayer = window.adobeDataLayer || []
      window.adobeDataLayer.push({ event: 'pageLoad' })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const psdHandleAndSet = (psdAge) => {
    const psdHandler = new MainHandler({
      ...inputHelper.asObjectWithLanguage,
      psdAge,
    })

    const psdResults: ResponseSuccess | ResponseError = psdHandler.results
    if ('results' in psdResults) {
      psdResults.results.oas.eligibility.result = ResultKey.INELIGIBLE
      psdResults.results.gis.eligibility.result = ResultKey.INELIGIBLE
    }

    setResponse(psdResults)
    setPsdResponse(psdResults)
  }

  const mainHandleAnsSet = () => {
    const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage)
    const response: ResponseSuccess | ResponseError = mainHandler.results
    setResponse(response)
    setOriginalResponse(response)
  }

  useEffect(() => {
    if (Object.keys(psdResponse).length !== 0) {
      psdHandleAndSet(psdAge)
    } else {
      mainHandleAnsSet()
    }
  }, [language])

  const handleUpdateEstimate = (psdAge, maxEliAge) => {
    console.log('psd AGE', psdAge)
    const partnered =
      inputHelper.asObjectWithLanguage.maritalStatus === 'partnered'
    setPsdAge(psdAge)
    if (partnered) {
      const clientAge = Number(inputHelper.asObjectWithLanguage.age)
      const partnerAge = Number(inputHelper.asObjectWithLanguage.partnerAge)
      // const clientRes = Number(
      //   inputHelper.asObjectWithLanguage.yearsInCanadaSince18
      // )
      // const partnerRes = Number(
      //   inputHelper.asObjectWithLanguage.partnerYearsInCanadaSince18
      // )
      const ageDiff = Number(psdAge - clientAge)
      const psdPartnerAge = partnerAge + ageDiff

      // const partnerOnlyInCanada =
      //   inputHelper.asObjectWithLanguage.partnerLivedOnlyInCanada

      // for partnered case only we need to build a query
      const psdQuery = buildQuery(
        inputHelper.asObjectWithLanguage,
        [psdAge, psdPartnerAge],
        null,
        null,
        null,
        null,
        null,
        null
      )

      const psdHandler = new MainHandler({ ...psdQuery, psdAge })
      const psdResponse: ResponseSuccess | ResponseError = psdHandler.results

      console.log('psdResponse', psdResponse)
    } else {
      // Single and Widowed scenarios
      console.log('psdAge', psdAge)

      if (psdAge === maxEliAge) {
        setResponse(originalResposne)
        setPsdResponse({})
      } else {
        psdHandleAndSet(psdAge)
      }
    }
  }

  console.log('psdAge FROM STATE IN RESULTS', psdAge)
  return (
    <>
      <Head>
        {adobeAnalyticsUrl ? <script src={adobeAnalyticsUrl} /> : ''}
        <meta name="robots" content="noindex" />
      </Head>

      <Layout title={tsln.resultPageTitle}>
        {'results' in response && inputHelper.asArray.length !== 0 ? (
          <ResultsPage
            inputHelper={inputHelper}
            results={response.results}
            futureClientResults={response.futureClientResults}
            futurePartnerResults={response.futurePartnerResults}
            partnerResults={response.partnerResults}
            handleUpdateEstimate={handleUpdateEstimate}
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
