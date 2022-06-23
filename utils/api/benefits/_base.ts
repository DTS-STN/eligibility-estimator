import { Translations } from '../../../i18n/api'
import { BenefitKey, ResultKey } from '../definitions/enums'
import {
  CardDetail,
  CollapsedText,
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
      mainText: this.eligibility.detail,
      collapsedText: this.getCollapsedText(),
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

  protected getCardLinks(): Link[] {
    const links: Link[] = []
    if (this.eligibility.result === ResultKey.INELIGIBLE)
      links.push(this.translations.links.reasons[this.benefitKey])
    else links.push(this.translations.links.SC) // just an example for now
    return links
  }

  protected getCollapsedText(): CollapsedText[] {
    const texts: CollapsedText[] = []
    texts.push({ text: 'example', heading: 'example heading' })
    return texts
  }
}
