import { result } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  BenefitKey,
  Language,
  ResultKey,
  SummaryState,
} from '../../utils/api/definitions/enums'
import {
  BenefitResult,
  BenefitResultsObject,
} from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { CustomCollapse } from './CustomCollapse'
import { DeferralTable } from './DeferralTable'
import { EstimatedTotalItem } from './EstimatedTotalItem'
import { Estimation } from './Estimation'

export const SummaryEstimates: React.VFC<{
  headings
  userResults
  partnerResults
  userAge
  partnerAge
}> = ({ headings, userResults, partnerResults, userAge, partnerAge }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)

  const language = useRouter().locale as Language

  const currentYear = new Date().getFullYear()

  const getDeferralTable = (benefitKey, result, future): any => {
    console.log(result.cardDetail.meta?.tableData)
    return benefitKey === BenefitKey.oas &&
      result.eligibility.result === ResultKey.ELIGIBLE &&
      result.entitlement.result > 0 &&
      result.cardDetail.meta?.tableData !== null ? (
      <DeferralTable data={result.cardDetail.meta?.tableData} future={future} />
    ) : null
  }

  return (
    <>
      {headings.map((year, index) => {
        const userResult = userResults
          ? userResults.some((obj) => year in obj)
          : null

        const partnerResult = partnerResults
          ? partnerResults.some((obj) => year in obj)
          : null
        let heading

        if (year == currentYear) {
          heading = apiTrans.detail.currentEligible
        } else if (index < headings.length - 1) {
          heading = year
        } else {
          heading =
            language == 'fr'
              ? `${apiTrans.detail.lastYearEligible} ${year}`
              : `${year} ${apiTrans.detail.lastYearEligible}`
        }

        const userObj = userResult
          ? userResults.find((obj) => year in obj)
          : null

        const partnerObj = partnerResult
          ? partnerResults.find((obj) => year in obj)
          : null

        const userResultObject = userObj
          ? userObj[Object.keys(userObj)[0]]
          : null

        const partnerResultObject = partnerObj
          ? partnerObj[Object.keys(partnerObj)[0]]
          : null

        let eligible
        if (userResultObject) {
          const benefitAge = Object.keys(userResultObject)[0]

          const resultsArray: BenefitResult[] = Object.keys(
            userResultObject[benefitAge]
          ).map((value) => userResultObject[benefitAge][value])

          eligible = resultsArray.filter(
            (result) =>
              result.eligibility?.result === ResultKey.ELIGIBLE ||
              result.eligibility?.result === ResultKey.INCOME_DEPENDENT
          )
        }

        return (
          <div key={heading}>
            <h3 className="h3 mt-5 mb-5" key={'heading' + year}>
              {heading}
            </h3>
            <div className="mb-5">
              {userResult && (
                <Estimation
                  partner={false}
                  resultObject={userResultObject}
                  resultArray={userResults}
                  age={userAge}
                />
              )}

              {partnerResult && (
                <Estimation
                  partner={true}
                  resultObject={partnerResultObject}
                  resultArray={partnerResults}
                  age={partnerAge}
                />
              )}

              {eligible &&
                eligible.map((benefit) => {
                  const collapsedDetails = benefit.cardDetail?.collapsedText

                  return (
                    <>
                      {collapsedDetails &&
                        collapsedDetails.map((detail, index) => (
                          <CustomCollapse
                            datacy={`collapse-${benefit.benefitKey}-${index}`}
                            key={`collapse-${benefit.benefitKey}-${index}`}
                            id={`collapse-${benefit.benefitKey}-${index}`}
                            title={detail.heading}
                          >
                            <p
                              className="leading-[26px]"
                              dangerouslySetInnerHTML={{ __html: detail.text }}
                            />
                            {getDeferralTable(
                              benefit.benefitKey,
                              benefit,
                              true
                            ) &&
                              // detail.heading ===
                              //   apiTrans.detailWithHeading.yourDeferralOptions
                              //     .heading &&
                              getDeferralTable(
                                benefit.benefitKey,
                                benefit,
                                true
                              )}
                          </CustomCollapse>
                        ))}
                    </>
                  )
                })}
            </div>
            {headings.length > 1 &&
              index < year.length &&
              index != headings.length - 1 && <hr />}
          </div>
        )
      })}
    </>
  )
}
