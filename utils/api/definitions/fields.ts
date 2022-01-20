import { KeyAndText } from '../../../i18n/api'
import { FieldCategory } from './enums'

export enum FieldKey {
  INCOME = 'income',
  AGE = 'age',
  MARITAL_STATUS = 'maritalStatus',
  LIVING_COUNTRY = 'livingCountry',
  LEGAL_STATUS = 'legalStatus',
  LEGAL_STATUS_OTHER = 'legalStatusOther',
  CANADA_WHOLE_LIFE = 'canadaWholeLife',
  YEARS_IN_CANADA_SINCE_18 = 'yearsInCanadaSince18',
  EVER_LIVED_SOCIAL_COUNTRY = 'everLivedSocialCountry',
  PARTNER_BENEFIT_STATUS = 'partnerBenefitStatus',
  PARTNER_INCOME = 'partnerIncome',
  PARTNER_AGE = 'partnerAge',
  PARTNER_LIVING_COUNTRY = 'partnerLivingCountry',
  PARTNER_LEGAL_STATUS = 'partnerLegalStatus',
  PARTNER_CANADA_WHOLE_LIFE = 'partnerCanadaWholeLife',
  PARTNER_YEARS_IN_CANADA_SINCE_18 = 'partnerYearsInCanadaSince18',
}

export enum FieldType {
  NUMBER = 'number',
  CURRENCY = 'currency',
  BOOLEAN = 'boolean',
  DROPDOWN = 'dropdown',
  DROPDOWN_SEARCHABLE = 'dropdownSearchable',
  RADIO = 'radio',
  STRING = 'string',
}

export const fieldDefinitions: FieldDefinitions = {
  [FieldKey.INCOME]: {
    key: FieldKey.INCOME,
    category: { key: FieldCategory.INCOME_DETAILS },
    order: 1,
    type: FieldType.CURRENCY,
    placeholder: '$20,000',
  },
  [FieldKey.AGE]: {
    key: FieldKey.AGE,
    category: { key: FieldCategory.PERSONAL_INFORMATION },
    order: 2,
    type: FieldType.NUMBER,
    placeholder: '65',
  },
  [FieldKey.MARITAL_STATUS]: {
    key: FieldKey.MARITAL_STATUS,
    category: { key: FieldCategory.PERSONAL_INFORMATION },
    order: 3,
    type: FieldType.DROPDOWN,
    default: undefined,
  },
  [FieldKey.LIVING_COUNTRY]: {
    key: FieldKey.LIVING_COUNTRY,
    category: { key: FieldCategory.LEGAL_STATUS },
    order: 4,
    type: FieldType.DROPDOWN_SEARCHABLE,
    default: { key: 'CAN', text: 'Canada' },
  },
  [FieldKey.LEGAL_STATUS]: {
    key: FieldKey.LEGAL_STATUS,
    category: { key: FieldCategory.LEGAL_STATUS },
    order: 5,
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.LEGAL_STATUS_OTHER]: {
    key: FieldKey.LEGAL_STATUS_OTHER,
    category: { key: FieldCategory.LEGAL_STATUS },
    order: 6,
    type: FieldType.STRING,
    placeholder: undefined,
  },
  [FieldKey.CANADA_WHOLE_LIFE]: {
    key: FieldKey.CANADA_WHOLE_LIFE,
    category: { key: FieldCategory.LEGAL_STATUS },
    order: 7,
    type: FieldType.BOOLEAN,
  },
  [FieldKey.YEARS_IN_CANADA_SINCE_18]: {
    key: FieldKey.YEARS_IN_CANADA_SINCE_18,
    category: { key: FieldCategory.LEGAL_STATUS },
    order: 8,
    type: FieldType.NUMBER,
    placeholder: '40',
  },
  [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]: {
    key: FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
    category: { key: FieldCategory.SOCIAL_AGREEMENT },
    order: 9,
    type: FieldType.BOOLEAN,
    default: undefined,
  },
  [FieldKey.PARTNER_BENEFIT_STATUS]: {
    key: FieldKey.PARTNER_BENEFIT_STATUS,
    category: { key: FieldCategory.PARTNER_DETAILS },
    order: 10,
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.PARTNER_INCOME]: {
    key: FieldKey.PARTNER_INCOME,
    relatedKey: FieldKey.INCOME,
    category: { key: FieldCategory.PARTNER_DETAILS },
    order: 11,
    type: FieldType.CURRENCY,
    placeholder: '$20,000',
  },
  [FieldKey.PARTNER_AGE]: {
    key: FieldKey.PARTNER_AGE,
    relatedKey: FieldKey.AGE,
    category: { key: FieldCategory.PARTNER_DETAILS },
    order: 12,
    type: FieldType.NUMBER,
    placeholder: '65',
  },
  [FieldKey.PARTNER_LIVING_COUNTRY]: {
    key: FieldKey.PARTNER_LIVING_COUNTRY,
    relatedKey: FieldKey.LIVING_COUNTRY,
    category: { key: FieldCategory.PARTNER_DETAILS },
    order: 13,
    type: FieldType.DROPDOWN_SEARCHABLE,
    default: { key: 'CAN', text: 'Canada' },
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    key: FieldKey.PARTNER_LEGAL_STATUS,
    relatedKey: FieldKey.LEGAL_STATUS,
    category: { key: FieldCategory.PARTNER_DETAILS },
    order: 14,
    type: FieldType.RADIO,
    default: undefined,
  },
  [FieldKey.PARTNER_CANADA_WHOLE_LIFE]: {
    key: FieldKey.PARTNER_CANADA_WHOLE_LIFE,
    relatedKey: FieldKey.CANADA_WHOLE_LIFE,
    category: { key: FieldCategory.PARTNER_DETAILS },
    order: 15,
    type: FieldType.BOOLEAN,
  },
  [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]: {
    key: FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18,
    relatedKey: FieldKey.YEARS_IN_CANADA_SINCE_18,
    category: { key: FieldCategory.PARTNER_DETAILS },
    order: 16,
    type: FieldType.NUMBER,
    placeholder: '40',
  },
}

export type FieldData =
  | FieldDataCurrency
  | FieldDataNumber
  | FieldDataBoolean
  | FieldDataRadio
  | FieldDataDropdown
  | FieldDataString

interface FieldDataGeneric {
  key: FieldKey
  relatedKey?: FieldKey // in case certain props should use those of another key when missing
  label?: string // applied via translator
  category: {
    key: FieldCategory
    text?: string // applied via translator
  }
  order: number
}

interface FieldDataCurrency extends FieldDataGeneric {
  type: FieldType.CURRENCY
  placeholder?: string
}

interface FieldDataNumber extends FieldDataGeneric {
  type: FieldType.NUMBER
  placeholder?: string
}

interface FieldDataBoolean extends FieldDataGeneric {
  type: FieldType.BOOLEAN
  default?: string
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
