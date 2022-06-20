import { Translations } from '../../i18n/api'
import {
  EntitlementResultType,
  EstimationSummaryState,
  MaritalStatus,
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
import { legalValues } from './scrapers/output'

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
    /*
     This object is useless and a waste of lines, but it makes it easier to identify which links
     are missing conditions in the logic below, by putting your cursor on the key,
     looking for the highlight in the conditions from your IDE, and continuing down.
    */
    const availableLinks = {
      contactSC: this.translations.links.contactSC,
      faq: this.translations.links.faq,
      oasOverview: this.translations.links.oasOverview,
      gisOverview: this.translations.links.gisOverview,
      alwOverview: this.translations.links.alwOverview,
      afsOverview: this.translations.links.afsOverview,
      oasMaxIncome: this.translations.links.oasMaxIncome,
      cpp: this.translations.links.cpp,
      cric: this.translations.links.cric,
      paymentOverview: this.translations.links.paymentOverview,
      gisEntitlement: this.translations.links.gisEntitlement,
      alwEntitlement: this.translations.links.alwEntitlement,
      afsEntitlement: this.translations.links.afsEntitlement,
      outsideCanada: this.translations.links.outsideCanada,
      outsideCanadaOas: this.translations.links.outsideCanadaOas,
      oasPartial: this.translations.links.oasPartial,
      oasRecoveryTax: this.translations.links.oasRecoveryTax,
      oasDefer: this.translations.links.oasDefer,
      oasRetroactive: this.translations.links.oasRetroactive,
      oasApply: this.translations.links.oasApply,
      gisApply: this.translations.links.gisApply,
      alwApply: this.translations.links.alwApply,
      afsApply: this.translations.links.afsApply,
      SC: this.translations.links.SC,
      oasDeferClickHere: this.translations.links.oasDeferClickHere,
      socialAgreement: this.translations.links.socialAgreement,
      oasReasons: this.translations.links.oasReasons,
      gisReasons: this.translations.links.gisReasons,
      alwReasons: this.translations.links.alwReasons,
      afsReasons: this.translations.links.afsReasons,
    }

    // static links
    const links = [
      availableLinks.contactSC,
      availableLinks.faq,
      availableLinks.oasOverview,
      availableLinks.gisOverview,
      availableLinks.cpp,
      availableLinks.cric,
    ]

    // benefit overview links
    if (
      this.input.client.maritalStatus.partnered &&
      (this.input.client.age < 65 || this.input.partner.age < 65)
    )
      links.push(availableLinks.alwOverview)
    if (
      this.input.client.maritalStatus.value === MaritalStatus.WIDOWED &&
      this.input.client.age < 65
    )
      links.push(availableLinks.afsOverview)

    // payment overview links
    if (this.state === EstimationSummaryState.AVAILABLE_ELIGIBLE)
      links.push(availableLinks.paymentOverview)
    if (this.results.gis?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.gisEntitlement)
    if (this.results.alw?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.alwEntitlement)
    if (this.results.afs?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.afsEntitlement)

    // special situation links
    if (
      this.input.client.income.provided &&
      this.input.client.income.relevant >= legalValues.MAX_OAS_INCOME
    )
      links.push(availableLinks.oasMaxIncome)
    if (
      this.input.client.livingCountry.provided &&
      !this.input.client.livingCountry.canada
    )
      links.push(availableLinks.outsideCanada, availableLinks.outsideCanadaOas)
    if (this.results.oas?.entitlement.type === EntitlementResultType.PARTIAL)
      links.push(availableLinks.oasPartial)
    if (
      this.input.client.income.provided &&
      this.input.client.income.relevant > legalValues.OAS_RECOVERY_TAX_CUTOFF &&
      this.input.client.income.relevant < legalValues.MAX_OAS_INCOME
    )
      links.push(availableLinks.oasRecoveryTax)
    if (
      this.results.oas?.eligibility.result === ResultKey.ELIGIBLE &&
      this.input.client.age < 70
    )
      links.push(availableLinks.oasDefer)
    if (this.input.client.age >= 65) links.push(availableLinks.oasRetroactive)

    // apply links
    if (this.results.oas?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.oasApply)
    if (this.results.gis?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.gisApply)
    if (this.results.alw?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.alwApply)
    if (this.results.afs?.eligibility.result === ResultKey.ELIGIBLE)
      links.push(availableLinks.afsApply)

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
