import React from 'react'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { BenefitCard } from './BenefitCard'

export const BenefitCards: React.VFC<{
  results: BenefitResult[]
}> = ({ results }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTsln = getTranslations(tsln._language)

  // note that there are some ResultKeys not covered here, like Unavailable, Invalid, More Info
  // TODO: is this a problem?
  const resultsEligible = results.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )
  const resultsNotEligible = results.filter(
    (value) => value.eligibility?.result === ResultKey.INELIGIBLE
  )

  function generateCard(result: BenefitResult) {
    const titleText: string = apiTsln.benefit[result.benefitKey]
    const collapsedDetails = result.cardDetail.collapsedText
    const eligibility: boolean =
      result.eligibility.result === ResultKey.ELIGIBLE ||
      result.eligibility.result === ResultKey.INCOME_DEPENDENT
    return (
      <div key={result.benefitKey}>
        <BenefitCard
          benefitName={titleText}
          isEligible={eligibility}
          eligibleText={apiTsln.result[result.eligibility.result]}
          collapsedDetails={collapsedDetails}
          links={result.cardDetail.links.map((value) => {
            return {
              icon: value.icon,
              url: value.url,
              text: value.text,
              alt: value.text, // TODO: something else?
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
          <h2 id="nextSteps" className="h2 mt-5">
            {tsln.resultsPage.nextSteps}
          </h2>
          <>{resultsEligible.map((result) => generateCard(result))}</>
        </>
      )}
      {resultsNotEligible.length > 0 && (
        <>
          <h2 id="notEligible" className="h2 mt-5">
            {tsln.resultsPage.youMayNotBeEligible}
          </h2>
          <>{resultsNotEligible.map((result) => generateCard(result))}</>
        </>
      )}
    </div>
  )
}
