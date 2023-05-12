import React from 'react'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  ResultKey,
  BenefitKey,
  ResultReason,
} from '../../utils/api/definitions/enums'
import { BenefitResult, NextStepText } from '../../utils/api/definitions/types'
import legalValues from '../../utils/api/scrapers/output'
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

  const getNextStepText = (benefitKey, result): NextStepText => {
    let nextStepText = { nextStepTitle: '', nextStepContent: '' }

    if (benefitKey === BenefitKey.gis) {
      if (
        result.eligibility.result === ResultKey.ELIGIBLE ||
        result.eligibility.result === ResultKey.INCOME_DEPENDENT
      ) {
        nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
        nextStepText.nextStepContent =
          result.eligibility.reason === ResultReason.INCOME
            ? tsln.resultsPage.nextStepGis + apiTsln.detail.gis.ifYouApply
            : tsln.resultsPage.nextStepGis
      }
    } else if (benefitKey === BenefitKey.oas) {
      if (result.eligibility.result === ResultKey.ELIGIBLE) {
        nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle

        if (result.entitlement.clawback > 0) {
          if (result.eligibility.reason === ResultReason.AGE_70_AND_OVER) {
            nextStepText.nextStepContent += `<p class='mb-6'>${apiTsln.detail.oas.over70}</p>`
          }
          nextStepText.nextStepContent +=
            apiTsln.detail.oas.serviceCanadaReviewYourPayment
        } else if (result.eligibility.reason === ResultReason.AGE_65_TO_69) {
          nextStepText.nextStepContent +=
            apiTsln.detail.oas.youShouldHaveReceivedLetter
          nextStepText.nextStepContent += `<p class='mt-6'>${apiTsln.detail.oas.applyOnline}</p>`
        } else if (result.eligibility.reason === ResultReason.AGE_70_AND_OVER) {
          nextStepText.nextStepContent += apiTsln.detail.oas.over70
        } else if (result.entitlement.clawback === 0) {
          nextStepText.nextStepContent += `${apiTsln.detail.oas.serviceCanadaReviewYourPayment}`
          result.eligibility.reason === ResultReason.INCOME
            ? (nextStepText.nextStepContent +=
                ' ' + apiTsln.detail.oas.automaticallyBePaid)
            : ''
        }
      } else if (
        result.eligibility.result === ResultKey.INELIGIBLE &&
        result.eligibility.reason === ResultReason.AGE_YOUNG_64
      ) {
        nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
        nextStepText.nextStepContent +=
          apiTsln.detail.oas.youShouldHaveReceivedLetter
        nextStepText.nextStepContent += `<p class='mt-6'>${apiTsln.detail.oas.ifNotReceiveLetter64}</p>`
      }
    } else if (benefitKey === BenefitKey.alw) {
      if (
        result.eligibility.result === ResultKey.ELIGIBLE &&
        result.entitlement.result === 0
      ) {
        nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
        nextStepText.nextStepContent =
          apiTsln.detail.alwIfYouApply +
          `<strong>${numberToStringCurrency(
            legalValues.alw.alwIncomeLimit,
            apiTsln._language,
            { rounding: 0 }
          )}</strong>.`
      }
    } else if (benefitKey === BenefitKey.afs) {
      if (
        result.eligibility.result === ResultKey.ELIGIBLE &&
        result.entitlement.result === 0
      ) {
        nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
        nextStepText.nextStepContent =
          apiTsln.detail.alwIfYouApply +
          `<strong>${numberToStringCurrency(
            legalValues.alw.afsIncomeLimit,
            apiTsln._language,
            { rounding: 0 }
          )}</strong>.`
      }
    }
    return nextStepText
  }

  function generateCard(result: BenefitResult) {
    let titleText: string = apiTsln.benefit[result.benefitKey]
    let collapsedDetails = result.cardDetail.collapsedText
    const eligiblePartnerResult = partnerResultsEligible.find(
      (benefit) => benefit.benefitKey === result.benefitKey
    )

    const eligibleCardResult = resultsEligible.find(
      (benefit) => benefit.benefitKey === result.benefitKey
    )

    if (eligiblePartnerResult !== undefined) {
      const temp =
        eligibleCardResult !== undefined
          ? eligiblePartnerResult.cardDetail.collapsedText[0]
            ? [eligiblePartnerResult.cardDetail.collapsedText[0]]
            : []
          : [...eligiblePartnerResult.cardDetail.collapsedText]

      collapsedDetails = [...collapsedDetails, ...temp]
    }

    const eligibility: boolean =
      result.eligibility.result === ResultKey.ELIGIBLE ||
      result.eligibility.result === ResultKey.INCOME_DEPENDENT

    titleText =
      eligibility === false ? transformBenefitName(titleText) : titleText

    const eligibleText = eligibility
      ? apiTsln.result.eligible
      : apiTsln.result.ineligible

    const nextStepText = getNextStepText(result.benefitKey, result)

    return (
      <div key={result.benefitKey}>
        <BenefitCard
          benefitKey={result.benefitKey}
          benefitName={titleText}
          isEligible={eligibility}
          eligibleText={eligibleText}
          nextStepText={nextStepText}
          collapsedDetails={collapsedDetails}
          links={result.cardDetail.links.map((value) => {
            return {
              icon: value.icon,
              url: value.url,
              text: value.text,
              alt: '', // must make text alts null for images that need to be ignored by assistive technologies (AT)
              action: value.action || '',
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
