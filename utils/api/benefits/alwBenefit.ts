import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  EligibilityResult,
  EntitlementResultGeneric,
  ProcessedInput,
  CardCollapsedText,
  Link,
  LinkWithAction,
} from '../definitions/types'
import legalValues from '../scrapers/output'
import { BaseBenefit } from './_base'
import { EntitlementFormula } from './entitlementFormula'

export class AlwBenefit extends BaseBenefit<EntitlementResultGeneric> {
  partner: Boolean
  constructor(
    input: ProcessedInput,
    translations: Translations,
    partner?: Boolean
  ) {
    super(input, translations, BenefitKey.alw)
    this.partner = partner
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqMarital = this.input.maritalStatus.partnered
    const meetsReqPartner = this.input.partnerBenefitStatus.gis
    const meetsReqAge = 60 <= this.input.age && this.input.age < 65
    const overAgeReq = 65 <= this.input.age
    const underAgeReq = this.input.age < 60
    const meetsReqCountry = this.input.livingCountry.canada

    // if income is not provided, assume they meet the income requirement
    const skipReqIncome = !this.input.income.provided
    const maxIncome = legalValues.alw.alwIncomeLimit
    const meetsReqIncome =
      skipReqIncome || this.input.income.relevant <= maxIncome

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
      meetsReqPartner &&
      meetsReqCountry
    ) {
      if (meetsReqAge && skipReqIncome) {
        return {
          result: ResultKey.INCOME_DEPENDENT,
          reason: ResultReason.INCOME_MISSING,
          detail:
            this.translations.detail.eligibleDependingOnIncomeNoEntitlement,
          incomeMustBeLessThan: maxIncome,
        }
      } else if (meetsReqAge) {
        const amount = this.formulaResult()

        // client is Eligible however if the amount returned is 0 it requires a different text
        if (amount === 0) {
          return {
            result: ResultKey.ELIGIBLE,
            reason: ResultReason.NONE,
            detail: this.translations.detail.alwEligibleIncomeTooHigh,
          }
        } else {
          return {
            result: ResultKey.ELIGIBLE,
            reason: ResultReason.NONE,
            detail: this.translations.detail.eligible,
          }
        }
      } else if (this.input.age == 59) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.eligibleWhen60ApplyNow,
        }
      } else if (underAgeReq) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.eligibleWhen60,
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE,
          detail: this.translations.detail.alwNotEligible,
        }
      }
    } else if (overAgeReq) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.AGE,
        detail: this.translations.detail.alwNotEligible,
      }
    } else if (underAgeReq && meetsReqMarital) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.AGE_YOUNG,
        detail: this.translations.detail.eligibleWhen60,
      }
    } else if (!meetsReqMarital && this.input.maritalStatus.provided) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.MARITAL,
        detail: this.translations.detail.alwNotEligible,
      }
    } else if (!meetsReqPartner) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.PARTNER,
        detail: this.translations.detail.alwNotEligible,
      }
    } else if (!meetsReqIncome) {
      return {
        result: ResultKey.ELIGIBLE,
        reason: ResultReason.INCOME,
        detail: this.translations.detail.alwEligibleIncomeTooHigh,
      }
    } else if (!meetsReqCountry) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.INCOME,
        detail: this.translations.detail.mustBeInCanada,
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
        } else if (underAgeReq) {
          return {
            result: ResultKey.INELIGIBLE,
            reason: ResultReason.AGE_YOUNG,
            detail: this.translations.detail.dependingOnAgreementWhen60,
          }
        } else {
          return {
            result: ResultKey.INELIGIBLE,
            reason: ResultReason.AGE,
            detail: this.translations.detail.alwNotEligible,
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
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.dependingOnLegalWhen60,
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
        result: 0,
        type: EntitlementResultType.UNAVAILABLE,
        autoEnrollment,
      }

    // otherwise, let's do it!

    const formulaResult = this.formulaResult()

    const type =
      formulaResult === -1
        ? EntitlementResultType.UNAVAILABLE
        : EntitlementResultType.FULL

    return { result: formulaResult, type, autoEnrollment }
  }

  /**
   * Just the formula to get the amount
   */
  protected formulaResult(): number {
    const formulaResult = new EntitlementFormula(
      this.input.income.relevant,
      this.input.maritalStatus,
      this.input.partnerBenefitStatus,
      this.input.age
    ).getEntitlementAmount()

    return formulaResult
  }

  /**
   * For this benefit, always return false, because we don't know any better as of now.
   */
  protected getAutoEnrollment(): boolean {
    return false
  }

  protected getCardCollapsedText(): CardCollapsedText[] {
    let cardCollapsedText = super.getCardCollapsedText()

    if (
      this.eligibility.result !== ResultKey.ELIGIBLE &&
      this.eligibility.result !== ResultKey.INCOME_DEPENDENT
    )
      return cardCollapsedText

    // partner is eligible, different message if income was not provided
    if (this.partner) {
      if (this.entitlement.result > 0) {
        if (this.eligibility.result !== ResultKey.INCOME_DEPENDENT) {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerEligible
          )
        } else {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerDependOnYourIncome
          )
        }
      }
    }

    return cardCollapsedText
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT ||
      (this.eligibility.result === ResultKey.INELIGIBLE &&
        this.eligibility.reason === ResultReason.AGE_YOUNG)
    ) {
      console.log(
        'adding link',
        this.eligibility.result,
        this.eligibility.reason
      )
      links.push(this.translations.links.apply[BenefitKey.alw])
    }
    links.push(this.translations.links.overview[BenefitKey.alw])
    return links
  }
}
