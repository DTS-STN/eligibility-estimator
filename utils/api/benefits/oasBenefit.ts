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
import roundToTwo from '../helpers/roundToTwo'
import { legalValues } from '../scrapers/output'
import { BaseBenefit } from './_base'

export class OasBenefit extends BaseBenefit {
  constructor(input: ProcessedInput, translations: Translations) {
    super(input, translations)
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqAge = this.input.age >= 65
    const meetsReqIncome = this.income < legalValues.MAX_OAS_INCOME
    const requiredYearsInCanada = this.input.livingCountry.canada ? 10 : 20
    const meetsReqYears =
      this.input.yearsInCanadaSince18 >= requiredYearsInCanada
    const meetsReqLegal = this.input.legalStatus.canadian

    // main checks
    if (meetsReqIncome && meetsReqLegal && meetsReqYears) {
      if (this.input.age >= 70) {
        return {
          result: ResultKey.ELIGIBLE,
          reason: ResultReason.NONE,
          detail: this.translations.detail.eligible,
        }
      } else if (this.input.age >= 65 && this.input.age < 70) {
        return {
          result: ResultKey.ELIGIBLE,
          reason: ResultReason.NONE,
          detail: this.translations.detail.eligibleOas65to69,
        }
      } else if (this.input.age == 64) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.eligibleWhen65ApplyNowOas,
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.eligibleWhen65,
        }
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
            result: ResultKey.UNAVAILABLE,
            reason: ResultReason.YEARS_IN_CANADA,
            detail: this.translations.detail.dependingOnAgreement,
          }
        } else {
          return {
            result: ResultKey.INELIGIBLE,
            reason: ResultReason.AGE_YOUNG,
            detail: this.translations.detail.dependingOnAgreementWhen65,
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
      if (!meetsReqAge) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.dependingOnLegalWhen65,
        }
      } else if (this.input.legalStatus.sponsored) {
        return {
          result: ResultKey.UNAVAILABLE,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegalSponsored,
        }
      } else {
        return {
          result: ResultKey.UNAVAILABLE,
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
      this.input.yearsInCanadaSince18 < 40
        ? EntitlementResultType.PARTIAL
        : EntitlementResultType.FULL

    if (type === EntitlementResultType.PARTIAL)
      this.eligibility.detail =
        this.input.age >= 65 && this.input.age < 70
          ? this.translations.detail.eligiblePartialOas65to69
          : this.translations.detail.eligiblePartialOas

    return { result, type }
  }

  private getEntitlementAmount(): number {
    return roundToTwo(
      Math.min(this.input.yearsInCanadaSince18 / 40, 1) *
        legalValues.MAX_OAS_ENTITLEMENT
    )
  }
}
