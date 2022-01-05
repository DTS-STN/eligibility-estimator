import { apiDict } from '../../../i18n/api'
import {
  LegalStatus,
  LivingCountry,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { OasSchema } from '../definitions/schemas'
import { BenefitResult, CalculationInput } from '../definitions/types'
import { validateRequestForBenefit } from '../helpers/validator'

const lang = 'en'

export default function checkOas(params: CalculationInput): BenefitResult {
  // validation
  const { result, value } = validateRequestForBenefit(OasSchema, params)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const meetsReqAge = value.age >= 65
  const meetsReqIncome = value.income < 129757
  const requiredYearsInCanada =
    value.livingCountry === LivingCountry.CANADA ? 10 : 20
  const meetsReqYears = value.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal =
    value.legalStatus === LegalStatus.CANADIAN_CITIZEN ||
    value.legalStatus === LegalStatus.PERMANENT_RESIDENT ||
    value.legalStatus === LegalStatus.INDIAN_STATUS

  // main checks
  if (meetsReqIncome && meetsReqLegal && meetsReqYears) {
    if (meetsReqAge) {
      const entitlementResult = roundToTwo(
        Math.min(value.yearsInCanadaSince18 / 40, 1) * 635.26
      )
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult,
        reason: ResultReason.NONE,
        detail: apiDict[lang].detail.eligible,
      }
    } else if (value.age == 64) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: apiDict[lang].detail.eligibleWhen65ApplyNow,
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: apiDict[lang].detail.eligibleWhen65,
      }
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: apiDict[lang].detail.mustMeetIncomeReq,
    }
  } else if (!meetsReqYears) {
    if (
      value.livingCountry === LivingCountry.AGREEMENT ||
      value.everLivedSocialCountry
    ) {
      if (meetsReqAge) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: apiDict[lang].detail.dependingOnAgreement,
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: apiDict[lang].detail.dependingOnAgreementWhen65,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: apiDict[lang].detail.mustMeetYearReq,
      }
    }
  } else if (!meetsReqLegal) {
    if (!meetsReqAge) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: apiDict[lang].detail.dependingOnLegalWhen65,
      }
    } else if (value.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: apiDict[lang].detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: apiDict[lang].detail.dependingOnLegal,
      }
    }
  } else if (value.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail: apiDict[lang].detail.ineligibleYearsOrCountry,
    }
  }
  // fallback
  throw new Error('should not be here')
}

function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
