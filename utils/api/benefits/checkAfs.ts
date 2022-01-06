import { Translations } from '../../../i18n/api'
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
import gisTables from '../scrapers/output'
import { OutputItemAfs } from '../scrapers/partneredSurvivorScraper'

export default function checkAfs(
  params: CalculationInput,
  translations: Translations
): BenefitResult {
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
      const entitlementResult = new AfsEntitlement(
        value.income
      ).getEntitlement()
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult,
        reason: ResultReason.NONE,
        detail: translations.detail.eligible,
      }
    } else if (value.age == 59) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: translations.detail.eligibleWhen60ApplyNow,
      }
    } else if (underAgeReq) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: translations.detail.eligibleWhen60,
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: translations.detail.mustBe60to64,
      }
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: translations.detail.mustMeetIncomeReq,
    }
  } else if (overAgeReq) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.AGE,
      detail: translations.detail.mustBe60to64,
    }
  } else if (!meetsReqMarital) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.MARITAL,
      detail: translations.detail.mustBeWidowed,
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
          detail: translations.detail.dependingOnAgreement,
        }
      } else if (underAgeReq) {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: translations.detail.dependingOnAgreementWhen60,
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: translations.detail.mustBe60to64,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: translations.detail.mustMeetYearReq,
      }
    }
  } else if (!meetsReqLegal) {
    if (underAgeReq) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: translations.detail.dependingOnLegalWhen60,
      }
    } else if (value.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: translations.detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: translations.detail.dependingOnLegal,
      }
    }
  } else if (value.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail: translations.detail.ineligibleYearsOrCountry,
    }
  }
  // fallback
  throw new Error('should not be here')
}

class AfsEntitlement {
  income: number

  constructor(income: number) {
    this.income = income
  }

  getEntitlement(): number {
    const tableItem = this.getTableItem()
    console.log(tableItem)
    return tableItem ? tableItem.afs : 0
  }

  getTableItem(): OutputItemAfs | undefined {
    const array = this.getTable()
    return array.find((x) => {
      if (x.range.low <= this.income && this.income <= x.range.high) return x
    })
  }

  getTable(): OutputItemAfs[] {
    return gisTables.partneredSurvivor
  }
}
