import { FieldConfig } from '../../utils/api/definitions/fields'
import { InputsHelper } from './InputsHelper'

export class FormFieldNew {
  visible: boolean
  error?: string
  inputsHelper: InputsHelper
  constructor(readonly config: FieldConfig, inputsHelper: InputsHelper) {
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
