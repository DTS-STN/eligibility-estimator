import { FieldData, fieldDefinitions, FieldKey } from '../definitions/fields'

export function buildFieldData(fieldList: Array<FieldKey>): Array<FieldData> {
  return fieldList.map((x) => fieldDefinitions[x])
}

export function buildVisibleFields(
  fieldListList: Array<FieldKey>[]
): Array<FieldKey> {
  const allFields = []
  fieldListList.forEach((fieldList) => {
    if (fieldList) allFields.push(...fieldList)
  })
  const uniqueFields: Array<FieldKey> = [...new Set(allFields)]
  uniqueFields.sort(sortFields)
  return uniqueFields
}

export function sortFields(a: string, b: string): number {
  return fieldDefinitions[a].order - fieldDefinitions[b].order
}
