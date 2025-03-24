import { useRouter } from 'next/router'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  BenefitKey,
  Language,
  ResultKey,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { CustomCollapse } from './CustomCollapse'
import { DeferralTable } from './DeferralTable'
import { Estimation } from './Estimation'

export const SummaryEstimates: React.VFC<{
  headings
  userResults
  partnerResults
  userAge
  partnerAge
  maritalStatus
  partnerReceiving
  involSep
}> = ({
  headings,
  userResults,
  partnerResults,
  userAge,
  partnerAge,
  maritalStatus,
  partnerReceiving,
  involSep,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)
  const language = useRouter().locale as Language

  const getDeferralTable = (benefitKey, result, future, key?): any => {
    return benefitKey === BenefitKey.oas &&
      result.eligibility.result === ResultKey.ELIGIBLE &&
      result.entitlement.result > 0 &&
      result.cardDetail.meta?.tableData !== null ? (
      <DeferralTable
        data={result.cardDetail.meta?.tableData}
        future={future}
        key={`oas-deferral-table-${key}`}
      />
    ) : null
  }

  let collapsed = []

  return (
    <>
      {headings.map((year, index) => {
        const userResult = userResults
          ? userResults.some((obj) => year in obj)
          : null

        const partnerResult = partnerResults
          ? partnerResults.filter((elm) => elm).length > 0
            ? partnerResults.some((obj) => year in obj)
            : null
          : null

        let heading

        if (year == apiTrans.detail.currentEligible) {
          heading = apiTrans.detail.currentEligible
        } else if (index < headings.length - 1) {
          heading = `${apiTrans.detail.inTheYear} ${year}`
        } else {
          heading =
            language == 'fr'
              ? `${apiTrans.detail.lastYearEligible} ${apiTrans.detail.fromYear} ${year}`
              : `${apiTrans.detail.fromYear} ${year} ${apiTrans.detail.lastYearEligible}`
        }

        const yearResults = userResult
          ? userResults.filter((obj) => obj && year in obj)
          : null

        const yearResultsParnter = partnerResult
          ? partnerResults.filter((obj) => obj && year in obj)
          : null

        //Get the Result Objects: {"eligibility age": {Result}}
        const userResultObjects = yearResults
          ? yearResults.map((el) => {
              return el
            })
          : null

        const partnerResultObjects = yearResultsParnter
          ? yearResultsParnter.map((el) => {
              return el
            })
          : null

        let eligible = []
        if (userResultObjects) {
          if (userResultObjects.length > 0) {
            userResultObjects.forEach((resultObject, index) => {
              const benefitItem = resultObject[Object.keys(resultObject)[0]]
              const benefitAge = Object.keys(benefitItem)[0]

              const resultsArray: BenefitResult[] = Object.keys(
                benefitItem[benefitAge]
              ).map((value) => benefitItem[benefitAge][value])

              const eligibleResults = resultsArray.filter(
                (result) =>
                  result.eligibility?.result === ResultKey.ELIGIBLE ||
                  result.eligibility?.result === ResultKey.INCOME_DEPENDENT
              )

              eligibleResults.forEach((item) => {
                eligible.push(item)
              })
            })
          }
        }

        let partnerEli = []
        if (partnerResultObjects) {
          if (partnerResultObjects.length > 0) {
            partnerResultObjects.forEach((resultObject, index) => {
              const benefitItem = resultObject[Object.keys(resultObject)[0]]
              const benefitAge = Object.keys(benefitItem)[0]

              const resultsArray: BenefitResult[] = Object.keys(
                benefitItem[benefitAge]
              ).map((value) => benefitItem[benefitAge][value])

              const eligibleResults = resultsArray.filter(
                (result) =>
                  result.eligibility?.result === ResultKey.ELIGIBLE ||
                  result.eligibility?.result === ResultKey.INCOME_DEPENDENT
              )

              eligibleResults.forEach((item) => {
                partnerEli.push(item)
              })
            })
          }
        }
        eligible = eligible.concat(partnerEli)

        const allCollapsedDetails = []
        eligible.forEach((benefit) => {
          const collapsedDetails = benefit.cardDetail?.collapsedText
          if (collapsedDetails) {
            allCollapsedDetails.push(...collapsedDetails)
          }
        })

        const headingList = [
          apiTrans.detailWithHeading.recoveryTaxPartner.heading,
          apiTrans.detailWithHeading.nonResidentTaxPartner.heading,
          apiTrans.detailWithHeading.recoveryTax.heading,
          apiTrans.detailWithHeading.nonResidentTax.heading,
        ]
        const bothRecoveryTaxArr = [
          apiTrans.detailWithHeading.recoveryTaxBoth.heading,
          apiTrans.detailWithHeading.nonResidentTaxBoth.heading,
        ]
        const hasBothRecoveryTax = allCollapsedDetails.some((detail) =>
          bothRecoveryTaxArr.includes(detail.heading)
        )

        let headingToDelete: string | undefined
        if (hasBothRecoveryTax) {
          headingToDelete = headingList.find((heading) =>
            allCollapsedDetails.some((detail) => detail.heading === heading)
          )
        }

        return (
          <div key={heading}>
            <h3
              className={`h3 ${index != 0 ? 'mt-5' : ''} mb-5`}
              dangerouslySetInnerHTML={{ __html: heading }}
            />
            <div key={`estimation-${year}`} className="mb-5">
              <div key={`estimation-sub-${year}`} className="space-y-4">
                {userResult &&
                  userResultObjects.map((result, index) => {
                    return (
                      <Estimation
                        key={index}
                        partner={false}
                        resultObject={result[Object.keys(result)[0]]}
                        resultArray={userResults}
                        age={userAge}
                        maritalStatus={maritalStatus}
                        partnerReceiving={partnerReceiving}
                        involSep={involSep}
                        isSecondEstimate={index > 0}
                      />
                    )
                  })}

                {partnerResult &&
                  partnerResultObjects.map((result, index) => {
                    return (
                      <Estimation
                        key={index}
                        partner={true}
                        resultObject={result[Object.keys(result)[0]]}
                        resultArray={partnerResults}
                        age={partnerAge}
                        maritalStatus={maritalStatus}
                        partnerReceiving={partnerReceiving}
                        involSep={involSep}
                        isSecondEstimate={index > 0}
                      />
                    )
                  })}
              </div>
              {eligible &&
                eligible.map((benefit: BenefitResult, index) => {
                  const collapsedDetails = benefit.cardDetail?.collapsedText
                  const newCollapsedDetails = [...collapsedDetails]

                  if (newCollapsedDetails) {
                    //Find all indexes of deferral options
                    let indexes = newCollapsedDetails.reduce(
                      (acc, item, index) => {
                        if (
                          item.heading ===
                          apiTrans.detailWithHeading.yourDeferralOptions.heading
                        )
                          acc.push(index)
                        return acc
                      },
                      []
                    )

                    //While there are still multiple deferral options, remove the first one
                    while (indexes.length > 1) {
                      newCollapsedDetails.splice(indexes[0], 1) // Remove the first occurrence
                      indexes.shift() // Remove the first index from the list

                      //Recalculate the index since removing the duplicates
                      indexes = newCollapsedDetails.reduce(
                        (acc, item, index) => {
                          if (
                            item.heading ===
                            apiTrans.detailWithHeading.yourDeferralOptions
                              .heading
                          )
                            acc.push(index)
                          return acc
                        },
                        []
                      )
                    }
                  }

                  return (
                    <div key={`Key-${benefit.benefitKey}-${index}`}>
                      {newCollapsedDetails &&
                        newCollapsedDetails.map((detail, index) => {
                          if (!collapsed.includes(detail.heading)) {
                            collapsed.push(detail.heading)

                            if (headingToDelete) {
                              if (detail.heading === headingToDelete) {
                                return null
                              }
                            }

                            return (
                              <CustomCollapse
                                datacy={`collapse-${benefit.benefitKey}-${index}`}
                                key={`collapse-${benefit.benefitKey}-${index}`}
                                id={`collapse-${detail.heading}`}
                                title={detail.heading}
                              >
                                <p
                                  className="leading-[26px]"
                                  key={`collapse-${detail.heading}-${index}`}
                                  dangerouslySetInnerHTML={{
                                    __html: detail.text,
                                  }}
                                />
                                {getDeferralTable(
                                  benefit.benefitKey,
                                  benefit,
                                  true
                                ) &&
                                  detail.heading ===
                                    apiTrans.detailWithHeading
                                      .yourDeferralOptions.heading &&
                                  getDeferralTable(
                                    benefit.benefitKey,
                                    benefit,
                                    true,
                                    index
                                  )}
                              </CustomCollapse>
                            )
                          }
                        })}
                    </div>
                  )
                })}
            </div>

            {headings.length > 1 &&
              index < year.length &&
              index != headings.length - 1 && (
                <hr className="border-[#676767] border-solid border-t border-opacity-25" />
              )}
          </div>
        )
      })}
    </>
  )
}
