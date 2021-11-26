import {
  CalculationParams,
  CalculationResult,
  GisSchema,
  MaritalStatusOptions,
  ResultOptions,
  ResultReasons,
} from './types'
import { validateRequestForBenefit } from './validator'

export default function checkGis(
  params: CalculationParams,
  oasResult: CalculationResult
): CalculationResult {
  // include OAS result
  const paramsWithOas = { ...params, _oasEligible: oasResult.result }

  // validation
  const { result, value } = validateRequestForBenefit(GisSchema, paramsWithOas)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const partnered =
    value.maritalStatus == MaritalStatusOptions.MARRIED ||
    value.maritalStatus == MaritalStatusOptions.COMMONLAW

  // initial checks
  if (oasResult.result == ResultOptions.INELIGIBLE) {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.OAS,
      detail: 'You need to be eligible for OAS to be eligible for GIS.',
    }
  } else if (oasResult.result == ResultOptions.MORE_INFO) {
    return {
      result: ResultOptions.MORE_INFO,
      reason: ResultReasons.MORE_INFO,
      detail: 'You need to complete the OAS eligibilty check first.',
    }
  }

  // determine max income
  let maxIncome = -1
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
      return {
        result: ResultOptions.ELIGIBLE,
        reason: ResultReasons.NONE,
        detail: 'Based on the information provided, you are eligible for GIS!',
      }
    } else {
      return {
        result: ResultOptions.INELIGIBLE,
        reason: ResultReasons.AGE,
        detail: 'You will be eligible for GIS when you turn 65.',
      }
    }
  } else {
    return {
      result: ResultOptions.INELIGIBLE,
      reason: ResultReasons.INCOME,
      detail: 'Your income is too high to be eligible for GIS.',
    }
  }
}
