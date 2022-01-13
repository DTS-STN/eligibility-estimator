import {
  LegalStatus,
  LivingCountry,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import MAX_OAS_ENTITLEMENT from '../definitions/oasEntitlement'
import { BenefitResult, ProcessedInput } from '../definitions/types'

export default function checkOas(input: ProcessedInput): BenefitResult {
  // helpers
  const meetsReqAge = input.age >= 65
  const meetsReqIncome = input.income < 129757
  const requiredYearsInCanada =
    input.livingCountry === LivingCountry.CANADA ? 10 : 20
  const meetsReqYears = input.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal =
    input.legalStatus === LegalStatus.CANADIAN_CITIZEN ||
    input.legalStatus === LegalStatus.PERMANENT_RESIDENT ||
    input.legalStatus === LegalStatus.INDIAN_STATUS

  // main checks
  if (meetsReqIncome && meetsReqLegal && meetsReqYears) {
    if (meetsReqAge) {
      const entitlementResult = roundToTwo(
        Math.min(input.yearsInCanadaSince18 / 40, 1) * MAX_OAS_ENTITLEMENT
      )
      const partialOas = input.yearsInCanadaSince18 < 40
      const reason = partialOas ? ResultReason.PARTIAL_OAS : ResultReason.NONE
      const detail = partialOas
        ? input._translations.detail.eligiblePartialOas
        : input._translations.detail.eligible
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult,
        reason,
        detail,
      }
    } else if (input.age == 64) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.eligibleWhen65ApplyNow,
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.eligibleWhen65,
      }
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: input._translations.detail.mustMeetIncomeReq,
    }
  } else if (!meetsReqYears) {
    if (
      input.livingCountry === LivingCountry.AGREEMENT ||
      input.everLivedSocialCountry
    ) {
      if (meetsReqAge) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: input._translations.detail.dependingOnAgreement,
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: input._translations.detail.dependingOnAgreementWhen65,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: input._translations.detail.mustMeetYearReq,
      }
    }
  } else if (!meetsReqLegal) {
    if (!meetsReqAge) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.dependingOnLegalWhen65,
      }
    } else if (input.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: input._translations.detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: input._translations.detail.dependingOnLegal,
      }
    }
  } else if (input.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail: input._translations.detail.ineligibleYearsOrCountry,
    }
  }
  // fallback
  throw new Error('should not be here')
}

function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
