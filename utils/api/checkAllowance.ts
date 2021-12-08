import {
  AllowanceSchema,
  BenefitResult,
  CalculationInput,
  LegalStatusOptions,
  LivingCountryOptions,
  MaritalStatusOptions,
  ResultOptions,
  ResultReasons,
} from './types'
import { validateRequestForBenefit } from './validator'

export default function checkAllowance(
  params: CalculationInput
): BenefitResult {
  // validation
  const { result, value } = validateRequestForBenefit(AllowanceSchema, params)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const canadianCitizen = value.legalStatus
    ? [
        LegalStatusOptions.CANADIAN_CITIZEN,
        LegalStatusOptions.PERMANENT_RESIDENT,
        LegalStatusOptions.INDIAN_STATUS,
      ].includes(value.legalStatus)
    : undefined
  const partnered =
    value.maritalStatus == MaritalStatusOptions.MARRIED ||
    value.maritalStatus == MaritalStatusOptions.COMMON_LAW

  // remove after confirming requirements
  const requiredYearsInCanada =
    value.livingCountry === LivingCountryOptions.CANADA ? 10 : 10

  // main checks
  if (value.age < 60 || value.age > 64) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.AGE,
      detail: 'You must be between 60 and 64 to be eligible for Allowance.',
    }
  } else if (value.income >= 35616) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.INCOME,
      detail: 'Your income is too high to be eligible for Allowance.',
    }
  } else if (!partnered) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.MARITAL,
      detail: 'You must be common-law or married to be eligible for Allowance.',
    }
  } else if (value.partnerReceivingOas === false) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.OAS,
      detail:
        'Your partner must be receiving OAS to be eligible for Allowance.',
    }
  } else if (
    canadianCitizen &&
    value.yearsInCanadaSince18 >= requiredYearsInCanada
  ) {
    return {
      eligibilityResult: ResultOptions.ELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.NONE,
      detail:
        'Based on the information provided, you are eligible for Allowance!',
    }
  } else if (
    value.livingCountry === LivingCountryOptions.AGREEMENT &&
    value.yearsInCanadaSince18 < requiredYearsInCanada
  ) {
    return {
      eligibilityResult: ResultOptions.CONDITIONAL,
      entitlementResult: 0,
      reason: ResultReasons.YEARS_IN_CANADA,
      detail:
        "Depending on Canada's agreement with this country, you may be eligible to receive the Allowance.",
    }
  } else if (value.yearsInCanadaSince18 < requiredYearsInCanada) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.YEARS_IN_CANADA,
      detail: `You currently do not appear to be eligible for the Allowance as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.`,
    }
  } else if (canadianCitizen == false) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.CITIZEN,
      detail:
        'You currently do not appear to be eligible for the Allowance as you have indicated that you do not have legal status in Canada. However, you may be in the future if you obtain legal status. If you are living outside of Canada, you may be eligible for the Allowance if you had legal status prior to your departure.',
    }
  } else if (value.livingCountry === LivingCountryOptions.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.SOCIAL_AGREEMENT,
      detail:
        'You currently do not appear to be eligible for the Allowance as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.',
    }
  }
  // fallback
  throw new Error('should not be here')
}
