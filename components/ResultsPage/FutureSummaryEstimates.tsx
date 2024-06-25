import { useRouter } from 'next/router'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language } from '../../utils/api/definitions/enums'
import { useTranslation } from '../Hooks'
import { FutureBenefitEstimate } from './FutureBenefitEstimate'

export const FutureSummaryEstimates: React.VFC<{
  futureResults: any
  futurePartnerResults: any
  partner?: boolean
  partnerNoOAS: boolean
  multipleResults: boolean
  eligibleOAS: boolean
  userAge: any
}> = ({
  futureResults,
  futurePartnerResults,
  partner = false,
  partnerNoOAS,
  multipleResults,
  eligibleOAS,
  userAge,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)
  const language = useRouter().locale as Language

  const multipleOAS_GIS =
    futureResults.filter((obj) => !!obj[Object.keys(obj)[0]]['oas']).length > 1

  let arr1
  let arr2
  futurePartnerResults = futurePartnerResults ? futurePartnerResults : []

  if (futureResults.length < futurePartnerResults.length) {
    partner = true
    arr1 = futurePartnerResults
    arr2 = futureResults
  } else {
    arr1 = futureResults
    arr2 = futurePartnerResults
  }

  console.log(futureResults)
  console.log(futurePartnerResults)

  const results = arr1.map((obj1, index) => [
    obj1,
    arr2[index] ? arr2[index] : null,
  ])

  console.log(results)
  const currentYear = new Date().getFullYear()

  const headingYears = arr1.map((item) => {
    const age = parseInt(Object.keys(item)[0])
    return currentYear + (age - Math.round(userAge))
  })

  const getHeadingYear = (year, index) => {
    let yearStr
    if (index == 0) {
      yearStr = year
    } else {
      yearStr =
        language == 'fr'
          ? `${apiTrans.detail.lastYearEligible} ${year}`
          : `${year} ${apiTrans.detail.lastYearEligible}`
    }
    return yearStr
  }

  return (
    <div>
      {results.map((innerArray, index) => (
        <div className="mb-7" key={index}>
          <h3 className="h3">{getHeadingYear(headingYears[index], index)}</h3>
          {innerArray.map((resultObj, innerIndex) => {
            console.log(resultObj)
            if (resultObj != null) {
              return (
                <FutureBenefitEstimate
                  resultObj={resultObj}
                  index={innerIndex}
                  futureBenefits={futureResults}
                  futurePartnerBenefits={futurePartnerResults}
                />
              )
            } else {
              return <></>
            }
          })}
        </div>
      ))}
    </div>
  )
}
