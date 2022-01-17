import { ResultKey, ResultReason } from '../definitions/enums'
import { MAX_ALLOWANCE_INCOME } from '../definitions/legalValues'
import { BenefitResult, ProcessedInput } from '../definitions/types'
import gisTables from '../scrapers/output'
import { OutputItemAllowance } from '../scrapers/partneredAllowanceScraper'

export default function checkAllowance(input: ProcessedInput): BenefitResult {
  // helpers
  const meetsReqMarital = input.maritalStatus.partnered
  const meetsReqPartner =
    input.partnerBenefitStatus.anyOas && input.partnerBenefitStatus.gis
  const meetsReqAge = 60 <= input.age && input.age <= 64
  const overAgeReq = 65 <= input.age
  const underAgeReq = input.age < 60
  const meetsReqIncome = input.income < MAX_ALLOWANCE_INCOME
  const requiredYearsInCanada = 10
  const meetsReqYears = input.yearsInCanadaSince18 >= requiredYearsInCanada
  const meetsReqLegal = input.legalStatus.canadian

  // main checks
  if (
    meetsReqLegal &&
    meetsReqYears &&
    meetsReqMarital &&
    meetsReqIncome &&
    meetsReqPartner
  ) {
    if (meetsReqAge) {
      const entitlementResult = new AllowanceEntitlement(
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
  } else if (!meetsReqMarital && input.maritalStatus.provided) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.MARITAL,
      detail: input._translations.detail.mustBePartnered,
    }
  } else if (!meetsReqPartner && input.partnerBenefitStatus.provided) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.OAS,
      detail: input._translations.detail.mustHavePartnerWithOas,
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

class AllowanceEntitlement {
  income: number

  constructor(income: number) {
    this.income = income
  }

  getEntitlement(): number {
    const tableItem = this.getTableItem()
    return tableItem ? tableItem.allowance : 0
  }

  getTableItem(): OutputItemAllowance | undefined {
    const array = this.getTable()
    return array.find((x) => {
      if (x.range.low <= this.income && this.income <= x.range.high) return x
    })
  }

  getTable(): OutputItemAllowance[] {
    return gisTables.partneredAllowance
  }
}
