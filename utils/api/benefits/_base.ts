import { Translations } from '../../../i18n/api'
import {
  EligibilityResult,
  EntitlementResult,
  ProcessedInput,
} from '../definitions/types'

export abstract class BaseBenefit {
  private _eligibility: EligibilityResult
  private _entitlement: EntitlementResult
  protected readonly income: number
  protected constructor(
    protected input: ProcessedInput,
    protected translations: Translations
  ) {
    this.income = input.income.relevant
  }

  get eligibility(): EligibilityResult {
    if (this._eligibility === undefined)
      this._eligibility = this.getEligibility()
    return this._eligibility
  }

  get entitlement(): EntitlementResult {
    if (this._entitlement === undefined)
      this._entitlement = this.getEntitlement()
    return this._entitlement
  }

  protected getEligibility(): EligibilityResult {
    return undefined
  }

  protected getEntitlement(): EntitlementResult {
    return undefined
  }

  protected roundToTwo(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}
