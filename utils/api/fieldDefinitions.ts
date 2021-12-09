import {
  FieldCategories,
  Fields,
  FieldTypes,
  LegalStatusOptions,
  LivingCountryOptions,
  MaritalStatusOptions,
} from './types'

export function buildFieldData(fieldList: Array<Fields>): Array<FieldData> {
  return fieldList.map((x) => fieldDefinitions[x])
}

export function buildVisibleFields(
  fieldListList: Array<Fields>[]
): Array<Fields> {
  const allFields = []
  fieldListList.forEach((fieldList) => {
    if (fieldList) allFields.push(...fieldList)
  })
  const uniqueFields: Array<Fields> = [...new Set(allFields)]
  uniqueFields.sort(sortFields)
  return uniqueFields
}

export function sortFields(a: string, b: string): number {
  return fieldDefinitions[a].order - fieldDefinitions[b].order
}

export const fieldDefinitions: FieldDefinitions = {
  [Fields.INCOME]: {
    key: Fields.INCOME,
    label: 'What is your current net income?',
    category: FieldCategories.INCOME_DETAILS,
    order: 1,
    type: FieldTypes.NUMBER,
    placeholder: '20000',
  },
  [Fields.AGE]: {
    key: Fields.AGE,
    label: 'What is your current age?',
    category: FieldCategories.PERSONAL_INFORMATION,
    order: 2,
    type: FieldTypes.NUMBER,
    placeholder: '65',
  },
  [Fields.LEGAL_STATUS]: {
    key: Fields.LEGAL_STATUS,
    label: 'What is your current legal status in Canada?',
    category: FieldCategories.PERSONAL_INFORMATION,
    order: 3,
    type: FieldTypes.RADIO,
    values: Object.values(LegalStatusOptions),
    default: undefined,
  },
  [Fields.MARITAL_STATUS]: {
    key: Fields.MARITAL_STATUS,
    label: 'What is current marital status?',
    category: FieldCategories.PERSONAL_INFORMATION,
    order: 4,
    type: FieldTypes.RADIO,
    values: Object.values(MaritalStatusOptions),
    default: undefined,
  },
  [Fields.PARTNER_RECEIVING_OAS]: {
    key: Fields.PARTNER_RECEIVING_OAS,
    label: 'Is your partner currently receiving OAS?',
    category: FieldCategories.PARTNER_DETAILS,
    order: 5,
    type: FieldTypes.BOOLEAN,
    default: undefined,
  },
  [Fields.LIVING_COUNTRY]: {
    key: Fields.LIVING_COUNTRY,
    label: 'What country are you currently living in?',
    category: FieldCategories.RESIDENCY_DETAILS,
    order: 6,
    type: FieldTypes.DROPDOWN,
    values: Object.values(LivingCountryOptions),
    default: 'Canada',
  },
  [Fields.YEARS_IN_CANADA_SINCE_18]: {
    key: Fields.YEARS_IN_CANADA_SINCE_18,
    label: 'How many years have you lived in Canada since the age of 18?',
    category: FieldCategories.RESIDENCY_DETAILS,
    order: 7,
    type: FieldTypes.NUMBER,
    placeholder: '40',
  },
  [Fields.EVER_LIVED_SOCIAL_COUNTRY]: {
    key: Fields.EVER_LIVED_SOCIAL_COUNTRY,
    label: 'Have you ever lived in a country with a social agreement?',
    category: FieldCategories.RESIDENCY_DETAILS,
    order: 8,
    type: FieldTypes.BOOLEAN,
    default: undefined,
  },
}

export type FieldData =
  | FieldDataNumber
  | FieldDataBoolean
  | FieldDataRadio
  | FieldDataDropdown

interface FieldDataGeneric {
  key: Fields
  label: string
  category: FieldCategories
  order: number
}

interface FieldDataNumber extends FieldDataGeneric {
  type: FieldTypes.NUMBER
  placeholder?: string
}

interface FieldDataBoolean extends FieldDataGeneric {
  type: FieldTypes.BOOLEAN
  default?: string
}

interface FieldDataRadio extends FieldDataGeneric {
  type: FieldTypes.RADIO
  values: Array<string>
  default?: string
}

interface FieldDataDropdown extends FieldDataGeneric {
  type: FieldTypes.DROPDOWN
  values: Array<string>
  default?: string
}

type FieldDefinitions = {
  [x in Fields]: FieldData
}
