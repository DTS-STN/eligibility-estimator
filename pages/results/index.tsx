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

    let psdResults: ResponseSuccess | ResponseError = psdHandler.results

    if ('results' in psdResults) {
      const responseClone = JSON.parse(JSON.stringify(originalResponse))

      const getDeferralTable = () => {
        if (Array.isArray(responseClone.futureClientResults)) {
          const oasEntry = responseClone.futureClientResults
            .flatMap((item) => Object.values(item))
            .find((entry: any) => entry?.oas)
          return oasEntry?.oas?.cardDetail?.meta?.tableData ?? []
        }

        return responseClone.results?.oas?.cardDetail?.meta?.tableData ?? []
      }

      const filteredDeferralTable = getDeferralTable().filter((row) => {
        return row.age > psdAge
      })

      // Check if the `tableData` field exists on present results before updating
      if (psdResults.results.oas.cardDetail.meta?.tableData) {
        psdResults.results.oas.cardDetail.meta.tableData = filteredDeferralTable
      }

      // If updating a future result (e.g., age 69)
      const futureResultWithOAS = psdResults.futureClientResults?.find(
        (entry) => Object.values(entry).some((benefit: any) => benefit?.oas)
      )

      if (futureResultWithOAS) {
        const ageKey = Object.keys(futureResultWithOAS).find(
          (key) => futureResultWithOAS[key]?.oas
        )

        if (ageKey) {
          futureResultWithOAS[ageKey].oas.cardDetail.meta.tableData =
            filteredDeferralTable
        }
      }

      psdResults.results.oas.eligibility.result = ResultKey.INELIGIBLE
      psdResults.results.gis.eligibility.result = ResultKey.INELIGIBLE
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

    // Build a query and get estimate results for pension start date (PSD) age
    // "Current" results are results for the PSD age
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

    if ('results' in psdResults) {
      const clientPsd = {
        [psdAge]: getEligibleBenefits(psdResults.results) || {},
      }
      const partnerPsd = {
        [psdPartnerAge]: getEligibleBenefits(psdResults.partnerResults) || {},
      }

      const partialFutureClientResults = psdResults.futureClientResults
        ? psdResults.futureClientResults.concat(clientPsd)
        : [clientPsd]

      const unfilteredFuturePartner: BenefitResultsObject[] =
        psdResults.futurePartnerResults
          ? psdResults.futurePartnerResults.concat(partnerPsd)
          : [partnerPsd]

      const partialFuturePartnerResults = unfilteredFuturePartner.filter(
        (obj) => {
          const ageKey = Object.keys(obj)[0]
          const benefits = obj[ageKey]

          const hasEligibleBenefit = Object.values(benefits).some(
            (benefit: any) => {
              const eligibility = benefit.eligibility || {}
              return eligibility.result && eligibility.result !== 'ineligible'
            }
          )

          return hasEligibleBenefit
        }
      )

      const responseClone = JSON.parse(JSON.stringify(originalResponse))

      const mergedClientRes = mergeUniqueObjects(
        partialFutureClientResults,
        responseClone?.futureClientResults
      ).sort((a, b) => {
        const ageA = Object.keys(a)[0]
        const ageB = Object.keys(b)[0]
        return Number(ageA) - Number(ageB)
      })

      const mergedPartnerRes = mergeUniqueObjects(
        partialFuturePartnerResults,
        responseClone?.futurePartnerResults
      ).sort((a, b) => {
        const ageA = Object.keys(a)[0]
        const ageB = Object.keys(b)[0]
        return Number(ageA) - Number(ageB)
      })

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

      const mappedPartnerRes = mergedPartnerRes
        .map((ageRes) => {
          const currAge = Number(Object.keys(ageRes)[0])
          const equivClientAge = String(currAge + partnersAgeDiff)

          if (!clientResAges.includes(equivClientAge)) {
            if (currAge === partnerEliObj.ageOfEligibility) {
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

              partnerQuery['livedOnlyInCanada'] = 'false'
              partnerQuery['yearsInCanadaSince18'] = '5' // We are forcing the user to be ineligible for OAS
              partnerQuery['everLivedSocialCountry'] = 'true'
              partnerQuery['partnerBenefitStatus'] = 'helpMe'
              partnerQuery['clientEliObj'] = clientEliObj
              partnerQuery['partnerEliObj'] = partnerEliObj

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

      responseClone.futureClientResults = mappedClientRes
      responseClone.futurePartnerResults = mappedPartnerRes

      responseClone.results.oas.eligibility.result = ResultKey.INELIGIBLE
      responseClone.results.gis.eligibility.result = ResultKey.INELIGIBLE
      responseClone.partnerResults.alw.eligibility.result = ResultKey.INELIGIBLE

      setResponse(responseClone)
      setPsdResponse(responseClone)
    }
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
