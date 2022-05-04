import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  EligibilityResult,
  EntitlementResultOas,
  ProcessedInput,
} from '../definitions/types'
import roundToTwo from '../helpers/roundToTwo'
import { legalValues } from '../scrapers/output'
import { BaseBenefit } from './_base'

export class OasBenefit extends BaseBenefit<EntitlementResultOas> {
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

  protected getEntitlement(): EntitlementResultOas {
    if (this.eligibility.result !== ResultKey.ELIGIBLE)
      return {
        result: 0,
        resultAt75: 0,
        clawback: 0,
        type: EntitlementResultType.NONE,
      }

    const resultCurrent = this.getCurrentEntitlementAmount()
    const resultAt75 = this.getAge75EntitlementAmount()
    const clawback = this.getClawbackAmount()
    const type =
      this.input.yearsInCanadaSince18 < 40
        ? EntitlementResultType.PARTIAL
        : EntitlementResultType.FULL

    if (type === EntitlementResultType.PARTIAL)
      this.eligibility.detail =
        this.input.age >= 65 && this.input.age < 70
          ? this.translations.detail.eligiblePartialOas65to69
          : this.translations.detail.eligiblePartialOas

    if (clawback)
      this.eligibility.detail += ` ${this.translations.detail.oasClawback}`

    if (resultCurrent !== resultAt75)
      this.eligibility.detail += ` ${this.translations.detail.oasIncreaseAt75}`

    return { result: resultCurrent, resultAt75: resultAt75, clawback, type }
  }

  /**
   * The expected OAS amount, ignoring age.
   */
  private getBaseEntitlementAmount(): number {
    return roundToTwo(
      Math.min(this.input.yearsInCanadaSince18 / 40, 1) *
        legalValues.MAX_OAS_ENTITLEMENT
    )
  }

  /**
   * The expected OAS amount, taking into account the client's age.
   * At age 75, OAS increases by 10%.
   */
  private getCurrentEntitlementAmount(): number {
    if (this.input.age < 75) return this.getBaseEntitlementAmount()
    else return this.getAge75EntitlementAmount()
  }

  /**
   * The expected OAS amount at age 75.
   */
  private getAge75EntitlementAmount(): number {
    return roundToTwo(this.getBaseEntitlementAmount() * 1.1)
  }

  private getClawbackAmount(): number {
    if (this.input.income.relevant < legalValues.OAS_RECOVERY_TAX_CUTOFF)
      return 0
    const incomeOverCutoff =
      this.input.income.relevant - legalValues.OAS_RECOVERY_TAX_CUTOFF
    const repaymentAmount = incomeOverCutoff * 0.15
    const oasYearly = this.getCurrentEntitlementAmount() * 12
    const result = Math.min(oasYearly, repaymentAmount)
    return roundToTwo(result)
  }
}
