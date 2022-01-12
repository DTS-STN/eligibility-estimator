export enum FieldCategory {
  INCOME_DETAILS = 'incomeDetails',
  PERSONAL_INFORMATION = 'personalInformation',
  PARTNER_DETAILS = 'partnerDetails',
  LEGAL_STATUS = 'legalStatus',
  SOCIAL_AGREEMENT = 'socialAgreement',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  COMMON_LAW = 'commonLaw',
  WIDOWED = 'widowed',
  DIVORCED = 'divorced',
  SEPARATED = 'separated',
}

export class MaritalStatusHelper {
  partnered: boolean
  single: boolean
  constructor(maritalStatus: MaritalStatus) {
    this.partnered =
      maritalStatus === MaritalStatus.MARRIED ||
      maritalStatus === MaritalStatus.COMMON_LAW
    this.single =
      maritalStatus === MaritalStatus.SINGLE ||
      maritalStatus === MaritalStatus.WIDOWED ||
      maritalStatus === MaritalStatus.DIVORCED ||
      maritalStatus === MaritalStatus.SEPARATED
  }
}

export enum LegalStatus {
  CANADIAN_CITIZEN = 'canadianCitizen',
  PERMANENT_RESIDENT = 'permanentResident',
  SPONSORED = 'sponsored',
  INDIAN_STATUS = 'indianStatus',
  OTHER = 'other',
}

export enum PartnerBenefitStatus {
  FULL_OAS = 'fullOas',
  FULL_OAS_GIS = 'fullOasGis',
  PARTIAL_OAS = 'partialOas',
  PARTIAL_OAS_GIS = 'partialOasGis',
  ALLOWANCE = 'allowance',
  NONE = 'none',
  HELP_ME = 'helpMe',
}

export class PartnerBenefitStatusHelper {
  anyOas: boolean
  fullOas: boolean
  partialOas: boolean
  allowance: boolean
  constructor(partnerBenefitStatus: PartnerBenefitStatus) {
    this.fullOas =
      partnerBenefitStatus == PartnerBenefitStatus.FULL_OAS ||
      partnerBenefitStatus == PartnerBenefitStatus.FULL_OAS_GIS
    this.partialOas =
      partnerBenefitStatus == PartnerBenefitStatus.PARTIAL_OAS ||
      partnerBenefitStatus == PartnerBenefitStatus.PARTIAL_OAS_GIS
    this.anyOas = this.fullOas || this.partialOas
    this.allowance = partnerBenefitStatus == PartnerBenefitStatus.ALLOWANCE
  }
}

export enum LivingCountry {
  CANADA = 'CAN',
  AGREEMENT = 'AGREEMENT',
  NO_AGREEMENT = 'NO_AGREEMENT',
}

// not displayed in the UI
export enum ResultKey {
  ELIGIBLE = `eligible`,
  INELIGIBLE = `ineligible`,
  CONDITIONAL = `unavailable`,
  MORE_INFO = 'moreInfo',
  INVALID = 'invalid',
}

// not displayed in the UI
export enum ResultReason {
  NONE = `You meet the criteria`,
  AGE = `Age does not meet requirement for this benefit`,
  YEARS_IN_CANADA = `Not enough years in Canada`,
  LIVING_COUNTRY = `Not living in Canada`,
  LEGAL_STATUS = `Legal status does not meet requirement for this benefit`,
  SOCIAL_AGREEMENT = 'Not in a country with a social agreement',
  MORE_INFO = 'Need more information...',
  OAS = 'Not eligible for OAS',
  INCOME = 'Income too high',
  MARITAL = 'Your marital status does not meet the requirement for this benefit',
  PARTIAL_OAS = 'Only eligible for Partial OAS due to years in Canada',
}

// used to determine color+type of alert dialog
export enum EstimationSummaryState {
  AVAILABLE_ELIGIBLE = 'AVAILABLE_ELIGIBLE', // green, display results (eligible for at least one)
  MORE_INFO = 'MORE_INFO', // yellow, need to answer more
  UNAVAILABLE = 'UNAVAILABLE', // yellow, can not provide any results, contact Service Canada (conditionally eligible)
  AVAILABLE_INELIGIBLE = 'AVAILABLE_INELIGIBLE', // red, display results (ineligible)
}
