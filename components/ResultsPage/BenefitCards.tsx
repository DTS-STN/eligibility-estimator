import React from 'react'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { BenefitCard } from './BenefitCard'

export const BenefitCards: React.VFC<{
  results: BenefitResult[]
  partnerResults: BenefitResult[]
}> = ({ results, partnerResults }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTsln = getTranslations(tsln._language)
  const titleArray = [
    'Old Age Security pension',
    'Pension de la Sécurité de la vieillesse',
  ]
  const titleWithAcronymArray = [
    'Old Age Security (OAS) pension',
    'Pension de la Sécurité de la vieillesse (SV)',
  ]
  // note that there are some ResultKeys not covered here, like Unavailable, Invalid, More Info
  // TODO: is this a problem?
  const resultsEligible = results.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  const partnerResultsEligible = partnerResults.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  const resultsNotEligible = results.filter(
    (value) => value.eligibility?.result === ResultKey.INELIGIBLE
  )

  const transformBenefitName = (benefitName) => {
    let benefitText = ''
    const foundIndex = titleArray.findIndex((t) => t === benefitName)
    benefitText =
      foundIndex != -1 ? titleWithAcronymArray[foundIndex] : benefitName
    return benefitText
  }

  function generateCard(result: BenefitResult) {
    let titleText: string = apiTsln.benefit[result.benefitKey]
    let collapsedDetails = result.cardDetail.collapsedText
    const eligiblePartnerResult = partnerResultsEligible.find(
      (benefit) => benefit.benefitKey === result.benefitKey
    )

    if (eligiblePartnerResult !== undefined) {
      collapsedDetails = [
        ...collapsedDetails,
        eligiblePartnerResult.cardDetail.collapsedText[0],
      ]
    }

    const eligibility: boolean =
      result.eligibility.result === ResultKey.ELIGIBLE ||
      result.eligibility.result === ResultKey.INCOME_DEPENDENT

    titleText =
      eligibility === false ? transformBenefitName(titleText) : titleText

    return (
      <div key={result.benefitKey}>
        <BenefitCard
          benefitKey={result.benefitKey}
          benefitName={titleText}
          isEligible={eligibility}
          eligibleText={apiTsln.result[result.eligibility.result]}
          collapsedDetails={collapsedDetails}
          links={result.cardDetail.links.map((value) => {
            return {
              icon: value.icon,
              url: value.url,
              text: value.text,
              alt: '', // must make text alts null for images that need to be ignored by assistive technologies (AT)
            }
          })}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: result.cardDetail.mainText,
            }}
          />
        </BenefitCard>
      </div>
    )
  }

  return (
    <div>
      {resultsEligible.length > 0 && (
        <>
          <>{resultsEligible.map((result) => generateCard(result))}</>
        </>
      )}
      {resultsNotEligible.length > 0 && (
        <>
          <>{resultsNotEligible.map((result) => generateCard(result))}</>
        </>
      )}
    </div>
  )
}
