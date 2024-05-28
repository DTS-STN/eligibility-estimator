import legalValues from '../../utils/api/scrapers/output'
import { ResultKey, ResultReason } from '../../utils/api/definitions/enums'
import { Translations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { NextStepText } from '../../utils/api/definitions/types'

export function getOasNextSteps(
  result: any,
  inputAge: number,
  receivingOAS: boolean,
  nextStepText: NextStepText,
  apiTsln: Translations,
  tsln: WebTranslations
) {
  if (result.eligibility.result === ResultKey.ELIGIBLE) {
    nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
    if (receivingOAS) {
      if (result.entitlement.result === 0) {
        nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimateWhenZero}</p>`
      } else if (result.entitlement.result > 0) {
        nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimate}</p>`
      }
    } else {
      if (inputAge > 69) {
        nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.oas.over70}</p>`
        nextStepText.nextStepContent += `<p class='mt-2'>${
          apiTsln.detail.oas.serviceCanadaReviewYourPayment
        }</p> <p class='mt-2'>${
          result.entitlement.result === 0
            ? apiTsln.detail.oas.automaticallyBePaid
            : ''
        }</p>`
      } else {
        nextStepText.nextStepContent += `${apiTsln.detail.oas.youWillReceiveLetter}`
        // ifYouDidnt:
        if (inputAge < 65) {
        } else if (inputAge > 64 && inputAge < 70) {
          nextStepText.nextStepContent += ` ${apiTsln.detail.oas.ifYouDidnt}`
        }
        nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.futureDeferralOptions}</p>`
        nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.youCanAply}</p>`

        if (result.entitlement.result == 0) {
          nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.onceEnrolled}</p>`
        }
      }
    }
  }

  return nextStepText
}

export function getGisNextSteps(
  result: any,
  receivingOAS: boolean,
  nextStepText: NextStepText,
  apiTsln: Translations,
  tsln: WebTranslations
) {
  if (result.eligibility.result === ResultKey.ELIGIBLE) {
    nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
    if (!receivingOAS) {
      nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.gis.youCanApplyGis}</p>`
      if (result.entitlement.result === 0) {
        nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.gis.ifYouApply}</p>`
      }
    } else {
      if (result.entitlement.result > 0) {
        nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.gis.canApplyOnline}</p>`
      } else {
        nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.gis.ifYouApply}</p>`
      }
      nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.gis.ifYouAlreadyApplied}</p>`
    }
  } else {
    if (result.eligibility.result === ResultReason.LIVING_COUNTRY) {
      nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.mustBeInCanada}</p>`
    }
  }

  return nextStepText
}

//
export function getAlwNextSteps(
  result: any,
  partnerResults: any,
  inputAge: number,
  nextStepText: NextStepText,
  apiTsln: Translations,
  tsln: WebTranslations
) {
  const ifYouApplyText =
    apiTsln.detail.alwIfYouApply +
    `<strong>${numberToStringCurrency(
      legalValues.alw.alwIncomeLimit,
      apiTsln._language,
      { rounding: 0 }
    )}</strong>.`
  nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle

  if (
    result.eligibility.result === ResultKey.ELIGIBLE ||
    result.eligibility.result === ResultKey.WILL_BE_ELIGIBLE
  ) {
    if (result.entitlement.result > 0) {
      nextStepText.nextStepContent += apiTsln.detail.alwsApply
    } else {
      nextStepText.nextStepContent += ifYouApplyText
    }
  } else if (result.eligibility.result === ResultKey.INELIGIBLE) {
    nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.alw.forIndividuals}</p>`
    nextStepText.nextStepContent += `<ul class='pl-[35px] ml-[20px] my-1 list-disc text-content'>
    <li>${apiTsln.detail.alw.age60to64}</li>
    <li>${apiTsln.detail.alw.livingInCanada}</li>
    <li>${apiTsln.detail.alw.spouseReceives}</li>
  </ul>`
    // if (
    //   partnerResults.result.eligibility.result === ResultKey.ELIGIBLE ||
    //   partnerResults.result.eligibility.result === ResultKey.WILL_BE_ELIGIBLE
    // ) {
    //   nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.alw.forIndividuals}</p>`
    // }
  }

  return nextStepText
}

//
export function getAlwsNextSteps(
  result: any,
  inputAge: number,
  nextStepText: NextStepText,
  apiTsln: Translations,
  tsln: WebTranslations
) {
  const ifYouApplyText =
    apiTsln.detail.alwIfYouApply +
    `<strong>${numberToStringCurrency(
      legalValues.alw.afsIncomeLimit,
      apiTsln._language,
      { rounding: 0 }
    )}</strong>.`
  nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle

  if (
    result.eligibility.result === ResultKey.ELIGIBLE ||
    result.eligibility.result === ResultKey.WILL_BE_ELIGIBLE
  ) {
    if (result.entitlement.result > 0) {
      nextStepText.nextStepContent += apiTsln.detail.alwsApply
    } else {
      nextStepText.nextStepContent += ifYouApplyText
    }
  } else if (result.eligibility.result === ResultKey.INELIGIBLE) {
    nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.alw.forIndividuals}</p>`
    nextStepText.nextStepContent += `<ul class='pl-[35px] ml-[20px] my-1 list-disc text-content'>
    <li>${apiTsln.detail.alw.age60to64}</li>
    <li>${apiTsln.detail.alw.livingInCanada}</li>
    <li>${apiTsln.detail.alw.spouseReceives}</li>
  </ul>`
  }

  return nextStepText
}
