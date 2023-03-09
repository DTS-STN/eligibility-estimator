import { Language } from '../utils/api/definitions/enums'
import { fieldDefinitions, FieldKey } from '../utils/api/definitions/fields'

interface LanguageInput {
  key: '_language'
  value: Language
}

export interface FieldInput {
  key: FieldKey
  value: string
}

type FieldKeyOrLanguage = FieldKey | '_language'

export type FieldInputsObject = {
  [key in FieldKey]?: string
}

export type ErrorsVisibleObject = {
  [key in FieldKey]?: boolean
}

export class InputHelper {
  constructor(
    private readonly inputs: FieldInputsObject,
    private readonly setInputs: (value: FieldInputsObject) => void,
    private readonly language: Language
  ) {
    if (!inputs) throw new Error('no inputs provided')
  }

  getInputByKey(key: FieldKey): string {
    return this.asObject[key]
  }

  setInputByKey(key: FieldKey, newValue: string): void {
    if (newValue === '' || newValue === undefined) delete this.inputs[key]
    else this.inputs[key] = InputHelper.sanitizeValue(newValue, this.language)
    this.setInputs(this.inputs)
  }

  /**
   * Returns the inputs as an array. Useful for when you want the correct order.
   */
  get asArray(): FieldInput[] {
    const unsortedArray: FieldInput[] = Object.keys(this.inputs).map(
      (value: FieldKey) => ({ key: value, value: this.inputs[value] })
    )
    const keysSorted: FieldKey[] = Object.keys(fieldDefinitions) as FieldKey[]
    return unsortedArray.sort((a, b) => {
      const indexA = keysSorted.findIndex((value) => a.key === value)
      const indexB = keysSorted.findIndex((value) => b.key === value)
      return indexA - indexB
    })
  }

  get asArrayWithLanguage(): (FieldInput | LanguageInput)[] {
    return [...this.asArray, { key: '_language', value: this.language }]
  }

  /**
   * Returns the inputs as an object. Useful for if you want to get/set a specific item.
   * Note that these are not in order.
   */
  get asObject(): { [x in FieldKey]?: string } {
    return this.inputs
  }

  get asObjectWithLanguage(): { [x in FieldKeyOrLanguage]?: string } {
    return { ...this.asObject, _language: this.language }
  }

  static sanitizeValue(value: string, language: string): string {
    // income handling
    if (value.includes('$'))
      return value
        .toString()
        .replaceAll(' ', '')
        .replace(/(\d+),(\d+) \$/, '$1.$2') // replaces commas with decimals, but only in French!
        .replaceAll(',', language === 'en' ? '' : '.')
        .replaceAll('$', '')
    else return value
  }
}
