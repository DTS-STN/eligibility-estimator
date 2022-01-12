import { Translations } from '../../../i18n/api'
import { EstimationSummaryState, ResultKey } from '../definitions/enums'
import { FieldKey } from '../definitions/fields'
import { BenefitResultObject, SummaryObject } from '../definitions/types'

export class SummaryBuilder {
  private readonly state: EstimationSummaryState
  private readonly title: string
  private readonly details: string

  constructor(
    private results: BenefitResultObject,
    private missingFields: FieldKey[],
    private translations: Translations
  ) {
    this.state = this.getState()
    this.title = this.getTitle()
    this.details = this.getDetails()
  }

  build(): SummaryObject {
    return {
      state: this.state,
      title: this.title,
      details: this.details,
      links: [{ url: 'https://canada.ca', text: 'Canada.ca', order: 1 }],
    }
  }

  private getState(): EstimationSummaryState {
    if (this.detectNeedsInfo()) {
      return EstimationSummaryState.MORE_INFO
    } else if (this.detectConditional()) {
      return EstimationSummaryState.UNAVAILABLE
    } else if (this.detectEligible()) {
      return EstimationSummaryState.AVAILABLE_ELIGIBLE
    }
    return EstimationSummaryState.AVAILABLE_INELIGIBLE
  }

  private getTitle() {
    if (this.state === EstimationSummaryState.MORE_INFO)
      return this.translations.summaryTitle.moreInfo
    else if (this.state === EstimationSummaryState.UNAVAILABLE)
      return this.translations.summaryTitle.unavailable
    else if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      return this.translations.summaryTitle.availableEligible
    else if (this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE)
      return this.translations.summaryTitle.availableIneligible
  }

  private getDetails() {
    if (this.state === EstimationSummaryState.MORE_INFO)
      return this.translations.summaryDetails.moreInfo
    else if (this.state === EstimationSummaryState.UNAVAILABLE)
      return this.translations.summaryDetails.unavailable
    else if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      return this.translations.summaryDetails.availableEligible
    else if (this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE)
      return this.translations.summaryDetails.availableIneligible
  }

  detectNeedsInfo(): boolean {
    return this.missingFields.length > 0
  }

  detectConditional(): boolean {
    return this.getResultExistsInAnyBenefit(ResultKey.CONDITIONAL)
  }

  detectEligible(): boolean {
    return this.getResultExistsInAnyBenefit(ResultKey.ELIGIBLE)
  }

  getResultExistsInAnyBenefit(expectedResult: ResultKey): boolean {
    const matchingItems = Object.keys(this.results).filter(
      (key) => this.results[key].eligibilityResult === expectedResult
    )
    return matchingItems.length > 0
  }

  static buildSummaryObject(
    results: BenefitResultObject,
    missingFields: FieldKey[],
    translations: Translations
  ): SummaryObject {
    const summaryBuilder = new SummaryBuilder(
      results,
      missingFields,
      translations
    )
    return summaryBuilder.build()
  }
}
