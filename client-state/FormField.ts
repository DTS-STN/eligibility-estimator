import { getBirthMonthAndYear } from '../components/QuestionsPage/utils'
import {
  FieldConfig,
  FieldKey,
  FieldType,
} from '../utils/api/definitions/fields'
import { VisibleFieldsObject } from '../utils/web/types'
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

  get inputs(): any {
    return this.inputHelper.inputs
  }

  set value(value: string) {
    this.inputHelper.setInputByKey(this, value)
  }

  // get metaData(): { [key: string]: any } {
  //   const metaData: { [key: string]: any } = {}
  //   if (this.config.type === FieldType.DURATION) {
  //     // const age = this.inputHelper.inputs.age
  //     // metaData.age = age
  //     //   ? getBirthMonthAndYear(age)
  //     //   : { month: 1, year: undefined }
  //     return { age: { month: 1, year: 1953 } }
  //   }

  //   return metaData
  // }

  get visible(): boolean {
    return this.visibleFieldsObject[this.config.key]
  }

  set visible(value: boolean) {
    this.visibleFieldsObject[this.config.key] = value
  }

  // set metaData(value: { [key: string]: any }) {}

  // get metaData(): { [key: string]: any } {
  //   return { ageDate: { month: 1, year: 1953 } }
  // }

  get valid(): boolean {
    return !this.error && this.value !== undefined
  }

  get key(): FieldKey {
    return this.config.key
  }
}
