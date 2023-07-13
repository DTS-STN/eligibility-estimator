import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  EntitlementResultType,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  BenefitResult,
  EligibilityResult,
  EntitlementResultGeneric,
  EntitlementResultOas,
  ProcessedInput,
  CardCollapsedText,
  LinkWithAction,
} from '../definitions/types'
import legalValues from '../scrapers/output'
import { BaseBenefit } from './_base'
import { EntitlementFormula } from './entitlementFormula'

export class GisBenefit extends BaseBenefit<EntitlementResultGeneric> {
  partner: Boolean
  future: Boolean
  constructor(
    input: ProcessedInput,
    translations: Translations,
    private oasResult: BenefitResult<EntitlementResultOas>,
    partner?: Boolean,
    future?: Boolean
  ) {
    super(input, translations, BenefitKey.gis)
    this.partner = partner
    this.future = future
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqAge = this.input.age >= 65
    const meetsReqLiving = this.input.livingCountry.canada
    const meetsReqOas =
      this.oasResult.eligibility.result === ResultKey.ELIGIBLE ||
      this.oasResult.eligibility.result === ResultKey.INCOME_DEPENDENT ||
      this.oasResult.eligibility.result === ResultKey.UNAVAILABLE
    const meetsReqLegal = this.input.legalStatus.canadian
    /*
      This comment may be out of date, and replaced by the comment below (meetsReqIncome).
      Since I'm not certain if it's still relevant, I'll keep it here.

      Please note that the logic below is currently imperfect.
      Specifically, when partnerBenefitStatus == partialOas, we do not know the correct income limit.
    */
    const maxIncome = this.input.maritalStatus.single
      ? legalValues.gis.singleIncomeLimit
      : this.input.partnerBenefitStatus.anyOas
      ? legalValues.gis.spouseOasIncomeLimit
      : this.input.partnerBenefitStatus.alw
      ? legalValues.gis.spouseAlwIncomeLimit
      : legalValues.gis.spouseNoOasIncomeLimit

    // if income is not provided, assume they meet the income requirement
    const skipReqIncome = !this.input.income.provided // refers to partner income

    const meetsReqIncome =
      skipReqIncome ||
      this.input.income.relevant < maxIncome ||
      /*
        This exception is pretty weird, but necessary to work around the fact that a client can be entitled to GIS
        while being above the GIS income limit. This scenario can happen when the client gets Partial OAS, as
        GIS "top-up" will come into effect. Later, in RequestHandler.translateResults(), we will correct for
        this if the client is indeed above the true (undocumented) max income.
      */
      this.oasResult.entitlement.type === EntitlementResultType.PARTIAL

    //
    // Main checks
    //
    if (meetsReqLiving && meetsReqOas && meetsReqLegal) {
      if (meetsReqAge) {
        if (this.oasResult.eligibility.result == ResultKey.UNAVAILABLE) {
          return {
            result: ResultKey.UNAVAILABLE,
            reason: ResultReason.OAS,
            detail: this.translations.detail.conditional,
          }
        } else if (skipReqIncome) {
          if (this.input.income.relevant >= maxIncome) {
            return {
              result: ResultKey.INCOME_DEPENDENT,
              reason: ResultReason.INCOME,
              detail: this.translations.detail.gis.incomeTooHigh,
            }
          } else {
            return {
              result: ResultKey.INCOME_DEPENDENT,
              reason: ResultReason.INCOME_MISSING,
              detail:
                this.translations.detail.gis
                  .eligibleDependingOnIncomeNoEntitlement,
              incomeMustBeLessThan: maxIncome,
            }
          }
        }

        // move get entitlement amount to here, because when income is not provided, it will cause exception
        const amount = this.formulaResult()

        if (this.input.income.client >= maxIncome && amount <= 0) {
          return {
            result: ResultKey.ELIGIBLE,
            reason: ResultReason.INCOME,
            detail: this.future
              ? this.translations.detail.gis.futureEligibleIncomeTooHigh
              : this.translations.detail.gis.incomeTooHigh,
          }
        } else if (this.input.income?.partner >= maxIncome && amount <= 0) {
          return {
            result: ResultKey.ELIGIBLE,
            reason: ResultReason.INCOME,
            detail: this.translations.detail.gis.incomeTooHigh,
          }
        } else if (this.input.income.relevant >= maxIncome && amount <= 0) {
          return {
            result: ResultKey.ELIGIBLE,
            reason: ResultReason.INCOME,
            detail: this.translations.detail.gis.incomeTooHigh,
          }
        } else {
          return {
            result: ResultKey.ELIGIBLE,
            reason: ResultReason.NONE,
            detail: this.future
              ? this.translations.detail.futureEligible65
              : this.translations.detail.eligible,
          }
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.eligibleWhen65,
        }
      }
    } else if (!meetsReqLiving && this.input.livingCountry.provided) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.LIVING_COUNTRY,
        detail: this.translations.detail.mustBeInCanada,
      }
    } else if (this.oasResult.eligibility.result == ResultKey.INELIGIBLE) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.OAS,
        detail: this.translations.detail.mustBeOasEligible,
      }
    } else if (!meetsReqLegal) {
      return {
        result: ResultKey.UNAVAILABLE,
        reason: ResultReason.LEGAL_STATUS,
        detail: this.translations.detail.dependingOnLegal,
      }
    } else if (this.oasResult.eligibility.result == ResultKey.MORE_INFO) {
      return {
        result: ResultKey.MORE_INFO,
        reason: ResultReason.MORE_INFO,
        detail: this.translations.detail.mustCompleteOasCheck,
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
    ) {
      return {
        result: -1,
        type: EntitlementResultType.UNAVAILABLE,
        autoEnrollment,
      }
    }

    // marital status is invSeparated? entitlement unavailable.
    if (this.input.maritalStatus.invSeparated) {
      this.eligibility.detail =
        this.translations.detail.eligibleEntitlementUnavailable
      return {
        result: -1,
        type: EntitlementResultType.UNAVAILABLE,
        autoEnrollment,
      }
    }

    // otherwise, let's do it!
    const formulaResult = this.formulaResult()

    if (formulaResult === -1)
      throw new Error(
        "EntitlementFormula returned -1, this shouldn't happen, if it does uncomment the handling below"
      )

    const type: EntitlementResultType =
      // commenting this out temporarily, if it proves problematic let's bring it back
      // formulaResult === -1
      //   ? EntitlementResultType.UNAVAILABLE
      //   :
      formulaResult > 0
        ? EntitlementResultType.FULL
        : EntitlementResultType.NONE

    // commenting this out temporarily, if it proves problematic let's bring it back
    // /*
    //  The Entitlement Formula may return -1 (unavailable) so even though we do
    //  some unavailable handling above, we have this just in case
    // */
    // if (type === EntitlementResultType.UNAVAILABLE)
    //   this.eligibility.detail =
    //     this.translations.detail.eligibleEntitlementUnavailable

    return { result: formulaResult, type, autoEnrollment }
  }

  /**
   * Just the formula to get the amount
   */
  protected formulaResult(): number {
    return new EntitlementFormula(
      this.input.income.relevant,
      this.input.maritalStatus,
      this.input.partnerBenefitStatus,
      this.input.age,
      this.oasResult
    ).getEntitlementAmount()
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT
    ) {
      !this.future && links.push(this.translations.links.apply[BenefitKey.gis])
    }
    links.push(this.translations.links.overview[BenefitKey.gis])
    return links
  }

  protected getCardText(): string {
    /**
     * The following IF block is a copy from benefitHandler.translateResults,
     *   the issue is that cardDetail object is updated only once if undefined, and could have the wrong information.
     *   overwrite eligibility.detail and autoEnrollment when entitlement.type = none.
     */

    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.entitlement.type === EntitlementResultType.NONE
    ) {
      //this.eligibility.result = ResultKey.INELIGIBLE
      this.eligibility.reason = ResultReason.INCOME
      this.eligibility.detail = this.future
        ? this.translations.detail.gis.futureEligibleIncomeTooHigh
        : this.translations.detail.gis.incomeTooHigh
      this.entitlement.autoEnrollment = this.getAutoEnrollment()
    }

    // another hack, to avoid adding message expectToReceive
    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.eligibility.reason === ResultReason.INCOME &&
      this.entitlement.result > 0
    ) {
      return this.eligibility.detail
    }

    let text = this.eligibility.detail

    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.entitlement.result > 0
    ) {
      text += this.future
        ? ` ${this.translations.detail.futureExpectToReceive}`
        : ` ${this.translations.detail.expectToReceive}`
    }

    return text
  }

  protected getCardCollapsedText(): CardCollapsedText[] {
    let cardCollapsedText = super.getCardCollapsedText()

    if (
      this.eligibility.result !== ResultKey.ELIGIBLE &&
      this.eligibility.result !== ResultKey.INCOME_DEPENDENT
    )
      return cardCollapsedText

    // Related to OAS Deferral, don't show if already receiving
    const ageInOasRange = this.input.age >= 65 && this.input.age < 70

    if (
      this.partner !== true &&
      this.entitlement.result !== 0 &&
      ageInOasRange &&
      !this.input.receiveOAS &&
      !this.future
    ) {
      cardCollapsedText.push(
        this.translations.detailWithHeading.ifYouDeferYourPension
      )
    }

    if (this.partner) {
      if (this.input.income.provided && this.entitlement.result !== 0) {
        if (
          this.input.partnerBenefitStatus.value === PartnerBenefitStatus.NONE
        ) {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerEligibleButAnsweredNo
          )
        } else {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerEligible
          )
        }
      }
    }

    return cardCollapsedText
  }
}
