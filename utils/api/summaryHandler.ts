import { Translations } from '../../i18n/api'
import {
  EntitlementResultType,
  ResultKey,
  SummaryState,
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
  private readonly state: SummaryState
  private readonly partnerState: SummaryState
  private readonly title: string
  private readonly details: string
  private readonly links: Link[]
  private readonly entitlementSum: number
  private readonly partnerEntitlementSum: number

  constructor(
    private input: ProcessedInputWithPartner,
    private results: BenefitResultsObject,
    private partnerResults: BenefitResultsObject,
    private missingFields: FieldKey[],
    private translations: Translations
  ) {
    this.state = this.getState()
    this.partnerState = this.getState('partner')
    this.title = this.getTitle()
    this.details = this.getDetails()
    this.links = this.getLinks()
    this.entitlementSum = this.getEntitlementSum()
    this.partnerEntitlementSum = this.getEntitlementSum('partner')
  }

  build(): SummaryObject {
    return {
      state: this.state,
      partnerState: this.partnerState,
      title: this.title,
      details: this.details,
      links: this.links,
      entitlementSum: this.entitlementSum,
      partnerEntitlementSum: this.partnerEntitlementSum,
    }
  }

  private getState(stateFor = 'client'): SummaryState {
    if (this.detectNeedsInfo()) {
      return SummaryState.MORE_INFO
    } else if (this.detectUnavailable(stateFor)) {
      return SummaryState.UNAVAILABLE
    } else if (this.detectDepending(stateFor)) {
      return SummaryState.AVAILABLE_DEPENDING
    } else if (this.detectEligible(stateFor)) {
      return SummaryState.AVAILABLE_ELIGIBLE
    }
    return SummaryState.AVAILABLE_INELIGIBLE
  }

  private getTitle() {
    if (this.state === SummaryState.MORE_INFO)
      return this.translations.summaryTitle[SummaryState.MORE_INFO]
    else if (this.state === SummaryState.UNAVAILABLE)
      return this.translations.summaryTitle[SummaryState.UNAVAILABLE]
    else if (this.state === SummaryState.AVAILABLE_ELIGIBLE)
      return this.translations.summaryTitle[SummaryState.AVAILABLE_ELIGIBLE]
    else if (this.state === SummaryState.AVAILABLE_INELIGIBLE)
      return this.translations.summaryTitle[SummaryState.AVAILABLE_INELIGIBLE]
    else if (this.state === SummaryState.AVAILABLE_DEPENDING)
      return this.translations.summaryTitle[SummaryState.AVAILABLE_DEPENDING]
  }

  private getDetails() {
    if (this.state === SummaryState.MORE_INFO)
      return this.translations.summaryDetails[SummaryState.MORE_INFO]
    else if (this.state === SummaryState.UNAVAILABLE)
      return this.translations.summaryDetails[SummaryState.UNAVAILABLE]
    else if (this.state === SummaryState.AVAILABLE_ELIGIBLE)
      return this.translations.summaryDetails[SummaryState.AVAILABLE_ELIGIBLE]
    else if (this.state === SummaryState.AVAILABLE_INELIGIBLE)
      return this.translations.summaryDetails[SummaryState.AVAILABLE_INELIGIBLE]
    else if (this.state === SummaryState.AVAILABLE_DEPENDING)
      return this.translations.summaryDetails[SummaryState.AVAILABLE_DEPENDING]
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
    if (this.state === SummaryState.AVAILABLE_ELIGIBLE)
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

  detectUnavailable(stateFor): boolean {
    return this.getResultExistsInAnyBenefit(ResultKey.UNAVAILABLE, stateFor)
  }

  detectEligible(stateFor): boolean {
    return this.getResultExistsInAnyBenefit(ResultKey.ELIGIBLE, stateFor)
  }

  detectDepending(stateFor): boolean {
    return this.getResultExistsInAnyBenefit(
      ResultKey.INCOME_DEPENDENT,
      stateFor
    )
  }

  getResultExistsInAnyBenefit(
    expectedResult: ResultKey,
    stateFor: string
  ): boolean {
    const results = stateFor === 'client' ? this.results : this.partnerResults
    const matchingItems = Object.keys(results).filter((key) => {
      results[key].eligibility.result === expectedResult
    })
    return matchingItems.length > 0
  }

  getEntitlementSum(sumFor = 'client'): number {
    const results = sumFor === 'client' ? this.results : this.partnerResults
    let sum = 0
    for (const resultsKey in results) {
      let result: BenefitResult = results[resultsKey]
      if (
        result.entitlement.type != EntitlementResultType.UNAVAILABLE &&
        result.entitlement.type != EntitlementResultType.NONE
      )
        sum += result.entitlement.result
    }
    return sum
  }

  static buildSummaryObject(
    input: ProcessedInputWithPartner,
    results: BenefitResultsObject,
    partnerResults: BenefitResultsObject,
    missingFields: FieldKey[],
    translations: Translations
  ): SummaryObject {
    const summaryBuilder = new SummaryHandler(
      input,
      results,
      partnerResults,
      missingFields,
      translations
    )
    const builtObj = summaryBuilder.build()
    return builtObj
  }
}
