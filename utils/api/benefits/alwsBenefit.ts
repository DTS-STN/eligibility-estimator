import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  EntitlementResultType,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  EligibilityResult,
  EntitlementResultGeneric,
  ProcessedInput,
  Link,
  LinkWithAction,
} from '../definitions/types'
import legalValues from '../scrapers/output'
import { BaseBenefit } from './_base'
import { EntitlementFormula } from './entitlementFormula'

export class AlwsBenefit extends BaseBenefit<EntitlementResultGeneric> {
  future: Boolean
  constructor(
    input: ProcessedInput,
    translations: Translations,
    future: Boolean
  ) {
    super(input, translations, BenefitKey.alws)
    this.future = future
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqMarital =
      this.input.maritalStatus.value == MaritalStatus.WIDOWED
    const meetsReqAge = 60 <= this.input.age && this.input.age < 65
    const overAgeReq = 65 <= this.input.age
    const underAgeReq = this.input.age < 60

    // if income is not provided, assume they meet the income requirement
    const skipReqIncome = !this.input.income.provided
    const maxIncome = legalValues.alw.afsIncomeLimit
    const meetsReqIncome =
      skipReqIncome || this.input.income.relevant < maxIncome

    const requiredYearsInCanada = 10
    const meetsReqYears =
      this.input.yearsInCanadaSince18 >= requiredYearsInCanada
    const meetsReqLegal = this.input.legalStatus.canadian
    const livingCanada = this.input.livingCountry.canada
    const liveOnlyInCanadaMoreThanHalfYear = this.input.livedOnlyInCanada

    // main checks
    // if not windowed
    if (!meetsReqMarital) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.MARITAL,
        detail: this.translations.detail.afsNotEligible,
      }
    }
    // if age is less than 60
    else if (underAgeReq) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.AGE_YOUNG,
        detail: this.translations.detail.eligibleWhen60,
      }
    }
    // if age is greater or equals to 65
    else if (overAgeReq) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.AGE,
        detail: this.translations.detail.afsNotEligible,
      }
    }
    // if legal status not valid
    else if (!meetsReqLegal) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.LEGAL_STATUS,
        detail: this.translations.detail.dependingOnLegal,
      }
    } else if (!livingCanada) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.LIVING_COUNTRY,
        detail: this.translations.detail.mustBeInCanada,
      }
    }
    //check residency history
    else if (!livingCanada && !liveOnlyInCanadaMoreThanHalfYear) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.LIVING_COUNTRY,
        detail: this.translations.detail.mustBeInCanada,
      }
    }
    // living in Canada but less than 10 years
    else if (livingCanada && !meetsReqYears) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.YEARS_IN_CANADA,
        detail: this.translations.detail.mustMeetYearReq,
      }
    }

    // Eligible scenarios
    if (skipReqIncome) {
      return {
        result: ResultKey.INCOME_DEPENDENT,
        reason: ResultReason.INCOME_MISSING,
        detail: this.translations.detail.eligibleDependingOnIncomeNoEntitlement,
        incomeMustBeLessThan: maxIncome,
      }
    } else {
      const amount = this.formulaResult()
      if (amount === 0) {
        return {
          result: ResultKey.ELIGIBLE,
          reason: ResultReason.NONE,
          detail: this.future
            ? this.translations.detail.futureEligibleIncomeTooHighAlws
            : this.translations.detail.eligibleIncomeTooHigh,
        }
      } else {
        return {
          result: ResultKey.ELIGIBLE,
          reason: ResultReason.NONE,
          detail: this.future
            ? this.translations.detail.futureEligible60
            : this.translations.detail.eligible,
        }
      }
    }
  }

  protected getEntitlement(): EntitlementResultGeneric {
    const autoEnrollment = this.getAutoEnrollment()
    // client is not eligible, and it's not because income missing? they get nothing.
    if (
      this.eligibility.result !== ResultKey.ELIGIBLE &&
      this.eligibility.result !== ResultKey.INCOME_DEPENDENT
    )
      return {
        result: 0,
        type: EntitlementResultType.NONE,
        autoEnrollment,
      }

    // income is not provided, and they are eligible depending on income? entitlement unavailable.
    if (
      !this.input.income.provided &&
      this.eligibility.result === ResultKey.INCOME_DEPENDENT
    )
      return {
        result: -1,
        type: EntitlementResultType.UNAVAILABLE,
        autoEnrollment,
      }

    // otherwise, let's do it!

    const type = EntitlementResultType.FULL

    return { result: this.formulaResult(), type, autoEnrollment }
  }

  protected formulaResult(): number {
    return new EntitlementFormula(
      this.input.income.relevant,
      this.input.maritalStatus,
      this.input.partnerBenefitStatus,
      this.input.age
    ).getEntitlementAmount()
  }
  /**
   * For this benefit, always return false, because we don't know any better as of now.
   */
  protected getAutoEnrollment(): boolean {
    return false
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT ||
      (this.eligibility.result === ResultKey.INELIGIBLE &&
        this.eligibility.reason === ResultReason.AGE_YOUNG)
    ) {
      links.push(this.translations.links.apply[BenefitKey.alws])
    }
    links.push(this.translations.links.overview[BenefitKey.alws])
    return links
  }
}
