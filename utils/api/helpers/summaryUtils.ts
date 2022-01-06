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
      return 'More information needed'
    else if (this.state === EstimationSummaryState.UNAVAILABLE)
      return 'Unable to provide an estimation'
    else if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      return 'Likely eligible for benefits!'
    else if (this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE)
      return 'Likely not eligible for benefits'
  }

  private getDetails() {
    if (this.state === EstimationSummaryState.MORE_INFO)
      return 'You need to answer the remaining questions on the previous tab before an estimation can be provided.'
    else if (this.state === EstimationSummaryState.UNAVAILABLE)
      return "Given the answers you've provided, this tool is unable to provide an accurate estimation. You are recommended to contact Service Canada for more information."
    else if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      return "Given the answers you've provided, you are likely eligible for benefits! See the details below for more information."
    else if (this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE)
      return "Given the answers you've provided, you are likely not eligible for any benefits. See the details below for more information."
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
