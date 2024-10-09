import { KeyAndText, TypedKeyAndText } from '../../../i18n/api'
import { FieldCategory } from './enums'

export enum FieldKey {
  INCOME_AVAILABLE = 'incomeAvailable',
  INCOME = 'income',
  INCOME_WORK = 'incomeWork',
  AGE = 'age',
  ALREADY_RECEIVE_OAS = 'receiveOAS',
  WHEN_TO_START = 'whenToStartOAS',
  START_DATE_FOR_OAS = 'startDateForOAS',
  OAS_DEFER_DURATION = 'oasDeferDuration',
  OAS_DEFER = 'oasDefer',
  OAS_AGE = 'oasAge',
  MARITAL_STATUS = 'maritalStatus',
  INV_SEPARATED = 'invSeparated',
  LIVING_COUNTRY = 'livingCountry',
  LEGAL_STATUS = 'legalStatus',
  LIVED_ONLY_IN_CANADA = 'livedOnlyInCanada',
  YEARS_IN_CANADA_SINCE_18 = 'yearsInCanadaSince18',
  YEARS_IN_CANADA_SINCE_OAS = 'yearsInCanadaSinceOAS',
  EVER_LIVED_SOCIAL_COUNTRY = 'everLivedSocialCountry',
  PARTNER_BENEFIT_STATUS = 'partnerBenefitStatus',
  PARTNER_INCOME_AVAILABLE = 'partnerIncomeAvailable',
  PARTNER_INCOME = 'partnerIncome',
  PARTNER_INCOME_WORK = 'partnerIncomeWork',
  PARTNER_AGE = 'partnerAge',
  PARTNER_LIVING_COUNTRY = 'partnerLivingCountry',
  PARTNER_LEGAL_STATUS = 'partnerLegalStatus',
  PARTNER_LIVED_ONLY_IN_CANADA = 'partnerLivedOnlyInCanada',
  PARTNER_YEARS_IN_CANADA_SINCE_18 = 'partnerYearsInCanadaSince18',
}

export enum FieldType {
  NUMBER = 'number',
  CURRENCY = 'currency',
  DROPDOWN = 'dropdown',
  DROPDOWN_SEARCHABLE = 'dropdownSearchable',
  RADIO = 'radio',
  STRING = 'string',
  DATE = 'date',
  DURATION = 'duration',
}

// the order of fields here will define the order within the application
export const fieldDefinitions: FieldDefinitions = {
  [FieldKey.AGE]: {
    key: FieldKey.AGE,
    category: { key: FieldCategory.AGE },
    type: FieldType.DATE,
  },
  [FieldKey.ALREADY_RECEIVE_OAS]: {
    key: FieldKey.ALREADY_RECEIVE_OAS,
    category: { key: FieldCategory.AGE },
    type: FieldType.RADIO,
  },
  [FieldKey.WHEN_TO_START]: {
    key: FieldKey.WHEN_TO_START,
    category: { key: FieldCategory.AGE },
    type: FieldType.RADIO,
    //default: { key: 'true', text: 'Yes', shortText: 'Yes' },
  },
  [FieldKey.START_DATE_FOR_OAS]: {
    key: FieldKey.START_DATE_FOR_OAS,
    category: { key: FieldCategory.AGE },
    type: FieldType.DATE,
  },
  [FieldKey.OAS_DEFER_DURATION]: {
    key: FieldKey.OAS_DEFER_DURATION,
    category: { key: FieldCategory.AGE },
    type: FieldType.DURATION,
    default: { key: JSON.stringify({ months: 0, years: 0 }), text: 'TEST' },
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
  [FieldKey.INCOME_WORK]: {
    key: FieldKey.INCOME_WORK,
    category: { key: FieldCategory.INCOME },
    type: FieldType.CURRENCY,
    default: '0',
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
  [FieldKey.LIVED_ONLY_IN_CANADA]: {
    key: FieldKey.LIVED_ONLY_IN_CANADA,
    category: { key: FieldCategory.RESIDENCE },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.YEARS_IN_CANADA_SINCE_18]: {
    key: FieldKey.YEARS_IN_CANADA_SINCE_18,
    category: { key: FieldCategory.RESIDENCE },
    type: FieldType.NUMBER,
  },
  [FieldKey.YEARS_IN_CANADA_SINCE_OAS]: {
    key: FieldKey.YEARS_IN_CANADA_SINCE_OAS,
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
  [FieldKey.INV_SEPARATED]: {
    key: FieldKey.INV_SEPARATED,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.PARTNER_AGE]: {
    key: FieldKey.PARTNER_AGE,
    relatedKey: FieldKey.AGE,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.DATE,
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
  [FieldKey.PARTNER_INCOME_WORK]: {
    key: FieldKey.PARTNER_INCOME_WORK,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.CURRENCY,
    default: '0',
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
  [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]: {
    key: FieldKey.PARTNER_LIVED_ONLY_IN_CANADA,
    relatedKey: FieldKey.LIVED_ONLY_IN_CANADA,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]: {
    key: FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18,
    relatedKey: FieldKey.YEARS_IN_CANADA_SINCE_18,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.NUMBER,
  },
  [FieldKey.PARTNER_BENEFIT_STATUS]: {
    key: FieldKey.PARTNER_BENEFIT_STATUS,
    category: { key: FieldCategory.MARITAL },
    type: FieldType.RADIO,
    default: undefined,
  },
}

export type FieldConfig =
  | FieldConfigCurrency
  | FieldConfigNumber
  | FieldConfigRadio
  | FieldConfigDropdown
  | FieldConfigString
  | FieldConfigDate
  | FieldConfigDuration

interface FieldConfigGeneric {
  key: FieldKey
  relatedKey?: FieldKey // in case certain props should use those of another key when missing
  label?: string // applied via translator
  helpText?: string
  category: {
    key: FieldCategory
    text?: string // applied via translator
  }
}

interface FieldConfigDate extends FieldConfigGeneric {
  type: FieldType.DATE
}

interface FieldConfigDuration extends FieldConfigGeneric {
  type: FieldType.DURATION
  values?: Array<KeyAndText>
  default?: KeyAndText
}

interface FieldConfigCurrency extends FieldConfigGeneric {
  type: FieldType.CURRENCY
  placeholder?: string
  default?: string
}

interface FieldConfigNumber extends FieldConfigGeneric {
  type: FieldType.NUMBER
  placeholder?: string
}

interface FieldConfigRadio extends FieldConfigGeneric {
  type: FieldType.RADIO
  values?: Array<TypedKeyAndText<string>> // applied via translator
  default?: TypedKeyAndText<string>
}

export interface FieldConfigDropdown extends FieldConfigGeneric {
  type: FieldType.DROPDOWN | FieldType.DROPDOWN_SEARCHABLE
  values?: Array<KeyAndText> // applied via translator
  default?: KeyAndText
}

interface FieldConfigString extends FieldConfigGeneric {
  type: FieldType.STRING
  placeholder?: string
}

type FieldDefinitions = {
  [x in FieldKey]: FieldConfig
}
