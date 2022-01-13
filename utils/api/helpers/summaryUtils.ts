import { Translations } from '../../../i18n/api'
import { EstimationSummaryState, ResultKey } from '../definitions/enums'
import {
  BenefitResult,
  BenefitResultObject,
  SummaryObject,
} from '../definitions/types'

export class SummaryBuilder {
  private results: BenefitResultObject
  private resultsArr: BenefitResult[]
  private readonly state: EstimationSummaryState
  private readonly title: string
  private readonly details: string
  private translations: Translations

  constructor(results: BenefitResultObject, translations: Translations) {
    this.results = results
    this.translations = translations
    this.resultsArr = Object.keys(results).map((key) => results[key])
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
    return this.getResultExistsInAnyBenefit(ResultKey.MORE_INFO)
  }

  detectConditional(): boolean {
    return this.getResultExistsInAnyBenefit(ResultKey.CONDITIONAL)
  }

  detectEligible(): boolean {
    return this.getResultExistsInAnyBenefit(ResultKey.ELIGIBLE)
  }

  getResultExistsInAnyBenefit(result: ResultKey): boolean {
    const matchingItems = this.resultsArr.filter(
      (value) => value.eligibilityResult === result
    )
    return matchingItems.length > 0
  }

  static buildSummaryObject(
    results: BenefitResultObject,
    translations: Translations
  ): SummaryObject {
    const summaryBuilder = new SummaryBuilder(results, translations)
    return summaryBuilder.build()
  }
}
