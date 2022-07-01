import { Language } from '../utils/api/definitions/enums'
import { FieldKey } from '../utils/api/definitions/fields'

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

export class InputHelper {
  private _inputs: FieldInputsObject
  setInputs: (value: FieldInputsObject) => void
  language: Language
  constructor(
    inputs: FieldInputsObject,
    setInputs: (value: FieldInputsObject) => void,
    language: Language
  ) {
    if (!inputs) throw new Error('no inputs provided')
    this._inputs = inputs
    this.setInputs = setInputs
    this.language = language
  }

  private get inputs(): FieldInputsObject {
    return this._inputs
  }

  private set inputs(value: FieldInputsObject) {
    this._inputs = value
    this.setInputs(value)
  }

  getInputByKey(key: FieldKey): string {
    return this.asObject[key]
  }

  setInputByKey(key: FieldKey, newValue: string): void {
    this.inputs[key] = InputHelper.sanitizeValue(newValue)
  }

  get asArray(): FieldInput[] {
    return Object.keys(this.inputs).map((value: FieldKey) => {
      return { key: value, value: this.inputs[value] }
    })
  }

  get asArrayWithLanguage(): (FieldInput | LanguageInput)[] {
    return [...this.asArray, { key: '_language', value: this.language }]
  }

  get asObject(): { [x in FieldKey]?: string } {
    return this._inputs
  }

  get asObjectWithLanguage(): { [x in FieldKeyOrLanguage]?: string } {
    return { ...this.asObject, _language: this.language }
  }

  static sanitizeValue(value: string): string {
    if (value.includes('$')) {
      // income handling
      return value
        .toString()
        .replaceAll(' ', '')
        .replace(/(\d+),(\d+)\$/, '$1.$2') // replaces commas with decimals, but only in French!
        .replaceAll(',', '')
        .replaceAll('$', '')
    } else {
      return value.toString()
    }
  }
}
