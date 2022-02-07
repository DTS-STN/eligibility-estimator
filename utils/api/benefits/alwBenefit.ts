import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  EligibilityResult,
  EntitlementResult,
  ProcessedInput,
} from '../definitions/types'
import { legalValues, scraperData } from '../scrapers/output'
import { OutputItemAlw } from '../scrapers/tbl4PartneredAlwScraper'
import { BaseBenefit } from './_base'

export class AlwBenefit extends BaseBenefit {
  constructor(input: ProcessedInput, translations: Translations) {
    super(input, translations)
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqMarital = this.input.maritalStatus.partnered
    const meetsReqPartner = this.input.partnerBenefitStatus.gis
    const meetsReqAge = 60 <= this.input.age && this.input.age <= 64
    const overAgeReq = 65 <= this.input.age
    const underAgeReq = this.input.age < 60
    const meetsReqIncome = this.income < legalValues.MAX_ALW_INCOME
    const requiredYearsInCanada = 10
    const meetsReqYears =
      this.input.yearsInCanadaSince18 >= requiredYearsInCanada
    const meetsReqLegal = this.input.legalStatus.canadian

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
          result: ResultKey.ELIGIBLE,
          reason: ResultReason.NONE,
          detail: this.translations.detail.eligible,
        }
      } else if (this.input.age == 59) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.eligibleWhen60ApplyNow,
        }
      } else if (underAgeReq) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.eligibleWhen60,
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.mustBe60to64,
        }
      }
    } else if (overAgeReq) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.AGE,
        detail: this.translations.detail.mustBe60to64,
      }
    } else if (!meetsReqMarital && this.input.maritalStatus.provided) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.MARITAL,
        detail: this.translations.detail.mustBePartnered,
      }
    } else if (!meetsReqPartner && this.input.partnerBenefitStatus.provided) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.PARTNER,
        detail: this.translations.detail.mustHavePartnerWithGis,
      }
    } else if (!meetsReqIncome) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.INCOME,
        detail: this.translations.detail.mustMeetIncomeReq,
      }
    } else if (!meetsReqYears) {
      if (
        this.input.livingCountry.agreement ||
        this.input.everLivedSocialCountry
      ) {
        if (meetsReqAge) {
          return {
            result: ResultKey.CONDITIONAL,
            reason: ResultReason.YEARS_IN_CANADA,
            detail: this.translations.detail.dependingOnAgreement,
          }
        } else if (underAgeReq) {
          return {
            result: ResultKey.INELIGIBLE,
            reason: ResultReason.AGE,
            detail: this.translations.detail.dependingOnAgreementWhen60,
          }
        } else {
          return {
            result: ResultKey.INELIGIBLE,
            reason: ResultReason.AGE,
            detail: this.translations.detail.mustBe60to64,
          }
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: this.translations.detail.mustMeetYearReq,
        }
      }
    } else if (!meetsReqLegal) {
      if (underAgeReq) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.dependingOnLegalWhen60,
        }
      } else if (this.input.legalStatus.sponsored) {
        return {
          result: ResultKey.CONDITIONAL,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegalSponsored,
        }
      } else {
        return {
          result: ResultKey.CONDITIONAL,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegal,
        }
      }
    }
    throw new Error('entitlement logic failed to produce a result')
  }

  protected getEntitlement(): EntitlementResult {
    if (this.eligibility.result !== ResultKey.ELIGIBLE)
      return { result: 0, type: EntitlementResultType.NONE }

    const result = this.getEntitlementAmount()
    const type =
      result === -1
        ? EntitlementResultType.UNAVAILABLE
        : EntitlementResultType.FULL

    return { result, type }
  }

  private getEntitlementAmount(): number {
    if (this.input.partnerBenefitStatus.partialOas) return -1
    const tableItem = this.getTableItem()
    return tableItem ? tableItem.alw : 0
  }

  private getTableItem(): OutputItemAlw | undefined {
    const array = this.getTable()
    return array.find((x) => {
      if (x.range.low <= this.income && this.income <= x.range.high) return x
    })
  }

  private getTable(): OutputItemAlw[] {
    return scraperData.tbl4_partneredAlw
  }
}
