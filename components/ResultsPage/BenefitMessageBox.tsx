import React from 'react'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useStore, useTranslation } from '../Hooks'
import { MessageBox } from './MessageBox'
import { CustomCollapse } from './CustomCollapse'

export const BenefitMessageBox: React.VFC<{
  results: BenefitResult[]
}> = ({ results }) => {
  console.log(`results`, results)
  const root = useStore()
  const answers = root.getInputObject()

  const resultsEligible = results.filter(
    (value) =>
      value.eligibility?.result === ResultKey.ELIGIBLE ||
      value.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )
  const resultsNotEligible = results.filter(
    (value) => value.eligibility?.result === ResultKey.INELIGIBLE
  )

  const tsln = useTranslation<WebTranslations>()
  const trans = getTranslations(answers._language)

  function generateMessageBox(result: BenefitResult) {
    const titleText: string = trans.benefit[result.benefitKey]
    const collapsedDetails = result.cardDetail.collapsedText
    const eligibility: boolean =
      result.eligibility.result === ResultKey.ELIGIBLE ||
      result.eligibility.result === ResultKey.INCOME_DEPENDENT
    return (
      <div key={result.benefitKey}>
        <MessageBox
          title={titleText}
          eligible={eligibility}
          eligibleText={trans.result[result.eligibility.result]}
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

          {collapsedDetails &&
            collapsedDetails.map((detail, index) => (
              <CustomCollapse
                key={`collapse-${result.benefitKey}-${index}`}
                id={`collapse-${result.benefitKey}-${index}`}
                title={detail.heading}
              >
                <p>{detail.text}</p>
              </CustomCollapse>
            ))}
        </MessageBox>
      </div>
    )
  }

  return (
    <div className="my-16">
      {resultsEligible.length >= 0 && (
        <>
          <h2 id="next" className="h2 mt-5">
            {tsln.resultsPage.nextSteps}
          </h2>
          <>{resultsEligible.map((result) => generateMessageBox(result))}</>
        </>
      )}
      {resultsNotEligible.length >= 0 && (
        <>
          <h2 id="notEligible" className="h2 mt-5">
            {tsln.resultsPage.youMayNotBeEligible}
          </h2>
          <>{resultsNotEligible.map((result) => generateMessageBox(result))}</>
        </>
      )}
    </div>
  )
}
