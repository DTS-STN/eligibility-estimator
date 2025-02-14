import { ErrorPage } from '@dts-stn/service-canada-design-system'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSessionStorage } from 'react-use'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
import { Layout } from '../../components/Layout'
import { Language, ResultKey } from '../../utils/api/definitions/enums'
import {
  BenefitResultsObject,
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { useTranslation } from '../../components/Hooks'
import { WebTranslations } from '../../i18n/web'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import {
  buildQuery,
  getEligibleBenefits,
  mergeUniqueObjects,
  OasEligibility,
} from '../../utils/api/helpers/utils'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { RequestSchema as schema } from '../../utils/api/definitions/schemas'

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
  const partnered =
    inputHelper.asObjectWithLanguage.maritalStatus === 'partnered'

  useEffect(() => {
    if (adobeAnalyticsUrl) {
      window.adobeDataLayer = window.adobeDataLayer || []
      window.adobeDataLayer.push({ event: 'pageLoad' })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const psdPartneredHandleAndSet = (psdAge) => {
    const clientAge = Number(inputHelper.asObjectWithLanguage.age)
    const partnerAge = Number(inputHelper.asObjectWithLanguage.partnerAge)
    const clientRes = Number(
      inputHelper.asObjectWithLanguage.yearsInCanadaSince18 ||
        Number(inputHelper.asObjectWithLanguage.yearsInCanadaSinceOAS)
    )
    const partnerRes = Number(
      inputHelper.asObjectWithLanguage.partnerYearsInCanadaSince18 ||
        Number(inputHelper.asObjectWithLanguage.partnerYearsInCanadaSinceOAS)
    )
    const partnerOnlyCanada =
      inputHelper.asObjectWithLanguage.partnerLivedOnlyInCanada === 'true'
    const partnerLivingCountry =
      inputHelper.asObjectWithLanguage.partnerLivingCountry
    const clientOnlyCanada =
      inputHelper.asObjectWithLanguage.livedOnlyInCanada === 'true'
    const livingCountry = inputHelper.asObjectWithLanguage.livingCountry
    const partnersAgeDiff = clientAge - partnerAge
    // const clientRes = Number(
    //   inputHelper.asObjectWithLanguage.yearsInCanadaSince18
    // )
    // const partnerRes = Number(
    //   inputHelper.asObjectWithLanguage.partnerYearsInCanadaSince18
    // )
    const psdAgeDiff = Number(psdAge - clientAge)
    const psdPartnerAge = partnerAge + psdAgeDiff

    const clientEliObj = OasEligibility(
      clientAge,
      clientRes,
      clientOnlyCanada,
      livingCountry
    )

    const partnerEliObj = OasEligibility(
      partnerAge,
      partnerRes,
      partnerOnlyCanada,
      partnerLivingCountry
    )

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

    const psdHandler = new MainHandler({
      ...psdQuery,
      psdAge,
      clientEliObj,
      partnerEliObj,
    })
    const psdResults: ResponseSuccess | ResponseError = psdHandler.results

    console.log('psdAge', psdAge)
    console.log('psdPartnerAge', psdPartnerAge)
    console.log('psdResults', psdResults)

    if ('results' in psdResults) {
      // we need {68: {oas, gis}} and {64.333: {oas, gis}} for client and partner
      const clientPsd = { [psdAge]: psdResults.results }
      const partnerPsd = { [psdPartnerAge]: psdResults.partnerResults }

      console.log(
        'psdResults.futurePartnerResults',
        psdResults.futurePartnerResults
      )

      const partialFutureClientResults = psdResults.futureClientResults
        ? psdResults.futureClientResults.concat(clientPsd)
        : [clientPsd]

      const unfilteredFuturePartner: BenefitResultsObject[] =
        psdResults.futurePartnerResults
          ? psdResults.futurePartnerResults.concat(partnerPsd)
          : [partnerPsd]

      // const partialFuturePartnerResults = unfilteredFuturePartner

      const partialFuturePartnerResults = unfilteredFuturePartner.filter(
        (obj) => {
          const ageKey = Object.keys(obj)[0]
          const benefits = obj[ageKey]

          console.log('ageKey', ageKey)
          console.log('benefits', benefits)
          console.log('Object.values(benefits)', Object.values(benefits))

          // Check if at least one benefit is **not** "ineligible"
          const hasEligibleBenefit = Object.values(benefits).some(
            (benefit: any) => {
              const eligibility = benefit.eligibility || {}
              return eligibility.result && eligibility.result !== 'ineligible'
            }
          )

          console.log('hasEligibleBenefit', hasEligibleBenefit)
          return hasEligibleBenefit
        }
      )

      console.log('partialFutureClientResults', partialFutureClientResults)
      console.log('partialFuturePartnerResults', partialFuturePartnerResults)

      const responseClone = JSON.parse(JSON.stringify(originalResponse))

      console.log('partialFutureClientResults', partialFutureClientResults)
      console.log(
        'responseClone.futureClientResults',
        responseClone.futureClientResults
      )

      const mergedClientRes = mergeUniqueObjects(
        partialFutureClientResults,
        responseClone?.futureClientResults
      ).sort((a, b) => {
        const ageA = Object.keys(a)[0]
        const ageB = Object.keys(b)[0]
        return Number(ageA) - Number(ageB)
      })

      console.log(
        'partialFuturePartnerResults',
        getEligibleBenefits(partialFuturePartnerResults)
      )
      const mergedPartnerRes = mergeUniqueObjects(
        partialFuturePartnerResults,
        responseClone?.futurePartnerResults
      ).sort((a, b) => {
        const ageA = Object.keys(a)[0]
        const ageB = Object.keys(b)[0]
        return Number(ageA) - Number(ageB)
      })

      //TODO:
      // iterate through the mergedClientRes/mergedPartnerRes to see what to keep/recalculate
      // (mergedClientRes): if age < psdAge, decide what to do... keep or recalculate or throw away - if client OAS in this case throw away since age < psdAge, keep ALW
      // if age < psdAge but eligible for ALW, keep it
      // if age === psdAge, keep this and everything after
      // (mergedPartnerRes):, we can look at an age, get equivalent client psdAge, ask "is it in the (now cleaned) mergedClientRes?". If it is, keep it, if it is not, then determine if the age is EliAge and if it is, recalculate, if not, then delete

      const mappedClientRes = mergedClientRes
        .map((ageRes) => {
          const currAge = Number(Object.keys(ageRes)[0])
          if (currAge < psdAge) {
            const hasAlw = Object.values(ageRes)[0].hasOwnProperty('alw')
            return hasAlw ? ageRes : null
          }

          if (currAge >= psdAge) {
            return ageRes
          }
        })
        .filter((obj) => obj !== null)
      const clientResAges = mappedClientRes.map((obj) => Object.keys(obj)[0])

      console.log('mergedClientRes', mergedClientRes)
      console.log('mergedPartnerRes', mergedPartnerRes)
      const mappedPartnerRes = mergedPartnerRes
        .map((ageRes) => {
          const currAge = Number(Object.keys(ageRes)[0])
          const equivClientAge = String(currAge + partnersAgeDiff)
          console.log('currAge', currAge)
          console.log('equiv', equivClientAge)
          if (!clientResAges.includes(equivClientAge)) {
            // TODO: if eliage, recalculate and add result, else set to null

            console.log('we are in the IF BLOCK')
            console.log('partnerOnlyCanada', partnerOnlyCanada)
            console.log('partnerEliObj', partnerEliObj)

            if (currAge === partnerEliObj.ageOfEligibility) {
              console.log('HERE IS WHERE THE MAGIC HAPPENS')
              // This means that the partner became independently eligible for OAS before the client's pension start date,
              // so we should recalculate it using a different rate table (since user is not going to be receiving OAS at this time)

              const partnerQuery = buildQuery(
                inputHelper.asObjectWithLanguage,
                [equivClientAge, currAge],
                null,
                null,
                null,
                null,
                null,
                null
              )

              //TODO: get correct inputs here so we can arrive at the right answer
              partnerQuery['livedOnlyInCanada'] = 'true'
              partnerQuery['yearsInCanadaSince18'] = 5
              partnerQuery['clientEliObj'] = clientEliObj
              partnerQuery['partnerEliObj'] = partnerEliObj

              console.log('partnerQuery', partnerQuery)

              const { value } = schema.validate(partnerQuery, {
                abortEarly: false,
              })
              const partnerHandler = new BenefitHandler(value)

              const newPartnerResults = getEligibleBenefits(
                partnerHandler.benefitResults.partner
              )

              return { [currAge]: newPartnerResults }
            } else {
              return null
            }
          } else {
            return ageRes
          }
        })
        .filter((obj) => obj !== null)

      console.log('mappedClientRes', mappedClientRes)
      console.log('mappedPartnerRes', mappedPartnerRes)

      responseClone.futureClientResults = mappedClientRes
      responseClone.futurePartnerResults = mappedPartnerRes

      console.log('mappedPartnerRes AFTER MAPPING', mappedPartnerRes)

      console.log('responseClone', responseClone)

      // if some condition
      // responseClone.results.oas.eligibility.result = ResultKey.INELIGIBLE

      responseClone.results.oas.eligibility.result = ResultKey.INELIGIBLE
      responseClone.results.gis.eligibility.result = ResultKey.INELIGIBLE
      responseClone.partnerResults.alw.eligibility.result = ResultKey.INELIGIBLE

      //TODO:
      // Now address the "results" in responseClone.
      // if age < psdAge but eligible for ALW, keep the equivalent partner result
      // "Delete" all oas/gis from client results if < psdAge by setting to 'ineligible'
      //

      setResponse(responseClone)
      setPsdResponse(responseClone)

      console.log('response', response)
      console.log('responseCloneAFTER', responseClone)
    }

    // iterate over results and partnerResults. These are the future results for psdAges
  }

  const mainHandleAndSet = () => {
    const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage)
    const response: ResponseSuccess | ResponseError = mainHandler.results
    setResponse(response)
    setOriginalResponse(response)
  }

  useEffect(() => {
    if (Object.keys(psdResponse).length !== 0) {
      partnered
        ? psdPartneredHandleAndSet(psdAge)
        : psdSingleHandleAndSet(psdAge)
    } else {
      mainHandleAndSet()
    }
  }, [language])

  const handleUpdateEstimate = (psdAge, maxEliAge) => {
    console.log('psd AGE', psdAge)

    setPsdAge(psdAge)
    if (psdAge === maxEliAge) {
      setResponse(originalResponse)
      setPsdResponse({})
    } else {
      partnered
        ? psdPartneredHandleAndSet(psdAge)
        : psdSingleHandleAndSet(psdAge)
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
            psdCalc={!!psdAge}
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
