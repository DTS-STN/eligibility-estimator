import { Translations } from '../../i18n/api'
import {
  EntitlementResultType,
  EstimationSummaryState,
  ResultKey,
} from './definitions/enums'
import { FieldKey } from './definitions/fields'
import {
  BenefitResult,
  BenefitResultsObject,
  Link,
  ProcessedInputWithPartner,
  SummaryObject,
} from './definitions/types'
import legalValues from './scrapers/output'

export class SummaryHandler {
  private readonly state: EstimationSummaryState
  private readonly title: string
  private readonly details: string
  private readonly links: Link[]
  private readonly entitlementSum: number

  constructor(
    private input: ProcessedInputWithPartner,
    private results: BenefitResultsObject,
    private missingFields: FieldKey[],
    private translations: Translations
  ) {
    this.state = this.getState()
    this.title = this.getTitle()
    this.details = this.getDetails()
    this.links = this.getLinks()
    this.entitlementSum = this.getEntitlementSum()
  }

  build(): SummaryObject {
    return {
      state: this.state,
      title: this.title,
      details: this.details,
      links: this.links,
      entitlementSum: this.entitlementSum,
    }
  }

  private getState(): EstimationSummaryState {
    if (this.detectNeedsInfo()) {
      return EstimationSummaryState.MORE_INFO
    } else if (this.detectUnavailable()) {
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
    // static links
    const links = [
      this.translations.links.contactSC,
      this.translations.links.faq,
      this.translations.links.cpp,
      this.translations.links.cric,
    ]

    // payment overview links
    if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      links.push(this.translations.links.paymentOverview)
    if (this.results.gis?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(this.translations.links.gisEntitlement)
    if (this.results.alw?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(this.translations.links.alwEntitlement)
    if (this.results.afs?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(this.translations.links.afsEntitlement)

    // special situation links
    if (
      this.input.client.income.provided &&
      this.input.client.income.relevant >= legalValues.oas.incomeLimit
    )
      links.push(this.translations.links.oasMaxIncome)
    if (
      this.input.client.livingCountry.provided &&
      !this.input.client.livingCountry.canada
    )
      links.push(
        this.translations.links.outsideCanada,
        this.translations.links.outsideCanadaOas
      )
    if (this.results.oas?.entitlement.type === EntitlementResultType.PARTIAL)
      links.push(this.translations.links.oasPartial)
    if (
      this.input.client.income.provided &&
      this.input.client.income.relevant > legalValues.oas.clawbackIncomeLimit &&
      this.input.client.income.relevant < legalValues.oas.incomeLimit
    )
      links.push(this.translations.links.oasRecoveryTax)
    if (
      this.results.oas?.eligibility.result === ResultKey.ELIGIBLE &&
      this.input.client.age < 70
    )
      links.push(this.translations.links.oasDefer)
    if (this.input.client.age >= 65)
      links.push(this.translations.links.oasRetroactive)

    // apply links
    for (const benefitKey in this.results) {
      const resultKey: ResultKey = this.results[benefitKey]?.eligibility.result
      if (
        resultKey === ResultKey.ELIGIBLE ||
        resultKey === ResultKey.INCOME_DEPENDENT
      )
        links.push(this.translations.links.apply[benefitKey])
    }

    links.sort((a, b) => a.order - b.order)
    return links
  }

  detectNeedsInfo(): boolean {
    return this.missingFields.length > 0
  }

  detectUnavailable(): boolean {
    return this.getResultExistsInAnyBenefit(ResultKey.UNAVAILABLE)
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

  getEntitlementSum(): number {
    let sum = 0
    for (const resultsKey in this.results) {
      let result: BenefitResult = this.results[resultsKey]
      if (result.entitlement.type != EntitlementResultType.UNAVAILABLE)
        sum += result.entitlement.result
    }
    return sum
  }

  static buildSummaryObject(
    input: ProcessedInputWithPartner,
    results: BenefitResultsObject,
    missingFields: FieldKey[],
    translations: Translations
  ): SummaryObject {
    const summaryBuilder = new SummaryHandler(
      input,
      results,
      missingFields,
      translations
    )
    return summaryBuilder.build()
  }
}
