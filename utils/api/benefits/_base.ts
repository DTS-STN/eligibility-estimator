import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  ResultKey,
  ResultReason,
  EntitlementResultType,
} from '../definitions/enums'
import {
  CardCollapsedText,
  CardDetail,
  EligibilityResult,
  EntitlementResult,
  Link,
  ProcessedInput,
} from '../definitions/types'

export abstract class BaseBenefit<T extends EntitlementResult> {
  private _eligibility: EligibilityResult
  private _entitlement: T
  private _cardDetail: CardDetail
  protected constructor(
    protected input: ProcessedInput,
    protected translations: Translations,
    protected benefitKey: BenefitKey
  ) {}

  get eligibility(): EligibilityResult {
    if (this._eligibility === undefined)
      this._eligibility = this.getEligibility()
    return this._eligibility
  }

  get entitlement(): T {
    if (this._entitlement === undefined)
      this._entitlement = this.getEntitlement()
    return this._entitlement
  }

  get cardDetail(): CardDetail {
    if (this._cardDetail === undefined) this._cardDetail = this.getCardDetail()
    return this._cardDetail
  }

  protected getEligibility(): EligibilityResult {
    return undefined
  }

  protected getEntitlement(): T {
    return undefined
  }

  protected getCardDetail(): CardDetail {
    return {
      mainText: this.getCardText(),
      collapsedText: this.getCardCollapsedText(),
      links: this.getCardLinks(),
    }
  }

  /**
   * Just say auto-enroll is true if eligible, because we don't know any better right now.
   * This is overridden by ALW+AFS.
   */
  protected getAutoEnrollment(): boolean {
    return this.eligibility.result === ResultKey.ELIGIBLE
  }

  /**
   * The main text content that will always be visible within each benefit's card.
   */
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
      this.eligibility.result = ResultKey.INELIGIBLE
      this.eligibility.reason = ResultReason.INCOME
      this.eligibility.detail = this.translations.detail.mustMeetIncomeReq
      this.entitlement.autoEnrollment = this.getAutoEnrollment()
    }

    let text = this.eligibility.detail

    if (
      this.eligibility.result === ResultKey.ELIGIBLE &&
      this.entitlement.result > 0
    ) {
      text += ` ${this.translations.detail.expectToReceive}`
    }

    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT
    ) {
      text += this.getAutoEnrollment()
        ? `<div class="mt-8">${this.translations.detail.autoEnrollTrue}</div>`
        : `<div class="mt-8">${this.translations.detail.autoEnrollFalse}</div>`
    }

    return text
  }

  /**
   * Any items here will be displayed as a collapsed link. Clicking it will expand the text content.
   * Blank by default, should be overridden if needed. Used by OAS.
   */
  protected getCardCollapsedText(): CardCollapsedText[] {
    return []
  }

  /**
   * These are the links visible within each benefit card.
   * For any links specific to one benefit, override that benefit's class.
   */
  protected getCardLinks(): Link[] {
    const links: Link[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT
    )
      links.push(this.translations.links.apply[this.benefitKey])
    if (this.eligibility.result === ResultKey.INELIGIBLE)
      links.push(this.translations.links.reasons[this.benefitKey])
    links.push(this.translations.links.overview[this.benefitKey])
    return links
  }
}
