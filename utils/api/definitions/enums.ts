export enum BenefitKey {
  oas = 'oas',
  gis = 'gis',
  alw = 'alw',
  afs = 'afs',
}

export enum FieldCategory {
  AGE = 'age',
  INCOME = 'income',
  LEGAL = 'legal',
  RESIDENCE = 'residence',
  MARITAL = 'marital',
}

export enum MaritalStatus {
  SINGLE = 'single',
  PARTNERED = 'partnered',
  WIDOWED = 'widowed',
  INV_SEPARATED = 'invSeparated',
}

export enum LegalStatus {
  CANADIAN_CITIZEN = 'canadianCitizen',
  PERMANENT_RESIDENT = 'permanentResident',
  SPONSORED = 'sponsored',
  INDIAN_STATUS = 'indianStatus',
  OTHER = 'other',
}

export enum PartnerBenefitStatus {
  OAS = 'oas',
  OAS_GIS = 'oasGis',
  ALW = 'alw',
  NONE = 'none',
  HELP_ME = 'helpMe',
}

export enum LivingCountry {
  CANADA = 'CAN',
  AGREEMENT = 'AGREEMENT',
  NO_AGREEMENT = 'NO_AGREEMENT',
}

// not displayed in the UI
export enum EntitlementResultType {
  NONE = 'none',
  FULL = 'full',
  PARTIAL = 'partial', // oas only
  PARTIAL_OR_FULL = 'partialOrFull', // oas only
  UNAVAILABLE = 'unavailable', // for example when gis unavailable due to partial oas
}

// not displayed in the UI
export enum ResultKey {
  ELIGIBLE = `eligible`,
  INELIGIBLE = `ineligible`,
  UNAVAILABLE = `unavailable`,
  MORE_INFO = 'moreInfo',
  INVALID = 'invalid',
  INCOME_DEPENDENT = 'incomeDependent',
}

// not displayed in the UI
export enum ResultReason {
  NONE = `You meet the criteria`,
  AGE = `Age does not meet requirement for this benefit`,
  AGE_YOUNG = `Age does not meet yet requirement for this benefit, will in the future`,
  YEARS_IN_CANADA = `Not enough years in Canada`,
  LIVING_COUNTRY = `Not living in Canada`,
  LEGAL_STATUS = `Legal status does not meet requirement for this benefit`,
  SOCIAL_AGREEMENT = 'Not in a country with a social agreement',
  MORE_INFO = 'Need more information...',
  OAS = 'Not eligible for OAS',
  INCOME = 'Income too high',
  INCOME_MISSING = 'Income not provided',
  MARITAL = 'Your marital status does not meet the requirement for this benefit',
  PARTNER = 'Your partner does not receive the required benefits',
}

// used to determine color+type of alert dialog
export enum SummaryState {
  AVAILABLE_ELIGIBLE = 'AVAILABLE_ELIGIBLE', // green, display results (eligible for at least one)
  MORE_INFO = 'MORE_INFO', // yellow, need to answer more
  UNAVAILABLE = 'UNAVAILABLE', // yellow, can not provide any results, contact Service Canada (conditionally eligible)
  AVAILABLE_INELIGIBLE = 'AVAILABLE_INELIGIBLE', // red, display results (ineligible)
  AVAILABLE_DEPENDING = 'AVAILABLE_DEPENDING', // eligible, depending on income
}

export enum LinkIcon {
  note = 'note',
  info = 'info',
  link = 'link',
}

// all "custom" Joi Validation errors that we properly handle and translate for the end user
export enum ValidationErrors {
  incomeBelowZero = 'incomeBelowZero',
  partnerIncomeBelowZero = 'partnerIncomeBelowZero',
  incomeTooHigh = 'incomeTooHigh',
  partnerIncomeTooHigh = 'partnerIncomeTooHigh',
  ageUnder18 = 'ageUnder18',
  partnerAgeUnder18 = 'partnerAgeUnder18',
  ageOver150 = 'ageOver150',
  partnerAgeOver150 = 'partnerAgeOver150',
  oasAge65to70 = 'oasAge65to70',
  yearsInCanadaNotEnough = 'yearsInCanadaNotEnough',
  yearsInCanadaMinusAge = 'yearsInCanadaMinusAge',
  partnerYearsInCanadaMinusAge = 'partnerYearsInCanadaMinusAge',
  maritalUnavailable = 'maritalUnavailable',
  legalUnavailable = 'legalUnavailable',
  socialCountryUnavailable = 'socialCountryUnavailable',
}

export enum Language {
  EN = 'en',
  FR = 'fr',
}

// must be one of: https://www.techonthenet.com/js/language_tags.php
export enum LanguageCode {
  EN = 'en-CA',
  FR = 'fr-CA',
}
