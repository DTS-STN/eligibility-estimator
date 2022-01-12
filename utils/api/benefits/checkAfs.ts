import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { BenefitResult, CalculationInput } from '../definitions/types'
import gisTables from '../scrapers/output'
import { OutputItemAfs } from '../scrapers/partneredSurvivorScraper'

export default function checkAfs(params: CalculationInput): BenefitResult {
  // helpers
  const meetsReqMarital = params.maritalStatus.value == MaritalStatus.WIDOWED
  const meetsReqAge = 60 <= params.age && params.age <= 64
  const overAgeReq = 65 <= params.age
  const underAgeReq = params.age < 60
  const meetsReqIncome = params.income < 25920
  const requiredYearsInCanada = 10
  const meetsReqYears = params.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal =
    params.legalStatus === LegalStatus.CANADIAN_CITIZEN ||
    params.legalStatus === LegalStatus.PERMANENT_RESIDENT ||
    params.legalStatus === LegalStatus.INDIAN_STATUS

  // main checks
  if (meetsReqLegal && meetsReqYears && meetsReqMarital && meetsReqIncome) {
    if (meetsReqAge) {
      const entitlementResult = new AfsEntitlement(
        params.income
      ).getEntitlement()
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult,
        reason: ResultReason.NONE,
        detail: params._translations.detail.eligible,
      }
    } else if (params.age == 59) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: params._translations.detail.eligibleWhen60ApplyNow,
      }
    } else if (underAgeReq) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: params._translations.detail.eligibleWhen60,
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: params._translations.detail.mustBe60to64,
      }
    }
  } else if (overAgeReq) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.AGE,
      detail: params._translations.detail.mustBe60to64,
    }
  } else if (!meetsReqMarital && params.maritalStatus !== undefined) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.MARITAL,
      detail: params._translations.detail.mustBeWidowed,
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: params._translations.detail.mustMeetIncomeReq,
    }
  } else if (!meetsReqYears) {
    if (
      params.livingCountry === LivingCountry.AGREEMENT ||
      params.everLivedSocialCountry
    ) {
      if (meetsReqAge) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: params._translations.detail.dependingOnAgreement,
        }
      } else if (underAgeReq) {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: params._translations.detail.dependingOnAgreementWhen60,
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: params._translations.detail.mustBe60to64,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: params._translations.detail.mustMeetYearReq,
      }
    }
  } else if (!meetsReqLegal) {
    if (underAgeReq) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: params._translations.detail.dependingOnLegalWhen60,
      }
    } else if (params.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: params._translations.detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: params._translations.detail.dependingOnLegal,
      }
    }
  } else if (params.livingCountry === LivingCountry.NO_AGREEMENT) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail: params._translations.detail.ineligibleYearsOrCountry,
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
