import {
  BenefitResult,
  CalculationInput,
  GisSchema,
  MaritalStatusOptions,
  ResultOptions,
  ResultReasons,
} from './types'
import { validateRequestForBenefit } from './validator'

export default function checkGis(
  params: CalculationInput,
  oasResult: BenefitResult
): BenefitResult {
  // include OAS result
  const paramsWithOas = { ...params, _oasEligible: oasResult.eligibilityResult }

  // validation
  const { result, value } = validateRequestForBenefit(GisSchema, paramsWithOas)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const partnered =
    value.maritalStatus == MaritalStatusOptions.MARRIED ||
    value.maritalStatus == MaritalStatusOptions.COMMON_LAW

  // initial checks
  if (value.livingCountry != undefined && value.livingCountry != 'Canada') {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.LIVING_COUNTRY,
      detail: 'You need to live in Canada to be eligible for GIS.',
    }
  } else if (oasResult.eligibilityResult == ResultOptions.INELIGIBLE) {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.OAS,
      detail: 'You need to be eligible for OAS to be eligible for GIS.',
    }
  } else if (oasResult.eligibilityResult == ResultOptions.MORE_INFO) {
    return {
      eligibilityResult: ResultOptions.MORE_INFO,
      entitlementResult: 0,
      reason: ResultReasons.MORE_INFO,
      detail: 'You need to complete the OAS eligibility check first.',
    }
  }

  // determine max income
  let maxIncome: number
  if (partnered) {
    if (value.partnerReceivingOas) {
      maxIncome = 24048
    } else {
      maxIncome = 43680
    }
  } else {
    maxIncome = 18216
  }

  // main checks
  if (value.income <= maxIncome) {
    if (value.age >= 65) {
      if (oasResult.eligibilityResult == ResultOptions.CONDITIONAL) {
        return {
          eligibilityResult: ResultOptions.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReasons.OAS,
          detail:
            'You may be eligible, please contact Service Canada for more information.',
        }
      } else {
        return {
          eligibilityResult: ResultOptions.ELIGIBLE,
          entitlementResult: 0,
          reason: ResultReasons.NONE,
          detail:
            'Based on the information provided, you are eligible for GIS!',
        }
      }
    } else {
      return {
        eligibilityResult: ResultOptions.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReasons.AGE,
        detail: 'You will be eligible for GIS when you turn 65.',
      }
    }
  } else {
    return {
      eligibilityResult: ResultOptions.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReasons.INCOME,
      detail: 'Your income is too high to be eligible for GIS.',
    }
  }
}
