import {
  EntitlementResultType,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
} from '../definitions/enums'
import { EligibilityResult, EntitlementResult } from '../definitions/types'
import { AGREEMENT_COUNTRIES } from './countryUtils'

export class FieldHelper {
  provided: boolean
  constructor(public value: any) {
    this.provided = !(value === undefined)
  }
}

export class IncomeHelper extends FieldHelper {
  constructor(
    public clientAvailable: boolean,
    public partnerAvailable: boolean,
    public client: number,
    public clientIncomeWork: number,
    public partner: number,
    public partnerIncomeWork: number,
    public maritalStatus: MaritalStatusHelper
  ) {
    super(undefined) // send undefined, as we should never use this `value` property
    this.provided =
      client !== undefined &&
      (maritalStatus.single ||
        (maritalStatus.partnered && partner !== undefined))
  }

  /**
   * Calculate the income after applying deductions.
   * Deduct the first $5,000 entirely, then 50% of the next $10,000.
   */
  calculateDeductedIncome(income: number, incomeWork: number): number {
    if (incomeWork <= 5000) {
      return income - incomeWork
    } else if (incomeWork <= 15000) {
      return income - (5000 + (incomeWork - 5000) * 0.5)
    } else {
      return income - 10000 // Maximum deduction is $10,000
    }
  }

  get adjustedIncome(): number {
    return this.calculateDeductedIncome(this.client, this.clientIncomeWork)
  }

  /**
   * Returns the relevant income, depending on marital status.
   * Returns the client's income when single, or the sum of client+partner when partnered.
   */
  get relevant(): number {
    if (
      this.maritalStatus.provided &&
      this.maritalStatus.partnered &&
      this.partner !== undefined
    ) {
      return this.sum
    }
    return this.client
  }

  private get sum(): number {
    const a = this.client ?? 0
    const b = this.partner ?? 0
    return a + b
  }

  /**
   * Returns the relevant income after salary exemption, depending on marital status.
   * Uses the calculated income considering deductions from work income.
   */
  get adjustedRelevant(): number {
    let clientAdjustedIncome = this.adjustedIncome
    if (
      this.maritalStatus.provided &&
      this.maritalStatus.partnered &&
      this.partner !== undefined
    ) {
      let partnerAdjustedIncome = this.adjustedIncome
      return clientAdjustedIncome + partnerAdjustedIncome
    }
    return clientAdjustedIncome
  }
}

export class LivingCountryHelper extends FieldHelper {
  normalized: LivingCountry
  canada: boolean
  agreement: boolean
  noAgreement: boolean

  constructor(public value: string) {
    super(value)
    this.normalized = LivingCountryHelper.normalizeLivingCountry(value)
    this.canada = this.normalized == LivingCountry.CANADA
    this.agreement = this.normalized == LivingCountry.AGREEMENT
    this.noAgreement = this.normalized == LivingCountry.NO_AGREEMENT
  }

  /**
   * Normalizes a country to the LivingCountry enum, which is either Canada, Agreement, or No Agreement.
   * @param country Country code as a string
   */
  static normalizeLivingCountry(country: string): LivingCountry {
    if (country === undefined) return undefined
    if (country === LivingCountry.CANADA) return LivingCountry.CANADA
    return AGREEMENT_COUNTRIES.includes(country)
      ? LivingCountry.AGREEMENT
      : LivingCountry.NO_AGREEMENT
  }
}

export class LegalStatusHelper extends FieldHelper {
  canadian: boolean
  other: boolean

  constructor(public value: LegalStatus) {
    super(value)
    this.canadian = value === LegalStatus.YES
    this.other = value === LegalStatus.NO
  }
}

export class MaritalStatusHelper extends FieldHelper {
  partnered: boolean
  single: boolean
  invSeparated: boolean

  constructor(public value: MaritalStatus) {
    super(value)
    this.partnered = value === MaritalStatus.PARTNERED
    this.single =
      value === MaritalStatus.SINGLE || value === MaritalStatus.WIDOWED
    //value === MaritalStatus.INV_SEPARATED // invSeparated doesn't necessarily mean single - be careful with this
    this.invSeparated = value === MaritalStatus.INV_SEPARATED
  }
}

export class PartnerBenefitStatusHelper extends FieldHelper {
  helpMe: boolean
  none: boolean
  oasEligibility: EntitlementResultType
  gisEligibility: EntitlementResultType
  alwEligibility: EntitlementResultType

  constructor(public value: PartnerBenefitStatus) {
    super(value)
    this.helpMe = this.value === PartnerBenefitStatus.HELP_ME
    this.none = this.value === PartnerBenefitStatus.NONE
    this.oasEligibility = EntitlementResultType.NONE
    this.gisEligibility = EntitlementResultType.NONE
    this.alwEligibility = EntitlementResultType.NONE
    switch (this.value) {
      case PartnerBenefitStatus.OAS:
        this.oasEligibility = EntitlementResultType.PARTIAL_OR_FULL
        break
      case PartnerBenefitStatus.ALW:
        this.alwEligibility = EntitlementResultType.FULL
        break
      case PartnerBenefitStatus.OAS_GIS:
        this.oasEligibility = EntitlementResultType.PARTIAL_OR_FULL
        this.gisEligibility = EntitlementResultType.FULL
        break
      case PartnerBenefitStatus.HELP_ME:
        break
      case PartnerBenefitStatus.NONE:
        this.alwEligibility = EntitlementResultType.NONE
        this.oasEligibility = EntitlementResultType.NONE
        this.gisEligibility = EntitlementResultType.NONE
        break
    }
  }

  get fullOas(): boolean {
    return (
      this.oasEligibility === EntitlementResultType.FULL ||
      this.oasEligibility === EntitlementResultType.PARTIAL_OR_FULL
    )
  }
  get partialOas(): boolean {
    return (
      this.oasEligibility === EntitlementResultType.PARTIAL ||
      this.oasEligibility === EntitlementResultType.PARTIAL_OR_FULL
    )
  }
  get anyOas(): boolean {
    return this.fullOas || this.partialOas
  }
  get gis(): boolean {
    return this.gisEligibility === EntitlementResultType.FULL
  }
  get alw(): boolean {
    return this.alwEligibility === EntitlementResultType.FULL
  }

  // when we calculate results for the partner, the below functions will be used to store the results

  set oasResultEntitlement(value: EntitlementResult) {
    this.oasEligibility = value.type
  }
  set gisResultEligibility(value: EligibilityResult) {
    this.gisEligibility =
      value.result === ResultKey.ELIGIBLE
        ? EntitlementResultType.FULL
        : EntitlementResultType.NONE
  }
  set alwResultEligibility(value: EligibilityResult) {
    this.alwEligibility =
      value.result === ResultKey.ELIGIBLE
        ? EntitlementResultType.FULL
        : EntitlementResultType.NONE
  }
}
