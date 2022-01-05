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

  constructor(results: BenefitResultObject) {
    this.results = results
    this.resultsArr = Object.keys(results).map((key) => results[key])
    this.state = this.getState()
    this.title = this.getTitle()
    this.details = this.getDetails()
  }

  build(): SummaryObject {
    const summary: SummaryObject = {
      state: this.state,
      title: this.title,
      details: this.details,
      links: [{ url: 'test', text: 'test', order: 0 }],
    }
    return summary
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
      return 'More info title'
    else if (this.state === EstimationSummaryState.UNAVAILABLE)
      return 'Unavailable title'
    else if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      return 'Eligible title'
    else if (this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE)
      return 'Ineligible title'
  }

  private getDetails() {
    if (this.state === EstimationSummaryState.MORE_INFO)
      return 'More info details... stuff, things, text.'
    else if (this.state === EstimationSummaryState.UNAVAILABLE)
      return 'Unavailable details... stuff, things, text.'
    else if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      return 'Eligible details... stuff, things, text.'
    else if (this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE)
      return 'Ineligible details... stuff, things, text.'
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

  static buildSummaryObject(results: BenefitResultObject): SummaryObject {
    const summaryBuilder = new SummaryBuilder(results)
    return summaryBuilder.build()
  }
}
