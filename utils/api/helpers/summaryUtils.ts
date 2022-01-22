import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  EstimationSummaryState,
  MaritalStatus,
  ResultKey,
} from '../definitions/enums'
import { FieldKey } from '../definitions/fields'
import {
  MAX_OAS_INCOME,
  OAS_RECOVERY_TAX_CUTOFF,
} from '../definitions/legalValues'
import {
  BenefitResultsObject,
  Link,
  ProcessedInput,
  SummaryObject,
} from '../definitions/types'

export class SummaryBuilder {
  private readonly state: EstimationSummaryState
  private readonly title: string
  private readonly details: string
  private readonly links: Link[]

  constructor(
    private input: ProcessedInput,
    private results: BenefitResultsObject,
    private missingFields: FieldKey[],
    private translations: Translations
  ) {
    this.state = this.getState()
    this.title = this.getTitle()
    this.details = this.getDetails()
    this.links = this.getLinks()
  }

  build(): SummaryObject {
    return {
      state: this.state,
      title: this.title,
      details: this.details,
      links: this.links,
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

  private getLinks(): Link[] {
    const links = [
      this.translations.links.oasOverview,
      this.translations.links.oasEntitlement,
    ]
    if (this.input.livingCountry.provided && !this.input.livingCountry.canada) {
      links.push(this.translations.links.outsideCanada)
      links.push(this.translations.links.workingOutsideCanada)
    }
    if (this.input.age >= 65) {
      links.push(this.translations.links.oasQualify)
      links.push(this.translations.links.gisQualify)
    }
    if (this.results.oas?.entitlement.type === EntitlementResultType.PARTIAL)
      links.push(this.translations.links.oasPartial)
    if (
      this.input.age > 60 &&
      this.input.age <= 64 &&
      this.input.maritalStatus.partnered
    )
      links.push(this.translations.links.alwQualify)
    if (
      this.input.age > 60 &&
      this.input.age <= 64 &&
      this.input.maritalStatus.value === MaritalStatus.WIDOWED
    )
      links.push(this.translations.links.afsQualify)
    if (this.results.gis?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(this.translations.links.gisEntitlement)
    if (this.results.oas?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(this.translations.links.oasEntitlement2)
    if (this.results.alw?.eligibility.result === ResultKey.ELIGIBLE) {
      links.push(this.translations.links.alwGisEntitlement)
      links.push(this.translations.links.alwInfo)
    }
    if (this.results.afs?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(this.translations.links.afsEntitlement)
    if (
      this.input.income.relevant > OAS_RECOVERY_TAX_CUTOFF &&
      this.input.income.relevant < MAX_OAS_INCOME
    )
      links.push(this.translations.links.oasRecoveryTax)
    if (this.results.oas?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(this.translations.links.oasDefer)
    return links
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
      (key) => this.results[key].eligibility.result === expectedResult
    )
    return matchingItems.length > 0
  }

  static buildSummaryObject(
    input: ProcessedInput,
    results: BenefitResultsObject,
    missingFields: FieldKey[],
    translations: Translations
  ): SummaryObject {
    const summaryBuilder = new SummaryBuilder(
      input,
      results,
      missingFields,
      translations
    )
    return summaryBuilder.build()
  }
}
