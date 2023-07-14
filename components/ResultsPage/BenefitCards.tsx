import React, { cloneElement } from 'react'
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
import { DeferralTable } from './DeferralTable'
import { generateLink } from '../../utils/api/definitions/textReplacementRules'
import { FieldInput } from '../../client-state/InputHelper'
import {
  flattenArray,
  getFirstOccurences,
  omitCommonBenefitKeys,
} from './utils'

export const BenefitCards: React.VFC<{
  inputAge: number
  results: BenefitResult[]
  futureClientResults: any
  partnerResults: BenefitResult[]
}> = ({ inputAge, results, futureClientResults, partnerResults }) => {
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

  const receivingOAS: boolean = results[0]?.cardDetail?.meta?.receiveOAS

  /**
   * Accepts a single string and replaces any {VARIABLES} with the appropriate value.
   */
  const replaceTextVariables = (textToProcess: string): string => {
    const re: RegExp = new RegExp(/{(\w*?)}/g)
    const matches: IterableIterator<RegExpMatchArray> =
      textToProcess.matchAll(re)
    let replaceWith: string

    for (const match of matches) {
      const key: string = match[1]
      switch (key) {
        case 'MY_SERVICE_CANADA':
          replaceWith = generateLink(apiTsln.links.SCAccount)
          break
        default:
          throw new Error(`no text replacement rule for ${key}`)
      }
      textToProcess = textToProcess.replace(`{${key}}`, replaceWith)
    }

    return textToProcess
  }

  // note that there are some ResultKeys not covered here, like Unavailable, Invalid, More Info
  // TODO: is this a problem?
  const resultsEligible = results.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  const futureClientEligible = flattenArray(futureClientResults)

  const resultsNotEligible = results.filter((value) => {
    const inFutureEligible = futureClientEligible?.find(
      (val) => val.benefitKey === value.benefitKey
    )

    return (
      value.eligibility?.result === ResultKey.INELIGIBLE && !inFutureEligible
    )
  })

  // console.log('resultsEligible', resultsEligible)
  // console.log('futureEligible', futureClientEligible) // keep only first occurences of the benefit, then check against resultsEligible. Omit if in that array
  // console.log('resultsNotEligible', resultsNotEligible)

  const futureEligibleFirst = getFirstOccurences(futureClientEligible)
  const futureEligibleToDisplay = omitCommonBenefitKeys(
    futureEligibleFirst,
    resultsEligible
  )
  // console.log('futuerEligibleToDisplay', futureEligibleToDisplay)

  const partnerResultsEligible = partnerResults.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  const transformBenefitName = (benefitName) => {
    let benefitText = ''
    const foundIndex = titleArray.findIndex((t) => t === benefitName)
    benefitText =
      foundIndex != -1 ? titleWithAcronymArray[foundIndex] : benefitName
    return benefitText
  }

  const getDeferralTable = (benefitKey, result, future): any => {
    return benefitKey === BenefitKey.oas &&
      result.eligibility.result === ResultKey.ELIGIBLE &&
      result.entitlement.result > 0 &&
      result.cardDetail.meta?.tableData !== null ? (
      <DeferralTable data={result.cardDetail.meta?.tableData} future={future} />
    ) : null
  }

  const oasApply = (benefitKey, result) => {
    return benefitKey === BenefitKey.oas &&
      result.eligibility.result === ResultKey.ELIGIBLE &&
      result.entitlement.result > 0 &&
      result.cardDetail.meta?.tableData !== null
      ? apiTsln.detail.youCanAply
      : null
  }

  const getNextStepText = (benefitKey, result): NextStepText => {
    let nextStepText = { nextStepTitle: '', nextStepContent: '' }

    if (benefitKey === BenefitKey.gis) {
      if (
        result.eligibility.result === ResultKey.ELIGIBLE ||
        result.eligibility.result === ResultKey.INCOME_DEPENDENT
      ) {
        nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle

        if (result.eligibility.reason === ResultReason.INCOME) {
          nextStepText.nextStepContent =
            tsln.resultsPage.nextStepGis +
            (result.entitlement.result === 0
              ? apiTsln.detail.gis.ifYouApply
              : '')
        } else if (result.entitlement.result > 0 && receivingOAS) {
          nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimate}</p>`
        } else if (
          (result.entitlement.result > 0 && !receivingOAS) ||
          (result.entitlement.result <= 0 && receivingOAS)
        ) {
          nextStepText.nextStepContent = tsln.resultsPage.nextStepGis
        }
      }
    } else if (benefitKey === BenefitKey.oas) {
      if (result.eligibility.result === ResultKey.ELIGIBLE) {
        nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle

        if (result.entitlement.clawback > 0) {
          if (result.eligibility.reason === ResultReason.AGE_70_AND_OVER) {
            nextStepText.nextStepContent += `<p class='mb-6'>${apiTsln.detail.oas.over70}</p>`
          }

          if (inputAge < 64) {
            nextStepText.nextStepContent +=
              apiTsln.detail.oas.youWillReceiveLetter
          } else if (inputAge === 64) {
            nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.ifYouDidnt}`
          } else {
            nextStepText.nextStepContent +=
              apiTsln.detail.oas.serviceCanadaReviewYourPayment
          }
        } else if (
          result.eligibility.reason === ResultReason.AGE_65_TO_69 &&
          result.entitlement.result > 0 &&
          receivingOAS
        ) {
          nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimate}</p>`
        } else if (result.eligibility.reason === ResultReason.AGE_65_TO_69) {
          if (inputAge < 64) {
            nextStepText.nextStepContent +=
              apiTsln.detail.oas.youWillReceiveLetter
          } else if (inputAge === 64) {
            nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.ifYouDidnt}`
          } else {
            nextStepText.nextStepContent +=
              apiTsln.detail.oas.youShouldHaveReceivedLetter
            // nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.oas.applyOnline}</p>`
          }
        } else if (
          result.eligibility.reason === ResultReason.AGE_70_AND_OVER &&
          receivingOAS
        ) {
          nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimate}</p>`
        } else if (
          result.eligibility.reason === ResultReason.AGE_70_AND_OVER &&
          !receivingOAS
        ) {
          nextStepText.nextStepContent += apiTsln.detail.oas.over70
        } else if (result.entitlement.clawback === 0) {
          if (inputAge < 64) {
            nextStepText.nextStepContent +=
              apiTsln.detail.oas.youWillReceiveLetter
          } else if (inputAge === 64) {
            nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.ifYouDidnt}`
          } else {
            nextStepText.nextStepContent += `${apiTsln.detail.oas.serviceCanadaReviewYourPayment}`
            result.eligibility.reason === ResultReason.INCOME
              ? (nextStepText.nextStepContent +=
                  ' ' + apiTsln.detail.oas.automaticallyBePaid)
              : ''
          }
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
      if (result.eligibility.result === ResultKey.ELIGIBLE) {
        const ifYouApplyText =
          apiTsln.detail.alwIfYouApply +
          `<strong>${numberToStringCurrency(
            legalValues.alw.alwIncomeLimit,
            apiTsln._language,
            { rounding: 0 }
          )}</strong>.`

        if (inputAge < 60) {
          nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
          nextStepText.nextStepContent += apiTsln.detail.alwsApply
          if (result.entitlement.result === 0) {
            nextStepText.nextStepContent += ifYouApplyText
          }
        } else if (result.entitlement.result === 0) {
          nextStepText.nextStepContent += ifYouApplyText
        }
      }
    } else if (benefitKey === BenefitKey.alws) {
      if (result.eligibility.result === ResultKey.ELIGIBLE) {
        const ifYouApplyText = `${
          apiTsln.detail.alwIfYouApply
        } <strong>${numberToStringCurrency(
          legalValues.alw.afsIncomeLimit,
          apiTsln._language,
          { rounding: 0 }
        )}</strong>.`

        if (inputAge < 60) {
          nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
          nextStepText.nextStepContent += `${apiTsln.detail.alwsApply}`

          if (result.entitlement.result === 0) {
            nextStepText.nextStepContent += ifYouApplyText
          }
        } else if (result.entitlement.result === 0) {
          nextStepText.nextStepContent += ifYouApplyText
        }
      }
    }

    nextStepText.nextStepContent = replaceTextVariables(
      nextStepText.nextStepContent
    )

    return nextStepText
  }

  function generateCard(result: BenefitResult, future = false) {
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
      ? future
        ? apiTsln.result.willBeEligible
        : apiTsln.result.eligible
      : apiTsln.result.ineligible

    const nextStepText = getNextStepText(result.benefitKey, result)

    const OASdeferralTable = getDeferralTable(result.benefitKey, result, future)

    return (
      <div key={result.benefitKey}>
        <BenefitCard
          benefitKey={result.benefitKey}
          benefitName={titleText}
          isEligible={eligibility}
          future={future}
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
          <div>{OASdeferralTable}</div>
          <div>{oasApply(result.benefitKey, result)}</div>
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
      {futureClientEligible?.length > 0 && (
        <>
          <>
            {futureEligibleToDisplay.map((result) =>
              generateCard(result, true)
            )}
          </>
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
