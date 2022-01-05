import { FieldData, fieldDefinitions, FieldKey } from '../definitions/fields'

export function buildFieldData(fieldList: Array<FieldKey>): Array<FieldData> {
  return fieldList.map((x) => fieldDefinitions[x])
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
