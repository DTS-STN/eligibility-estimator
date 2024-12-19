import React from 'react'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  ResultKey,
  BenefitKey,
  ResultReason,
} from '../../utils/api/definitions/enums'
import { BenefitResult, NextStepText } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { BenefitCard } from './BenefitCard'
import { DeferralTable } from './DeferralTable'
import { generateLink } from '../../utils/api/definitions/textReplacementRules'
import {
  flattenArray,
  getFirstOccurences,
  omitCommonBenefitKeys,
} from './utils'
import {
  getOasNextSteps,
  getGisNextSteps,
  getAlwNextSteps,
  getAlwsNextSteps,
} from './NextSteps'

export const BenefitCards: React.VFC<{
  inputAge: number
  results: BenefitResult[]
  futureClientResults: any
  partnerResults: BenefitResult[]
  liveInCanada?: boolean
}> = ({
  inputAge,
  results,
  futureClientResults,
  partnerResults,
  liveInCanada,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTsln = getTranslations(tsln._language)
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

  const futureEligibleFirst = getFirstOccurences(futureClientEligible)
  const futureEligibleToDisplay = omitCommonBenefitKeys(
    futureEligibleFirst,
    resultsEligible
  )

  const partnerResultsEligible = partnerResults.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

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

    // get... code below was moved to another file to make it a bit cleaner
    if (benefitKey === BenefitKey.gis) {
      getGisNextSteps(
        result,
        receivingOAS,
        liveInCanada,
        nextStepText,
        apiTsln,
        tsln
      )
    } else if (benefitKey === BenefitKey.oas) {
      getOasNextSteps(
        result,
        inputAge,
        receivingOAS,
        liveInCanada,
        nextStepText,
        apiTsln,
        tsln
      )
    } else if (benefitKey === BenefitKey.alw) {
      getAlwNextSteps(
        result,
        partnerResults,
        inputAge,
        liveInCanada,
        nextStepText,
        apiTsln,
        tsln
      )
    } else if (benefitKey === BenefitKey.alws) {
      getAlwsNextSteps(
        result,
        inputAge,
        liveInCanada,
        nextStepText,
        apiTsln,
        tsln
      )
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

      // remove duplicates from array, this is because future is adding extra msg
      collapsedDetails = collapsedDetails.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.heading === value.heading)
      )
    }

    const eligibility: boolean =
      result.eligibility.result === ResultKey.ELIGIBLE ||
      result.eligibility.result === ResultKey.INCOME_DEPENDENT

    const eligibleText =
      result.benefitKey !== BenefitKey.oas &&
      result.eligibility.reason === ResultReason.LIVING_COUNTRY
        ? apiTsln.result.almostEligible
        : eligibility
        ? apiTsln.result.eligible
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
          liveInCanada={
            result.eligibility.reason === ResultReason.LIVING_COUNTRY
          }
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
          {/* <div>{OASdeferralTable}</div> */}
          {/* <div>{oasApply(result.benefitKey, result)}</div> */}
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
