import {
  LegalStatus,
  LivingCountry,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import MAX_OAS_ENTITLEMENT from '../definitions/oasEntitlement'
import { BenefitResult, CalculationInput } from '../definitions/types'

export default function checkOas(params: CalculationInput): BenefitResult {
  // helpers
  const meetsReqAge = params.age >= 65
  const meetsReqIncome = params.income < 129757
  const requiredYearsInCanada =
    params.livingCountry === LivingCountry.CANADA ? 10 : 20
  const meetsReqYears = params.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal =
    params.legalStatus === LegalStatus.CANADIAN_CITIZEN ||
    params.legalStatus === LegalStatus.PERMANENT_RESIDENT ||
    params.legalStatus === LegalStatus.INDIAN_STATUS

  // main checks
  if (meetsReqIncome && meetsReqLegal && meetsReqYears) {
    if (meetsReqAge) {
      const entitlementResult = roundToTwo(
        Math.min(params.yearsInCanadaSince18 / 40, 1) * MAX_OAS_ENTITLEMENT
      )
      const partialOas = params.yearsInCanadaSince18 < 40
      const reason = partialOas ? ResultReason.PARTIAL_OAS : ResultReason.NONE
      const detail = partialOas
        ? params._translations.detail.eligiblePartialOas
        : params._translations.detail.eligible
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult,
        reason,
        detail,
      }
    } else if (params.age == 64) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: params._translations.detail.eligibleWhen65ApplyNow,
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: params._translations.detail.eligibleWhen65,
      }
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: params._translations.detail.mustMeetIncomeReq,
    }
  } else if (!meetsReqYears) {
    if (
      params.livingCountry === LivingCountry.AGREEMENT ||
      params.everLivedSocialCountry
    ) {
      if (meetsReqAge) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: params._translations.detail.dependingOnAgreement,
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: params._translations.detail.dependingOnAgreementWhen65,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: params._translations.detail.mustMeetYearReq,
      }
    }
  } else if (!meetsReqLegal) {
    if (!meetsReqAge) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: params._translations.detail.dependingOnLegalWhen65,
      }
    } else if (params.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: params._translations.detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: params._translations.detail.dependingOnLegal,
      }
    }
  } else if (params.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail: params._translations.detail.ineligibleYearsOrCountry,
    }
  }
  // fallback
  throw new Error('should not be here')
}

function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
