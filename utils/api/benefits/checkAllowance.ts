import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { AllowanceSchema } from '../definitions/schemas'
import { BenefitResult, CalculationInput } from '../definitions/types'
import { validateRequestForBenefit } from '../helpers/validator'

export default function checkAllowance(
  params: CalculationInput
): BenefitResult {
  // validation
  const { result, value } = validateRequestForBenefit(AllowanceSchema, params)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const meetsReqMarital =
    value.maritalStatus == MaritalStatus.MARRIED ||
    value.maritalStatus == MaritalStatus.COMMON_LAW
  const meetsReqPartner = value.partnerReceivingOas !== false
  const meetsReqAge = 60 <= value.age && value.age <= 64
  const overAgeReq = 65 <= value.age
  const underAgeReq = value.age < 60
  const meetsReqIncome = value.income < 35616
  const requiredYearsInCanada = 10
  const meetsReqYears = value.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal =
    value.legalStatus === LegalStatus.CANADIAN_CITIZEN ||
    value.legalStatus === LegalStatus.PERMANENT_RESIDENT ||
    value.legalStatus === LegalStatus.INDIAN_STATUS
  // partner must be getting OAS and GIS

  // main checks
  if (
    meetsReqLegal &&
    meetsReqYears &&
    meetsReqMarital &&
    meetsReqIncome &&
    meetsReqPartner
  ) {
    if (meetsReqAge) {
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.NONE,
        detail:
          'Based on the information provided, you are likely eligible for Allowance!',
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
        detail: 'You must be between 60 and 64 to be eligible for Allowance.',
      }
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: 'Your income is too high to be eligible for Allowance.',
    }
  } else if (overAgeReq) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.AGE,
      detail: 'You must be between 60 and 64 to be eligible for Allowance.',
    }
  } else if (!meetsReqMarital) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.MARITAL,
      detail: 'You must be common-law or married to be eligible for Allowance.',
    }
  } else if (!meetsReqPartner) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.OAS,
      detail:
        'Your partner must be receiving OAS to be eligible for Allowance.',
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
            "Depending on Canada's agreement with this country, you may be eligible to receive Allowance. You are encouraged to contact Service Canada.",
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
          detail: 'You must be between 60 and 64 to be eligible for Allowance.',
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: `You currently do not appear to be eligible for the Allowance as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.`,
      }
    }
  } else if (!meetsReqLegal) {
    if (value.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail:
          'You may be eligible for Allowance, please contact Service Canada to confirm.',
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail:
          'You may be eligible for Allowance, and should contact Service Canada to confirm due to your legal status in Canada.',
      }
    }
  } else if (value.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail:
        'You currently do not appear to be eligible for the Allowance as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.',
    }
  }
  // fallback
  throw new Error('should not be here')
}
