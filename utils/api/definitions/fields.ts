import {
  FieldCategory,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
} from './enums'

export enum FieldKey {
  INCOME = 'income',
  AGE = 'age',
  LIVING_COUNTRY = 'livingCountry',
  LEGAL_STATUS = 'legalStatus',
  YEARS_IN_CANADA_SINCE_18 = 'yearsInCanadaSince18',
  MARITAL_STATUS = 'maritalStatus',
  PARTNER_RECEIVING_OAS = 'partnerReceivingOas',
  EVER_LIVED_SOCIAL_COUNTRY = 'everLivedSocialCountry',
}

enum FieldType {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
}

export const fieldDefinitions: FieldDefinitions = {
  [FieldKey.INCOME]: {
    key: FieldKey.INCOME,
    label: 'What is your current net income?',
    category: FieldCategory.INCOME_DETAILS,
    order: 1,
    type: FieldType.NUMBER,
    placeholder: '20000',
  },
  [FieldKey.AGE]: {
    key: FieldKey.AGE,
    label: 'What is your current age?',
    category: FieldCategory.PERSONAL_INFORMATION,
    order: 2,
    type: FieldType.NUMBER,
    placeholder: '65',
  },
  [FieldKey.MARITAL_STATUS]: {
    key: FieldKey.MARITAL_STATUS,
    label: 'What is current marital status?',
    category: FieldCategory.PERSONAL_INFORMATION,
    order: 3,
    type: FieldType.RADIO,
    values: Object.values(MaritalStatus),
    default: undefined,
  },
  [FieldKey.PARTNER_RECEIVING_OAS]: {
    key: FieldKey.PARTNER_RECEIVING_OAS,
    label: 'Is your partner currently receiving OAS?',
    category: FieldCategory.PARTNER_DETAILS,
    order: 4,
    type: FieldType.BOOLEAN,
    default: undefined,
  },
  [FieldKey.LIVING_COUNTRY]: {
    key: FieldKey.LIVING_COUNTRY,
    label: 'What country are you currently living in?',
    category: FieldCategory.LEGAL_STATUS,
    order: 5,
    type: FieldType.DROPDOWN,
    values: Object.values(LivingCountry),
    default: 'Canada',
  },
  [FieldKey.LEGAL_STATUS]: {
    key: FieldKey.LEGAL_STATUS,
    label: 'What is your current legal status in Canada?',
    category: FieldCategory.LEGAL_STATUS,
    order: 6,
    type: FieldType.RADIO,
    values: Object.values(LegalStatus),
    default: undefined,
  },
  [FieldKey.YEARS_IN_CANADA_SINCE_18]: {
    key: FieldKey.YEARS_IN_CANADA_SINCE_18,
    label: 'How many years have you lived in Canada since the age of 18?',
    category: FieldCategory.LEGAL_STATUS,
    order: 7,
    type: FieldType.NUMBER,
    placeholder: '40',
  },
  [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]: {
    key: FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
    label: 'Have you ever lived in a country with a social agreement?',
    category: FieldCategory.LEGAL_STATUS,
    order: 8,
    type: FieldType.BOOLEAN,
    default: undefined,
  },
}

export type FieldData =
  | FieldDataNumber
  | FieldDataBoolean
  | FieldDataRadio
  | FieldDataDropdown

interface FieldDataGeneric {
  key: FieldKey
  label: string
  category: FieldCategory
  order: number
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
  values: Array<string>
  default?: string
}

interface FieldDataDropdown extends FieldDataGeneric {
  type: FieldType.DROPDOWN
  values: Array<string>
  default?: string
}

type FieldDefinitions = {
  [x in FieldKey]: FieldData
}
