import { MaritalStatus, ResultKey, ResultReason } from '../definitions/enums'
import { GisSchema } from '../definitions/schemas'
import { BenefitResult, CalculationInput } from '../definitions/types'
import { validateRequestForBenefit } from '../helpers/validator'

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
    value.maritalStatus == MaritalStatus.MARRIED ||
    value.maritalStatus == MaritalStatus.COMMON_LAW

  // initial checks
  if (value.livingCountry != undefined && value.livingCountry != 'Canada') {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.LIVING_COUNTRY,
      detail: 'You need to live in Canada to be eligible for GIS.',
    }
  } else if (oasResult.eligibilityResult == ResultKey.INELIGIBLE) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.OAS,
      detail: 'You need to be eligible for OAS to be eligible for GIS.',
    }
  } else if (oasResult.eligibilityResult == ResultKey.MORE_INFO) {
    return {
      eligibilityResult: ResultKey.MORE_INFO,
      entitlementResult: 0,
      reason: ResultReason.MORE_INFO,
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
      if (oasResult.eligibilityResult == ResultKey.CONDITIONAL) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.OAS,
          detail:
            'You may be eligible, please contact Service Canada for more information.',
        }
      } else {
        return {
          eligibilityResult: ResultKey.ELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.NONE,
          detail:
            'Based on the information provided, you are eligible for GIS!',
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: 'You will be eligible for GIS when you turn 65.',
      }
    }
  } else {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: 'Your income is too high to be eligible for GIS.',
    }
  }
}
