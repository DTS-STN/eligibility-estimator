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
  fieldDataList.map((fieldData) => {
    // translate category
    const category = translations.category[fieldData.category.key]
    if (!category) throw new Error(`no category for key ${fieldData.category}`)
    fieldData.category.text = category

    // translate label
    const label = translations.question[fieldData.key]
    if (!label) throw new Error(`no question for key ${fieldData.key}`)
    fieldData.label = label

    // translate values/questionOptions
    if (
      fieldData.type === FieldType.DROPDOWN ||
      fieldData.type === FieldType.DROPDOWN_SEARCHABLE ||
      fieldData.type === FieldType.RADIO
    ) {
      const questionOptions = translations.questionOptions[fieldData.key]
      if (!questionOptions)
        throw new Error(`no questionOptions for key ${fieldData.key}`)
      fieldData.values = questionOptions
    }

    return fieldData
  })

  return fieldDataList
}

export function sortFields(a: string, b: string): number {
  return fieldDefinitions[a].order - fieldDefinitions[b].order
}
