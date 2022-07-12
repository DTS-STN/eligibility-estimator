import { KeyAndText } from '../../../i18n/api'
import { FieldCategory } from './enums'

export enum FieldKey {
  INCOME_AVAILABLE = 'incomeAvailable',
  INCOME = 'income',
  AGE = 'age',
  OAS_DEFER = 'oasDefer',
  OAS_AGE = 'oasAge',
  MARITAL_STATUS = 'maritalStatus',
  LIVING_COUNTRY = 'livingCountry',
  LEGAL_STATUS = 'legalStatus',
  LIVED_OUTSIDE_CANADA = 'livedOutsideCanada',
  YEARS_IN_CANADA_SINCE_18 = 'yearsInCanadaSince18',
  EVER_LIVED_SOCIAL_COUNTRY = 'everLivedSocialCountry',
  PARTNER_BENEFIT_STATUS = 'partnerBenefitStatus',
  PARTNER_INCOME_AVAILABLE = 'partnerIncomeAvailable',
  PARTNER_INCOME = 'partnerIncome',
  PARTNER_AGE = 'partnerAge',
  PARTNER_LIVING_COUNTRY = 'partnerLivingCountry',
  PARTNER_LEGAL_STATUS = 'partnerLegalStatus',
  PARTNER_LIVED_OUTSIDE_CANADA = 'partnerLivedOutsideCanada',
  PARTNER_YEARS_IN_CANADA_SINCE_18 = 'partnerYearsInCanadaSince18',
  PARTNER_EVER_LIVED_SOCIAL_COUNTRY = 'partnerEverLivedSocialCountry',
}

export enum FieldType {
  NUMBER = 'number',
  CURRENCY = 'currency',
  DROPDOWN = 'dropdown',
  DROPDOWN_SEARCHABLE = 'dropdownSearchable',
  RADIO = 'radio',
  STRING = 'string',
}

// the order of fields here will define the order within the application
export const fieldDefinitions: FieldDefinitions = {
  [FieldKey.AGE]: {
    key: FieldKey.AGE,
    category: { key: FieldCategory.AGE },
    type: FieldType.NUMBER,
  },
  [FieldKey.OAS_DEFER]: {
    key: FieldKey.OAS_DEFER,
    category: { key: FieldCategory.AGE },
    type: FieldType.RADIO,
  },
  [FieldKey.OAS_AGE]: {
    key: FieldKey.OAS_AGE,
    category: { key: FieldCategory.AGE },
    type: FieldType.NUMBER,
  },
  [FieldKey.INCOME_AVAILABLE]: {
    key: FieldKey.INCOME_AVAILABLE,
    category: { key: FieldCategory.INCOME },
    type: FieldType.RADIO,
  },
  [FieldKey.INCOME]: {
    key: FieldKey.INCOME,
    category: { key: FieldCategory.INCOME },
    type: FieldType.CURRENCY,
  },
  [FieldKey.LEGAL_STATUS]: {
    key: FieldKey.LEGAL_STATUS,
    category: { key: FieldCategory.LEGAL },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.LIVING_COUNTRY]: {
    key: FieldKey.LIVING_COUNTRY,
    category: { key: FieldCategory.RESIDENCE },
    type: FieldType.DROPDOWN_SEARCHABLE,
    default: { key: 'CAN', text: 'Canada' },
  },
  [FieldKey.LIVED_OUTSIDE_CANADA]: {
    key: FieldKey.LIVED_OUTSIDE_CANADA,
    category: { key: FieldCategory.RESIDENCE },
    type: FieldType.RADIO,
  },
  [FieldKey.YEARS_IN_CANADA_SINCE_18]: {
    key: FieldKey.YEARS_IN_CANADA_SINCE_18,
    category: { key: FieldCategory.RESIDENCE },
    type: FieldType.NUMBER,
  },
  [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]: {
    key: FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
    category: { key: FieldCategory.RESIDENCE },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.MARITAL_STATUS]: {
    key: FieldKey.MARITAL_STATUS,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.PARTNER_INCOME_AVAILABLE]: {
    key: FieldKey.PARTNER_INCOME_AVAILABLE,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
  },
  [FieldKey.PARTNER_INCOME]: {
    key: FieldKey.PARTNER_INCOME,
    relatedKey: FieldKey.INCOME,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.CURRENCY,
  },
  [FieldKey.PARTNER_BENEFIT_STATUS]: {
    key: FieldKey.PARTNER_BENEFIT_STATUS,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.PARTNER_AGE]: {
    key: FieldKey.PARTNER_AGE,
    relatedKey: FieldKey.AGE,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.NUMBER,
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    key: FieldKey.PARTNER_LEGAL_STATUS,
    relatedKey: FieldKey.LEGAL_STATUS,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.PARTNER_LIVING_COUNTRY]: {
    key: FieldKey.PARTNER_LIVING_COUNTRY,
    relatedKey: FieldKey.LIVING_COUNTRY,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.DROPDOWN_SEARCHABLE,
    default: { key: 'CAN', text: 'Canada' },
  },
  [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: {
    key: FieldKey.PARTNER_LIVED_OUTSIDE_CANADA,
    relatedKey: FieldKey.LIVED_OUTSIDE_CANADA,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
  },
  [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]: {
    key: FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18,
    relatedKey: FieldKey.YEARS_IN_CANADA_SINCE_18,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.NUMBER,
    placeholder: '40',
  },
  [FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY]: {
    key: FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY,
    relatedKey: FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
    default: undefined,
  },
}

export type FieldData =
  | FieldDataCurrency
  | FieldDataNumber
  | FieldDataRadio
  | FieldDataDropdown
  | FieldDataString

interface FieldDataGeneric {
  key: FieldKey
  relatedKey?: FieldKey // in case certain props should use those of another key when missing
  label?: string // applied via translator
  helpText?: string
  category: {
    key: FieldCategory
    text?: string // applied via translator
  }
}

interface FieldDataCurrency extends FieldDataGeneric {
  type: FieldType.CURRENCY
  placeholder?: string
}

interface FieldDataNumber extends FieldDataGeneric {
  type: FieldType.NUMBER
  placeholder?: string
}

interface FieldDataRadio extends FieldDataGeneric {
  type: FieldType.RADIO
  values?: Array<KeyAndText> // applied via translator
  default?: KeyAndText
}

export interface FieldDataDropdown extends FieldDataGeneric {
  type: FieldType.DROPDOWN | FieldType.DROPDOWN_SEARCHABLE
  values?: Array<KeyAndText> // applied via translator
  default?: KeyAndText
}

interface FieldDataString extends FieldDataGeneric {
  type: FieldType.STRING
  placeholder?: string
}

type FieldDefinitions = {
  [x in FieldKey]: FieldData
}
