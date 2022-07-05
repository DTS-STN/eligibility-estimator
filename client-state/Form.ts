import Joi from 'joi'
import { VisibleFieldsObject } from '../components/EligibilityPage'
import { getWebTranslations, WebTranslations } from '../i18n/web'
import { BenefitHandler } from '../utils/api/benefitHandler'
import { Language, ValidationErrors } from '../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../utils/api/definitions/fields'
import MainHandler from '../utils/api/mainHandler'
import { FormField } from './FormField'
import { InputHelper } from './InputHelper'

export class Form {
  public readonly allFieldConfigs: FieldConfig[]
  public readonly fields: FormField[]

  constructor(
    private readonly language: Language,
    inputHelper: InputHelper,
    visibleFieldsObject: VisibleFieldsObject
  ) {
    this.allFieldConfigs = BenefitHandler.getAllFieldData(language)
    this.fields = this.allFieldConfigs.map((config) => {
      return new FormField(config, inputHelper, visibleFieldsObject)
    })
  }

  update(inputs: InputHelper) {
    const data = new MainHandler(inputs.asObjectWithLanguage).results
    if ('results' in data) {
      this.clearAllErrors()
      this.fields.forEach((field) => {
        field.visible = data.visibleFields.includes(field.key)
        if (!field.visible && field.value) field.value = undefined
      })
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

  clearAllErrors(): void {
    this.fields.forEach((value) => delete value.error)
  }
}
