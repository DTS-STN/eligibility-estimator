import {
  BenefitResult,
  CalculationInput,
  LegalStatusOptions,
  LivingCountryOptions,
  OasSchema,
  ResultOptions,
  ResultReasons,
} from './types'
import { validateRequestForBenefit } from './validator'

export default function checkOas(params: CalculationInput): BenefitResult {
  // validation
  const { result, value } = validateRequestForBenefit(OasSchema, params)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const canadianCitizen = value.legalStatus
    ? [
        LegalStatusOptions.CANADIAN_CITIZEN,
        LegalStatusOptions.PERMANENT_RESIDENT,
        LegalStatusOptions.STATUS_INDIAN,
        LegalStatusOptions.TEMPORARY_RESIDENT,
      ].includes(value.legalStatus)
    : undefined
  const requiredYearsInCanada =
    value.livingCountry === LivingCountryOptions.CANADA ? 10 : 20

  // main checks
  if (value.income >= 129757) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.INCOME,
      detail: 'Your income is too high to be eligible for OAS.',
    }
  } else if (
    canadianCitizen &&
    value.yearsInCanadaSince18 >= requiredYearsInCanada
  ) {
    if (value.age >= 65) {
      const entitlementResult = roundToTwo(
        Math.min(value.yearsInCanadaSince18 / 40, 1) * 635.26
      )
      return {
        eligibilityResult: ResultOptions.ELIGIBLE,
        entitlementResult,
        reason: ResultReasons.NONE,
        detail: 'Based on the information provided, you are eligible for OAS!',
      }
    } else if (value.age == 64) {
      return {
        eligibilityResult: ResultOptions.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReasons.AGE,
        detail:
          'You will be eligible when you turn 65, however you may be able to apply now, please contact Service Canada for more information.',
      }
    } else {
      return {
        eligibilityResult: ResultOptions.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReasons.AGE,
        detail: 'You will be eligible when you turn 65.',
      }
    }
  } else if (
    value.yearsInCanadaSince18 < requiredYearsInCanada &&
    (value.livingCountry === LivingCountryOptions.AGREEMENT ||
      value.everLivedSocialCountry)
  ) {
    if (value.age >= 65) {
      return {
        eligibilityResult: ResultOptions.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReasons.YEARS_IN_CANADA,
        detail:
          "Depending on Canada's agreement with this country, you may be eligible to receive the OAS pension.",
      }
    } else {
      return {
        eligibilityResult: ResultOptions.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReasons.AGE,
        detail:
          "You may be eligible when you turn 65, depending on Canada's agreement with this country.",
      }
    }
  } else if (
    value.yearsInCanadaSince18 < requiredYearsInCanada &&
    !value.everLivedSocialCountry
  ) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.YEARS_IN_CANADA,
      detail: `You currently do not appear to be eligible for the OAS pension as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.`,
    }
  } else if (canadianCitizen == false) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.CITIZEN,
      detail:
        'You currently do not appear to be eligible for the OAS pension as you have indicated that you do not have legal status in Canada. However, you may be in the future if you obtain legal status. If you are living outside of Canada, you may be eligible for the OAS pension if you had legal status prior to your departure.',
    }
  } else if (value.livingCountry === LivingCountryOptions.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.SOCIAL_AGREEMENT,
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
