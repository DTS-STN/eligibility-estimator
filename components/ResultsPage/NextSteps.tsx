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

    if (result.entitlement.clawback > 0) {
      if (!receivingOAS && inputAge > 64) {
        nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.applyOnline}`
      }

      if (
        result.eligibility.reason === ResultReason.AGE_70_AND_OVER &&
        !receivingOAS
      ) {
        nextStepText.nextStepContent += `<p class='mt-6 mb-6'>${apiTsln.detail.oas.over70}</p>`
      }

      //code for future --start--
      if (inputAge < 64) {
        nextStepText.nextStepContent += apiTsln.detail.oas.youWillReceiveLetter
      } else if (inputAge === 64) {
        nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.ifYouDidnt}`
      } else if (
        (result.eligibility.reason === ResultReason.AGE_65_TO_69 ||
          result.eligibility.reason === ResultReason.AGE_70_AND_OVER) &&
        result.entitlement.result > 0 &&
        receivingOAS
      ) {
        //TODO  duplicating the code here, will refactor later TODO
        nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimate}</p>`
      } else {
        !receivingOAS
          ? (nextStepText.nextStepContent += `<p class='mt-6 mb-6'>${apiTsln.detail.oas.serviceCanadaReviewYourPayment}</p>`)
          : ''
      }
      //code for future --end--
    } else if (
      (result.eligibility.reason === ResultReason.AGE_65_TO_69 ||
        result.eligibility.reason === ResultReason.AGE_70_AND_OVER) &&
      result.entitlement.result > 0 &&
      receivingOAS
    ) {
      nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimate}</p>`
    } else if (
      (result.eligibility.reason === ResultReason.AGE_65_TO_69 ||
        result.eligibility.reason === ResultReason.AGE_70_AND_OVER ||
        result.eligibility.reason === ResultReason.INCOME) &&
      result.entitlement.result === 0 &&
      receivingOAS
    ) {
      nextStepText.nextStepContent += `<p class='mt-2'>${apiTsln.detail.thisEstimateWhenZero}</p>`
    } else if (result.eligibility.reason === ResultReason.AGE_65_TO_69) {
      //code for future --start--
      if (inputAge < 64) {
        nextStepText.nextStepContent += apiTsln.detail.oas.youWillReceiveLetter
      } else if (inputAge === 64) {
        nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.ifYouDidnt}`
      } else {
        // default when 65-69
        !receivingOAS
          ? (nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.applyOnline}`)
          : ''
      }
      //code for future --end--
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
      //code for future --start--
      if (inputAge < 64) {
        nextStepText.nextStepContent += apiTsln.detail.oas.youWillReceiveLetter
      } else if (inputAge === 64) {
        nextStepText.nextStepContent += `${apiTsln.detail.oas.youShouldHaveReceivedLetter} ${apiTsln.detail.oas.ifYouDidnt}`
      } else {
        !receivingOAS
          ? (nextStepText.nextStepContent += `${apiTsln.detail.oas.serviceCanadaReviewYourPayment}`)
          : ''

        result.eligibility.reason === ResultReason.INCOME
          ? (nextStepText.nextStepContent +=
              ' ' + apiTsln.detail.oas.automaticallyBePaid)
          : ''
      }
      //code for future --end--
    }
  } else if (
    result.eligibility.result === ResultKey.INELIGIBLE &&
    result.eligibility.reason === ResultReason.AGE_YOUNG_64
  ) {
    nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
    nextStepText.nextStepContent +=
      apiTsln.detail.oas.youShouldHaveReceivedLetter
    nextStepText.nextStepContent += ` ${apiTsln.detail.oas.ifNotReceiveLetter64}`
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
  if (
    result.eligibility.result === ResultKey.ELIGIBLE ||
    result.eligibility.result === ResultKey.INCOME_DEPENDENT
  ) {
    nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
    if (result.eligibility.reason === ResultReason.INCOME) {
      nextStepText.nextStepContent = tsln.resultsPage.nextStepGis
      if (result.entitlement.result === 0) {
        if (receivingOAS) {
          nextStepText.nextStepContent = apiTsln.detail.gis.ifYouApply
          nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.gis.ifYouAlreadyApplied}</p>`
        } else
          nextStepText.nextStepContent += `<p class='mt-6'>${apiTsln.detail.gis.ifYouApply}</p>`
      }
    } else if (result.entitlement.result > 0 && receivingOAS) {
      nextStepText.nextStepContent =
        apiTsln.detail.gis.canApplyOnline +
        `<p class='mt-4'>${apiTsln.detail.gis.ifYouAlreadyReceive}</p>`
    } else if (result.entitlement.result > 0 && !receivingOAS) {
      nextStepText.nextStepContent = tsln.resultsPage.nextStepGis
    } else if (result.entitlement.result <= 0 && receivingOAS) {
      nextStepText.nextStepContent = apiTsln.detail.gis.ifYouApply
      nextStepText.nextStepContent += `<p class='mt-4'>${apiTsln.detail.gis.ifYouAlreadyApplied}</p>`
    }
  }

  return nextStepText
}

//
export function getAlwNextSteps(
  result: any,
  inputAge: number,
  nextStepText: NextStepText,
  apiTsln: Translations,
  tsln: WebTranslations
) {
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
      nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
      nextStepText.nextStepContent += ifYouApplyText
    }
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
  if (result.eligibility.result === ResultKey.ELIGIBLE) {
    const ifYouApplyText = `${
      apiTsln.detail.alwsIfYouApply
    }<strong data-cy='next-step-limit'>${numberToStringCurrency(
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
      nextStepText.nextStepTitle = tsln.resultsPage.nextStepTitle
      nextStepText.nextStepContent += ifYouApplyText
    }
  }

  return nextStepText
}
