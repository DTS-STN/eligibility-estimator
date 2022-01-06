import { Translations } from '../../../i18n/api'
import {
  FieldData,
  fieldDefinitions,
  FieldKey,
  FieldType,
} from '../definitions/fields'

export function buildFieldData(
  fieldList: Array<FieldKey>,
  translations: Translations
): Array<FieldData> {
  // takes list of keys, builds list of definitions
  const fieldDataList = fieldList.map((x) => fieldDefinitions[x])

  // applies translations
  fieldDataList.map((value) => {
    value.label = translations.question[value.key]
    if (value.type === FieldType.DROPDOWN || value.type === FieldType.RADIO) {
      value.values = translations.questionOptions[value.key]
    }
    return value
  })

  return fieldDataList
}

export function buildVisibleFields(
  fieldListList: Array<string>[]
): Array<FieldKey> {
  const allFields = []
  fieldListList.forEach((fieldList) => {
    if (fieldList) allFields.push(...fieldList)
  })
  const uniqueFields: Array<string> = [...new Set(allFields)]
  const filteredFields: Array<FieldKey> = filterInvalid(uniqueFields)
  filteredFields.sort(sortFields)
  return filteredFields
}

// removes items not specified in the field definitions, such as "_french"
function filterInvalid(array: Array<string>): Array<FieldKey> {
  const validKeys = Object.values(FieldKey) as Array<string>
  const filtered = array.filter((item) => validKeys.includes(item))
  return filtered as Array<FieldKey>
}

export function sortFields(a: string, b: string): number {
  return fieldDefinitions[a].order - fieldDefinitions[b].order
}
