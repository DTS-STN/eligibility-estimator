import { MaritalStatus, ResultKey, ResultReason } from '../definitions/enums'
import { BenefitResult, ProcessedInput } from '../definitions/types'
import gisTables from '../scrapers/output'
import { OutputItemAfs } from '../scrapers/partneredSurvivorScraper'

export default function checkAfs(input: ProcessedInput): BenefitResult {
  // helpers
  const meetsReqMarital = input.maritalStatus.value == MaritalStatus.WIDOWED
  const meetsReqAge = 60 <= input.age && input.age <= 64
  const overAgeReq = 65 <= input.age
  const underAgeReq = input.age < 60
  const meetsReqIncome = input.income < 25920
  const requiredYearsInCanada = 10
  const meetsReqYears = input.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal = input.legalStatus.canadian

  // main checks
  if (meetsReqLegal && meetsReqYears && meetsReqMarital && meetsReqIncome) {
    if (meetsReqAge) {
      const entitlementResult = new AfsEntitlement(
        input.income
      ).getEntitlement()
      return {
        eligibilityResult: ResultKey.ELIGIBLE,
        entitlementResult,
        reason: ResultReason.NONE,
        detail: input._translations.detail.eligible,
      }
    } else if (input.age == 59) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.eligibleWhen60ApplyNow,
      }
    } else if (underAgeReq) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.eligibleWhen60,
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.mustBe60to64,
      }
    }
  } else if (overAgeReq) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.AGE,
      detail: input._translations.detail.mustBe60to64,
    }
  } else if (!meetsReqMarital && input.maritalStatus !== undefined) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.MARITAL,
      detail: input._translations.detail.mustBeWidowed,
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: input._translations.detail.mustMeetIncomeReq,
    }
  } else if (!meetsReqYears) {
    if (input.livingCountry.agreement || input.everLivedSocialCountry) {
      if (meetsReqAge) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: input._translations.detail.dependingOnAgreement,
        }
      } else if (underAgeReq) {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: input._translations.detail.dependingOnAgreementWhen60,
        }
      } else {
        return {
          eligibilityResult: ResultKey.INELIGIBLE,
          entitlementResult: 0,
          reason: ResultReason.AGE,
          detail: input._translations.detail.mustBe60to64,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: input._translations.detail.mustMeetYearReq,
      }
    }
  } else if (!meetsReqLegal) {
    if (underAgeReq) {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.dependingOnLegalWhen60,
      }
    } else if (input.legalStatus.sponsored) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: input._translations.detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: input._translations.detail.dependingOnLegal,
      }
    }
  } else if (input.livingCountry.noAgreement) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.SOCIAL_AGREEMENT,
      detail: input._translations.detail.ineligibleYearsOrCountry,
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
