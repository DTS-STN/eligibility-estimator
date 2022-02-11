import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  EstimationSummaryState,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { FieldKey } from '../definitions/fields'
import {
  BenefitResult,
  BenefitResultsObject,
  Link,
  ProcessedInput,
  SummaryObject,
} from '../definitions/types'
import { legalValues } from '../scrapers/output'

export class SummaryBuilder {
  private readonly state: EstimationSummaryState
  private readonly title: string
  private readonly details: string
  private readonly links: Link[]
  private readonly entitlementSum: number

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
    else if (
      this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE &&
      this.results.oas.eligibility.reason === ResultReason.INCOME
    )
      return this.translations.summaryDetails.availableIneligibleIncome
    else if (this.state === EstimationSummaryState.AVAILABLE_INELIGIBLE)
      return this.translations.summaryDetails.availableIneligible
  }

  private getLinks(): Link[] {
    /*
     This object is useless and a waste of lines, but it makes it easier to identify which links
     are missing conditions in the logic below, by putting your cursor on the key,
     looking for the highlight in the conditions from your IDE, and continuing down.
    */
    const availableLinks = {
      contactSC: this.translations.links.contactSC,
      oasOverview: this.translations.links.oasOverview,
      cpp: this.translations.links.cpp,
      cric: this.translations.links.cric,
      oasApply: this.translations.links.oasApply,
      alwApply: this.translations.links.alwApply,
      afsApply: this.translations.links.afsApply,
      oasMaxIncome: this.translations.links.oasMaxIncome,
      outsideCanada: this.translations.links.outsideCanada,
      oasPartial: this.translations.links.oasPartial,
      workingOutsideCanada: this.translations.links.workingOutsideCanada,
      oasEntitlement: this.translations.links.oasEntitlement,
      oasEntitlement2: this.translations.links.oasEntitlement2,
      gisEntitlement: this.translations.links.gisEntitlement,
      alwGisEntitlement: this.translations.links.alwGisEntitlement,
      alwInfo: this.translations.links.alwInfo,
      afsEntitlement: this.translations.links.afsEntitlement,
      oasRecoveryTax: this.translations.links.oasRecoveryTax,
      oasDefer: this.translations.links.oasDefer,
      oasRetroactive: this.translations.links.oasRetroactive,
    }
    const links = [
      availableLinks.contactSC,
      availableLinks.oasOverview,
      availableLinks.cpp,
      availableLinks.cric,
    ]
    if (this.results.oas?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(
        availableLinks.oasApply,
        availableLinks.oasEntitlement,
        availableLinks.oasEntitlement2,
        availableLinks.oasDefer
      )
    if (this.results.gis?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.gisEntitlement)
    if (this.results.alw?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(
        availableLinks.alwApply,
        availableLinks.alwGisEntitlement,
        availableLinks.alwInfo
      )
    if (this.results.afs?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.afsApply, availableLinks.afsEntitlement)
    if (this.input.income.relevant >= legalValues.MAX_OAS_INCOME)
      links.push(availableLinks.oasMaxIncome)
    if (this.input.livingCountry.provided && !this.input.livingCountry.canada)
      links.push(
        availableLinks.outsideCanada,
        availableLinks.workingOutsideCanada
      )
    if (this.results.oas?.entitlement.type === EntitlementResultType.PARTIAL)
      links.push(availableLinks.oasPartial)
    if (
      this.input.income.relevant > legalValues.OAS_RECOVERY_TAX_CUTOFF &&
      this.input.income.relevant < legalValues.MAX_OAS_INCOME
    )
      links.push(availableLinks.oasRecoveryTax)
    if (this.input.age >= 65) links.push(availableLinks.oasRetroactive)
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
