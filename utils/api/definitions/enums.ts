export enum FieldCategory {
  INCOME_DETAILS = 'Income Details',
  PERSONAL_INFORMATION = 'Personal Information',
  PARTNER_DETAILS = 'Partner Details',
  LEGAL_STATUS = 'Legal Status',
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
  CANADIAN_CITIZEN = 'Canadian citizen',
  PERMANENT_RESIDENT = 'Permanent resident or landed immigrant (non-sponsored)',
  SPONSORED = 'Permanent resident or landed immigrant (sponsored)',
  INDIAN_STATUS = 'Indian status or status card',
  OTHER = 'Other (Example: Temporary resident, student, temporary worker, etc.)',
}

export enum LivingCountry {
  CANADA = 'Canada',
  AGREEMENT = 'Agreement',
  NO_AGREEMENT = 'No Agreement',
}

export enum ResultKey {
  ELIGIBLE = `Eligible!`,
  INELIGIBLE = `Not eligible!`,
  CONDITIONAL = `Conditionally eligible...`,
  MORE_INFO = 'Need more information...',
  INVALID = 'Request is invalid!',
}

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
}

// used to determine color+type of alert dialog
export enum EstimationSummaryState {
  AVAILABLE_ELIGIBLE = 'AVAILABLE_ELIGIBLE', // green, display results (eligible for at least one)
  MORE_INFO = 'MORE_INFO', // yellow, need to answer more
  UNAVAILABLE = 'UNAVAILABLE', // yellow, can not provide any results, contact Service Canada (conditionally eligible)
  AVAILABLE_INELIGIBLE = 'AVAILABLE_INELIGIBLE', // red, display results (ineligible)
}
