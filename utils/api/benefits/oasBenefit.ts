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
import legalValues from '../scrapers/output'
import { BaseBenefit } from './_base'

export class OasBenefit extends BaseBenefit<EntitlementResultOas> {
  constructor(input: ProcessedInput, translations: Translations) {
    super(input, translations)
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqAge = this.input.age >= 65
    const meetsReqIncome = this.income < legalValues.oas.incomeLimit
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
        deferral: { years: 0, increase: 0 },
        type: EntitlementResultType.NONE,
      }

    const resultCurrent = this.currentEntitlementAmount
    const resultAt75 = this.age75EntitlementAmount
    const clawback = this.clawbackAmount
    const type =
      this.input.yearsInCanadaSince18 < 40
        ? EntitlementResultType.PARTIAL
        : EntitlementResultType.FULL

    if (type === EntitlementResultType.PARTIAL)
      this.eligibility.detail =
        this.input.age >= 65 && this.input.age < 70
          ? this.translations.detail.eligiblePartialOas65to69
          : this.translations.detail.eligiblePartialOas

    if (resultCurrent !== resultAt75)
      this.eligibility.detail += ` ${this.translations.detail.oasIncreaseAt75}`
    else
      this.eligibility.detail += ` ${this.translations.detail.oasIncreaseAt75Applied}`

    if (this.deferralIncrease)
      this.eligibility.detail += ` ${this.translations.detail.oasDeferralIncrease}`

    if (clawback)
      this.eligibility.detail += ` ${this.translations.detail.oasClawback}`

    return {
      result: resultCurrent,
      resultAt75: resultAt75,
      clawback,
      deferral: { years: this.deferralYears, increase: this.deferralIncrease },
      type,
    }
  }

  /**
   * The "base" OAS amount, considering yearsInCanada, ignoring deferral.
   */
  private get baseAmount() {
    return (
      Math.min(this.input.yearsInCanadaSince18 / 40, 1) * legalValues.oas.amount
    )
  }

  /**
   * The number of years the client has chosen to defer their OAS pension.
   */
  private get deferralYears(): number {
    return Math.max(0, this.input.oasAge - 65) // the number of years deferred (between zero and five)
  }

  /**
   * The dollar amount by which the OAS entitlement will increase due to deferral.
   */
  private get deferralIncrease() {
    const deferralIncreaseByMonth = 0.006 // the increase to the monthly payment per month deferred
    const deferralIncreaseByYear = deferralIncreaseByMonth * 12 // the increase to the monthly payment per year deferred
    // the extra entitlement received because of the deferral
    return roundToTwo(
      this.deferralYears * deferralIncreaseByYear * this.baseAmount
    )
  }

  /**
   * The expected OAS amount at age 65, considering yearsInCanada and deferral.
   */
  private get age65EntitlementAmount(): number {
    const baseAmount = this.baseAmount // the base amount before deferral calculations
    const deferralIncrease = this.deferralIncrease
    const amountWithDeferralIncrease = baseAmount + deferralIncrease // the final amount
    return roundToTwo(amountWithDeferralIncrease)
  }

  /**
   * The expected OAS amount at age 75.
   */
  private get age75EntitlementAmount(): number {
    return roundToTwo(this.age65EntitlementAmount * 1.1)
  }

  /**
   * The expected OAS amount, taking into account the client's age.
   * At age 75, OAS increases by 10%.
   */
  private get currentEntitlementAmount(): number {
    if (this.input.age < 75) return this.age65EntitlementAmount
    else return this.age75EntitlementAmount
  }

  /**
   * The amount of "clawback" aka "repayment tax" the client will have to repay.
   */
  private get clawbackAmount(): number {
    if (this.input.income.relevant < legalValues.oas.clawbackIncomeLimit)
      return 0
    const incomeOverCutoff =
      this.input.income.relevant - legalValues.oas.clawbackIncomeLimit
    const repaymentAmount = incomeOverCutoff * 0.15
    const oasYearly = this.currentEntitlementAmount * 12
    const result = Math.min(oasYearly, repaymentAmount)
    return roundToTwo(result)
  }
}
