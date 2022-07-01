import Joi from 'joi'
import { getWebTranslations, WebTranslations } from '../i18n/web'
import { BenefitHandler } from '../utils/api/benefitHandler'
import { Language, ValidationErrors } from '../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../utils/api/definitions/fields'
import MainHandler from '../utils/api/mainHandler'
import { FormField } from './FormField'
import { InputHelper } from './InputHelper'

export class Form {
  language: Language
  allFieldConfigs: FieldConfig[]
  fields: FormField[]
  constructor(language: Language, public inputsHelper: InputHelper) {
    this.language = language
    this.allFieldConfigs = BenefitHandler.getAllFieldData(language)
    this.fields = this.allFieldConfigs.map((config) => {
      return new FormField(config, this.inputsHelper)
    })
  }

  update(inputs: InputHelper) {
    const data = new MainHandler(inputs.asObjectWithLanguage).results
    console.log(`form updating data: `, data)
    console.log(`form updating inputs: `, inputs)
    if ('results' in data) {
      this.fields.forEach(
        (value) =>
          (value.visible = data.visibleFields.includes(value.config.key))
      )
    }
    if ('error' in data) {
      if (!('details' in data.detail))
        return console.error('Unexpected error:', data.detail)
      const allErrors: Joi.ValidationErrorItem[] = data.detail.details
      const allErrorsParsed: {
        [key in FieldKey]?: { text: string; successful: boolean }
      } = allErrors.reduce((allErrorsParsed, err) => {
        const tsln: WebTranslations = getWebTranslations(this.language)
        let fieldKey: FieldKey = err.context.key as FieldKey
        let errorKeyOrText: ValidationErrors | string = err.message
        try {
          const handler = new BenefitHandler({ _language: this.language })
          let text = tsln.validationErrors[errorKeyOrText] // throws error when error not handled/defined in ValidationErrors
          text = handler.replaceTextVariables(text)
          allErrorsParsed[fieldKey] = { text, successful: true }
        } catch {
          let successfulErrorExists = allErrorsParsed[fieldKey] !== undefined
          if (!successfulErrorExists) {
            const text = `Unexpected error: ${errorKeyOrText}`
            allErrorsParsed[fieldKey] = { text, successful: false }
          }
        }
        return allErrorsParsed
      }, {})
      for (const errorKey in allErrorsParsed) {
        this.getFieldByKey(<FieldKey>errorKey).error =
          allErrorsParsed[errorKey].text
      }
    }
    console.log(`this.fields: `, this.fields)
  }

  get visibleFields(): FormField[] {
    return this.fields.filter((value) => value.visible)
  }

  get visibleFieldKeys(): FieldKey[] {
    return this.visibleFields.map((value) => value.config.key)
  }

  getFieldByKey(key: FieldKey): FormField {
    return this.fields.find((value) => value.config.key === key)
  }

  get isValid(): boolean {
    this.visibleFields.forEach((value) => {
      if (!value.valid) return false
    })
    return true
  }
}
