import { MaritalStatus, PartnerBenefitStatus } from '../definitions/enums'

export class FieldHelper {
  provided: boolean
  constructor(public value: any) {
    this.provided = !(value === undefined)
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
