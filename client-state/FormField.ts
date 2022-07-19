import { VisibleFieldsObject } from '../components/EligibilityPage'
import { FieldConfig, FieldKey } from '../utils/api/definitions/fields'
import { InputHelper } from './InputHelper'

export class FormField {
  error?: string

  constructor(
    readonly config: FieldConfig,
    private readonly inputHelper: InputHelper,
    private readonly visibleFieldsObject: VisibleFieldsObject
  ) {}

  get value(): string {
    return this.inputHelper.getInputByKey(this.config.key)
  }

  set value(value: string) {
    this.inputHelper.setInputByKey(this.config.key, value)
  }

  get visible(): boolean {
    return this.visibleFieldsObject[this.config.key]
  }

  set visible(value: boolean) {
    this.visibleFieldsObject[this.config.key] = value
  }

  get valid(): boolean {
    return !this.error && this.value !== undefined
  }

  get key(): FieldKey {
    return this.config.key
  }
}
