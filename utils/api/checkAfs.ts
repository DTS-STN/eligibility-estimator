import normalizeLivingCountry from './socialAgreement'
import {
  AfsSchema,
  BenefitResult,
  CalculationInput,
  LegalStatusOptions,
  LivingCountryOptions,
  MaritalStatusOptions,
  ResultOptions,
  ResultReasons,
} from './types'
import { validateRequestForBenefit } from './validator'

export default function checkAfs(params: CalculationInput): BenefitResult {
  // validation
  const { result, value } = validateRequestForBenefit(AfsSchema, params)
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

  // remove after confirming requirements
  const requiredYearsInCanada =
    value.livingCountry === LivingCountryOptions.CANADA ? 10 : 10

  // main checks
  if (value.age < 60 || value.age > 64) {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.AGE,
      detail:
        'You must be between 60 and 64 to be eligible for Allowance for Survivor.',
    }
  } else if (
    value.maritalStatus &&
    value.maritalStatus !== MaritalStatusOptions.WIDOWED
  ) {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.MARITAL,
      detail:
        'You must be widowed, not common-law or married, to be eligible for Allowance for Survivor.',
    }
  } else if (value.income >= 25920) {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.INCOME,
      detail:
        'Your income is too high to be eligible for Allowance for Survivor.',
    }
  } else if (
    canadianCitizen &&
    value.yearsInCanadaSince18 >= requiredYearsInCanada
  ) {
    return {
      result: ResultOptions.ELIGIBLE,
      reason: ResultReasons.NONE,
      detail:
        'Based on the information provided, you are eligible for Allowance for Survivor!',
    }
  } else if (
    value.livingCountry === LivingCountryOptions.AGREEMENT &&
    value.yearsInCanadaSince18 < requiredYearsInCanada
  ) {
    return {
      result: ResultOptions.CONDITIONAL,
      reason: ResultReasons.YEARS_IN_CANADA,
      detail:
        "Depending on Canada's agreement with this country, you may be eligible to receive the Allowance for Survivor.",
    }
  } else if (value.yearsInCanadaSince18 < requiredYearsInCanada) {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.YEARS_IN_CANADA,
      detail: `You currently do not appear to be eligible for the Allowance for Survivor as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.`,
    }
  } else if (canadianCitizen == false) {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.CITIZEN,
      detail:
        'You currently do not appear to be eligible for the Allowance for Survivor as you have indicated that you do not have legal status in Canada. However, you may be in the future if you obtain legal status. If you are living outside of Canada, you may be eligible for the Allowance for Survivor if you had legal status prior to your departure.',
    }
  } else if (value.livingCountry === LivingCountryOptions.NO_AGREEMENT) {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.SOCIAL_AGREEMENT,
      detail:
        'You currently do not appear to be eligible for the Allowance for Survivor as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.',
    }
  }
  // fallback
  throw new Error('should not be here')
}
