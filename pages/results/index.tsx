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

  const [originalResponse, setOriginalResponse]: [any, (value: any) => void] =
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

  const mergeUniqueObjects = (arr1, arr2) => {
    arr1 = arr1 || []
    arr2 = arr2 || []
    const resultMap = new Map()

    arr1.forEach((obj) => {
      const key = Object.keys(obj)[0]
      resultMap.set(Number(key), obj)
    })

    arr2.forEach((obj) => {
      const key = Object.keys(obj)[0]
      if (!resultMap.has(Number(key))) {
        resultMap.set(Number(key), obj)
      }
    })

    return Array.from(resultMap.values())
  }

  const psdSingleHandleAndSet = (psdAge) => {
    const psdHandler = new MainHandler({
      ...inputHelper.asObjectWithLanguage,
      psdAge,
    })

    const psdResults: ResponseSuccess | ResponseError = psdHandler.results
    if ('results' in psdResults) {
      psdResults.results.oas.eligibility.result = ResultKey.INELIGIBLE
      psdResults.results.gis.eligibility.result = ResultKey.INELIGIBLE

      // TODO: Ask if we can avoid doing the below step
      // TODO?: Might have to go inside "results" and pull out oas/gis 'cardDetail' and then iterate over the futureClientResults in the psdResults and replace the cardDetail for every age
    }

    setResponse(psdResults)
    setPsdResponse(psdResults)
  }

  const mainHandleAndSet = () => {
    const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage)
    const response: ResponseSuccess | ResponseError = mainHandler.results
    setResponse(response)
    setOriginalResponse(response)
  }

  useEffect(() => {
    if (Object.keys(psdResponse).length !== 0) {
      psdSingleHandleAndSet(psdAge)
    } else {
      mainHandleAndSet()
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
      const psdResults: ResponseSuccess | ResponseError = psdHandler.results

      console.log('psdAge', psdAge)
      console.log('psdPartnerAge', psdPartnerAge)
      console.log('psdResults', psdResults)

      if ('results' in psdResults) {
        // we need {68: {oas, gis}} and {64.333: {oas, gis}} for client and partner
        const clientPsd = { [psdAge]: psdResults.results }
        const partnerPsd = { [psdPartnerAge]: psdResults.partnerResults }

        const tempFutureClientResults = psdResults.futureClientResults
          ? psdResults.futureClientResults.concat(clientPsd)
          : [clientPsd]

        const tempFuturePartnerResults = psdResults.futurePartnerResults
          ? psdResults.futurePartnerResults.concat(partnerPsd)
          : [partnerPsd]

        console.log('tempFutureClientResults', tempFutureClientResults)
        console.log('tempFuturePartnerResults', tempFuturePartnerResults)

        const responseClone = JSON.parse(JSON.stringify(response))
        console.log('responseClone', responseClone)

        console.log('tempFutureClientResults', tempFutureClientResults)
        console.log(
          'responseClone.futureClientResults',
          responseClone.futureClientResults
        )

        const mergedClientRes = mergeUniqueObjects(
          tempFutureClientResults,
          responseClone?.futureClientResults
        ).sort((a, b) => {
          const ageA = Object.keys(a)[0]
          const ageB = Object.keys(b)[0]
          return Number(ageA) - Number(ageB)
        })

        const mergedPartnerRes = mergeUniqueObjects(
          tempFuturePartnerResults,
          responseClone?.futurePartnerResults
        ).sort((a, b) => {
          const ageA = Object.keys(a)[0]
          const ageB = Object.keys(b)[0]
          return Number(ageA) - Number(ageB)
        })

        //TODO:
        // iterate through the mergedClientRes/mergedPartnerRes to see what to keep/recalculate
        // (mergedClientRes): if age < psdAge, decide what to do... keep or recalculate or throw away - if client OAS in this case throw away since age < psdAge
        // (mergedPartnerRes): if age < psdAGe, determine if equals eligibility age. If yes, recalculate, if not, discard
        // if age < psdAge but eligible for ALW, keep the equivalent partner result
        // if age === psdAge, keep this and everything after

        //TODO:
        // if age < psdAge but eligible for ALW, keep the equivalent partner result
        // Now address the "results" in responseClone. "Delete" all oas/gis from client results if < psdAge by setting to 'ineligible'
        //

        console.log('response', response)
        console.log('responseCloneAFTER', responseClone)

        console.log('mergedClientRes', mergedClientRes)
        console.log('mergedPartnerRes', mergedPartnerRes)
      }

      // iterate over results and partnerResults. These are the future results for psdAges
    } else {
      // Single and Widowed scenarios
      console.log('psdAge', psdAge)

      if (psdAge === maxEliAge) {
        setResponse(originalResponse)
        setPsdResponse({})
      } else {
        psdSingleHandleAndSet(psdAge)
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
