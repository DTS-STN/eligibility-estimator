import { FieldConfig } from '../utils/api/definitions/fields'
import { InputHelper } from './InputHelper'

export class FormField {
  visible: boolean
  error?: string
  inputsHelper: InputHelper
  constructor(readonly config: FieldConfig, inputsHelper: InputHelper) {
    this.inputsHelper = inputsHelper
  }

  get value(): string {
    return this.inputsHelper.getInputByKey(this.config.key)
  }

  set value(value: string) {
    this.inputsHelper.setInputByKey(this.config.key, value)
  }

  get valid(): boolean {
    return !this.error
  }
}
