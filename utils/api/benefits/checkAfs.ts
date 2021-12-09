import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { AfsSchema } from '../definitions/schemas'
import { BenefitResult, CalculationInput } from '../definitions/types'
import { validateRequestForBenefit } from '../helpers/validator'

export default function checkAfs(params: CalculationInput): BenefitResult {
  // validation
  const { result, value } = validateRequestForBenefit(AfsSchema, params)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const canadianCitizen = value.legalStatus
    ? [
        LegalStatus.CANADIAN_CITIZEN,
        LegalStatus.PERMANENT_RESIDENT,
        LegalStatus.INDIAN_STATUS,
      ].includes(value.legalStatus)
    : undefined

  // remove after confirming requirements
  const requiredYearsInCanada =
    value.livingCountry === LivingCountry.CANADA ? 10 : 10

  // main checks
  if (value.age < 60 || value.age > 64) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.AGE,
      detail:
        'You must be between 60 and 64 to be eligible for Allowance for Survivor.',
    }
  } else if (
    value.maritalStatus &&
    value.maritalStatus !== MaritalStatus.WIDOWED
  ) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.MARITAL,
      detail:
        'You must be a surviving partner or widowed to be eligible for Allowance for Survivor.',
    }
  } else if (value.income >= 25920) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail:
        'Your income is too high to be eligible for Allowance for Survivor.',
    }
  } else if (
    canadianCitizen &&
    value.yearsInCanadaSince18 >= requiredYearsInCanada
  ) {
    return {
      eligibilityResult: ResultKey.ELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.NONE,
      detail:
        'Based on the information provided, you are likely eligible for Allowance for Survivor!',
    }
  } else if (
    value.livingCountry === LivingCountry.AGREEMENT &&
    value.yearsInCanadaSince18 < requiredYearsInCanada
  ) {
    return {
      eligibilityResult: ResultKey.CONDITIONAL,
      entitlementResult: 0,
      reason: ResultReason.YEARS_IN_CANADA,
      detail:
        "Depending on Canada's agreement with this country, you may be eligible to receive the Allowance for Survivor. You are encouraged to contact Service Canada.",
    }
  } else if (value.yearsInCanadaSince18 < requiredYearsInCanada) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.YEARS_IN_CANADA,
      detail: `You currently do not appear to be eligible for the Allowance for Survivor as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.`,
    }
  } else if (canadianCitizen == false) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.CITIZEN,
      detail:
        'You currently do not appear to be eligible for the Allowance for Survivor as you have indicated that you do not have legal status in Canada. However, you may be in the future if you obtain legal status. If you are living outside of Canada, you may be eligible for the Allowance for Survivor if you had legal status prior to your departure.',
    }
  } else if (value.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail:
        'You currently do not appear to be eligible for the Allowance for Survivor as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.',
    }
  }
  // fallback
  throw new Error('should not be here')
}
