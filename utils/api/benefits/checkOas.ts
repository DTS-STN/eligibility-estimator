import {
  LegalStatus,
  LivingCountry,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { OasSchema } from '../definitions/schemas'
import { BenefitResult, CalculationInput } from '../definitions/types'
import { validateRequestForBenefit } from '../helpers/validator'

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
        detail: 'Based on the information provided, you are eligible for OAS!',
      }
    } else if (value.age == 64) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail:
          'You will be eligible when you turn 65, however you may be able to apply now, please contact Service Canada for more information.',
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: 'You will be eligible when you turn 65.',
      }
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: 'Your income is too high to be eligible for OAS.',
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
          detail:
            "Depending on Canada's agreement with this country, you may be eligible to receive the OAS pension. You are encouraged to contact Service Canada.",
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail:
            "You may be eligible when you turn 65, depending on Canada's agreement with this country.",
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: `You currently do not appear to be eligible for the OAS pension as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.`,
      }
    }
  } else if (!meetsReqLegal) {
    if (value.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.CITIZEN,
        detail:
          'You may be eligible for OAS, please contact Service Canada to confirm.',
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.CITIZEN,
        detail:
          'You currently do not appear to be eligible for the OAS pension as you have indicated that you do not have legal status in Canada. However, you may be in the future if you obtain legal status. If you are living outside of Canada, you may be eligible for the OAS pension if you had legal status prior to your departure.',
      }
    }
  } else if (value.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail:
        'You currently do not appear to be eligible for the OAS pension as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.',
    }
  }
  // fallback
  throw new Error('should not be here')
}

function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
