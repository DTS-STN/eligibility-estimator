import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../definitions/enums'
import { AGREEMENT_COUNTRIES } from './countryUtils'

export class FieldHelper {
  provided: boolean
  constructor(public value: any) {
    this.provided = !(value === undefined)
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
  sponsored: boolean
  other: boolean

  constructor(public value: LegalStatus) {
    super(value)
    this.canadian =
      value === LegalStatus.CANADIAN_CITIZEN ||
      value === LegalStatus.PERMANENT_RESIDENT ||
      value === LegalStatus.INDIAN_STATUS
    this.sponsored = value === LegalStatus.SPONSORED
    this.other = value === LegalStatus.OTHER
  }
}

export class MaritalStatusHelper extends FieldHelper {
  partnered: boolean
  single: boolean

  constructor(public value: MaritalStatus) {
    super(value)
    this.partnered =
      value === MaritalStatus.MARRIED || value === MaritalStatus.COMMON_LAW
    this.single =
      value === MaritalStatus.SINGLE ||
      value === MaritalStatus.WIDOWED ||
      value === MaritalStatus.DIVORCED ||
      value === MaritalStatus.SEPARATED
  }
}

export class PartnerBenefitStatusHelper extends FieldHelper {
  anyOas: boolean
  fullOas: boolean
  partialOas: boolean
  allowance: boolean
  gis: boolean

  constructor(public value: PartnerBenefitStatus) {
    super(value)
    this.fullOas =
      value == PartnerBenefitStatus.FULL_OAS ||
      value == PartnerBenefitStatus.FULL_OAS_GIS
    this.partialOas =
      value == PartnerBenefitStatus.PARTIAL_OAS ||
      value == PartnerBenefitStatus.PARTIAL_OAS_GIS
    this.anyOas = this.fullOas || this.partialOas
    this.gis =
      value == PartnerBenefitStatus.FULL_OAS_GIS ||
      value == PartnerBenefitStatus.PARTIAL_OAS_GIS
    this.allowance = value == PartnerBenefitStatus.ALLOWANCE
  }
}
