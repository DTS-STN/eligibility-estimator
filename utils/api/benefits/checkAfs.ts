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
  const meetsReqMarital = value.maritalStatus == MaritalStatus.WIDOWED
  const meetsReqAge = 60 <= value.age && value.age <= 64
  const overAgeReq = 65 <= value.age
  const underAgeReq = value.age < 60
  const meetsReqIncome = value.income < 25920
  const requiredYearsInCanada = 10
  const meetsReqYears = value.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal =
    value.legalStatus === LegalStatus.CANADIAN_CITIZEN ||
    value.legalStatus === LegalStatus.PERMANENT_RESIDENT ||
    value.legalStatus === LegalStatus.INDIAN_STATUS

  // main checks
  if (meetsReqLegal && meetsReqYears && meetsReqMarital && meetsReqIncome) {
    if (meetsReqAge) {
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.NONE,
        detail:
          'Based on the information provided, you are likely eligible for Allowance for Survivor!',
      }
    } else if (value.age == 59) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail:
          'You will likely be eligible when you turn 60, however you may be able to apply now, please contact Service Canada for more information.',
      }
    } else if (underAgeReq) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: 'You will likely be eligible when you turn 60.',
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail:
          'You must be between 60 and 64 to be eligible for Allowance for Survivor.',
      }
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail:
        'Your income is too high to be eligible for Allowance for Survivor.',
    }
  } else if (overAgeReq) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.AGE,
      detail:
        'You must be between 60 and 64 to be eligible for Allowance for Survivor.',
    }
  } else if (!meetsReqMarital) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.MARITAL,
      detail:
        'You must be a surviving partner or widowed to be eligible for Allowance for Survivor.',
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
            "Depending on Canada's agreement with this country, you may be eligible to receive Allowance for Survivor. You are encouraged to contact Service Canada.",
        }
      } else if (underAgeReq) {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail:
            "You may be eligible when you turn 60, depending on Canada's agreement with this country. You are encouraged to contact Service Canada.",
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail:
            'You must be between 60 and 64 to be eligible for Allowance for Survivor.',
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: `You currently do not appear to be eligible for the Allowance for Survivor as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.`,
      }
    }
  } else if (!meetsReqLegal) {
    if (value.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail:
          'You may be eligible for Allowance for Survivor, please contact Service Canada to confirm.',
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail:
          'You may be eligible for Allowance for Survivor, and should contact Service Canada to confirm due to your legal status in Canada.',
      }
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
