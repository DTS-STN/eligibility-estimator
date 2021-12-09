export enum FieldCategory {
  INCOME_DETAILS = 'Income Details',
  PERSONAL_INFORMATION = 'Personal Information',
  PARTNER_DETAILS = 'Partner Details',
  RESIDENCY_DETAILS = 'Residency Details',
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  COMMON_LAW = 'Common-law',
  WIDOWED = 'Widowed',
  DIVORCED = 'Divorced',
  SEPARATED = 'Separated',
}

export enum LegalStatus {
  // regular cases
  CANADIAN_CITIZEN = 'Canadian citizen',
  PERMANENT_RESIDENT = 'Permanent resident or landed immigrant (non-sponsored)',
  INDIAN_STATUS = 'Indian status or status card',
  // edge cases, bail!
  // or not? (TBD...)
  SPONSORED = 'Permanent resident or landed immigrant (sponsored)',
  OTHER = 'Other',
}

export enum LivingCountry {
  CANADA = 'Canada',
  AGREEMENT = 'Agreement',
  NO_AGREEMENT = 'No Agreement',
}

export enum ResultKey {
  ELIGIBLE = `Eligible!`,
  INELIGIBLE = `Ineligible!`,
  CONDITIONAL = `Conditionally eligible...`,
  MORE_INFO = 'Need more information...',
  INVALID = 'Request is invalid!',
}

export enum ResultReason {
  NONE = `You meet the criteria`,
  AGE = `Age does not meet requirement for this benefit`,
  YEARS_IN_CANADA = `Not enough years in Canada`,
  LIVING_COUNTRY = `Not living in Canada`,
  CITIZEN = `Not a Canadian citizen`,
  SOCIAL_AGREEMENT = 'Not in a country with a social agreement',
  MORE_INFO = 'Need more information...',
  OAS = 'Not eligible for OAS',
  INCOME = 'Income too high',
  MARITAL = 'Your marital status does not meet the requirement for this benefit',
}
