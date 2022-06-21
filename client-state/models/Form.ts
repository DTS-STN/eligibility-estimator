import Joi from 'joi'
import { flow, getParent, Instance, SnapshotIn, types } from 'mobx-state-tree'
import {
  getWebTranslations,
  webDictionary,
  WebTranslations,
} from '../../i18n/web'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { Language, ValidationErrors } from '../../utils/api/definitions/enums'
import {
  FieldData,
  fieldDefinitions,
  FieldKey,
} from '../../utils/api/definitions/fields'
import MainHandler from '../../utils/api/mainHandler'
import { fixedEncodeURIComponent } from '../../utils/web/helpers/utils'
import { RootStore } from '../store'
import { FormField } from './FormField'

export const Form = types
  .model({
    fields: types.array(FormField),
    API_URL: `api/calculateEligibility`,
  })
  .views((self) => ({
    get hasErrors() {
      return self.fields.some((field) => field.hasError)
    },
    fieldsByCategory(
      category: string | string[]
    ): Instance<typeof FormField>[] {
      if (typeof category === 'string') {
        return self.fields.filter((field) => field.category.key == category)
      } else if (Array.isArray(category)) {
        return self.fields.filter((field) =>
          category.includes(field.category.key)
        )
      }
    },
    get empty(): boolean {
      return self.fields.length === 0
    },
    get emptyFields(): string[] {
      let emptyFields = []
      self.fields.forEach((field) => {
        if (!field.filled) emptyFields.push(field.key)
      })
      return emptyFields
    },
  }))
  .views((self) => ({}))
  .actions((self) => ({
    getFieldByKey(key: string): Instance<typeof FormField> {
      return self.fields.find((field) => field.key == key)
    },
    removeFields(fields: Instance<typeof FormField>[]): void {
      for (const field of fields) {
        self.fields.remove(field)
      }
    },
    sortFields(): void {
      self.fields.sort(
        (
          a: Instance<typeof FormField>,
          b: Instance<typeof FormField>
        ): number => {
          const keyList: string[] = Object.keys(fieldDefinitions)
          const indexA: number = keyList.findIndex((value) => value === a.key)
          const indexB: number = keyList.findIndex((value) => value === b.key)
          return indexA - indexB
        }
      )
    },
  }))
  .actions((self) => ({
    addField(data: SnapshotIn<typeof FormField>): void {
      try {
        self.fields.push({ ...data })
        self.sortFields()
      } catch (error) {
        console.log('error occurred while adding field to self.fields', error)
      }
    },
    removeAllFields(): void {
      self.fields.clear()
    },
  }))
  .actions((self) => ({
    removeUnnecessaryFieldsFromForm(fieldData: FieldData[]): void {
      const unnecessaryFields = self.fields
        .map((f) => {
          const field = fieldData.find((fd) => fd.key == f.key)

          if (!field) return f
        })
        .filter((f) => FormField.is(f))
      self.removeFields(unnecessaryFields)
    },
    validateAgainstEmptyFields(locale: string): boolean {
      let errorsExist = false
      self.fields.map((field) => {
        if (!field.filled) {
          field.setError(webDictionary[locale].errors.empty)
          errorsExist = true
        }
        return field
      })
      return errorsExist
    },
  }))
  .actions((self) => ({
    clearAllErrors() {
      self.fields.map((field) => field.setError(undefined))
    },
    setupForm(data: FieldData[]): void {
      console.log('setting up form')
      data.map((fieldData) => {
        const field = self.getFieldByKey(fieldData?.key)
        console.log('setting up field', fieldData.label)

        let placeholder,
          defaultValue,
          options = undefined,
          helpText = undefined
        if ('default' in fieldData) defaultValue = fieldData.default
        if ('placeholder' in fieldData) placeholder = fieldData.placeholder
        if ('values' in fieldData) options = fieldData.values
        if ('helpText' in fieldData) helpText = fieldData.helpText

        // field does not exist, add it
        if (!field) {
          self.addField({
            key: fieldData.key,
            type: fieldData.type,
            label: fieldData.label,
            category: {
              key: fieldData.category.key,
              text: fieldData.category.text,
            },
            placeholder: placeholder,
            default: defaultValue,
            options: options,
            value: defaultValue ?? null,
            helpText: helpText ?? null,
          })
        }
        // field does exist, update if any data has changed
        else if (field.label !== fieldData.label) {
          console.log('updating field ', fieldData.label)
          field.label = fieldData.label
          field.helpText = fieldData.helpText
          field.category = fieldData.category
          field.options = options
          field.placeholder = placeholder
        }
      })
    },
    // used for calling the main benefit processor
    buildObjectWithFormData(language: Language): { [key: string]: string } {
      console.log('buildObjectWithFormData')
      let input = { _language: language }
      for (const field of self.fields) {
        if (!field.value) continue
        input[field.key] = field.sanitizeInput()
      }
      return input
    },
    // used for calling the main benefit processor using the array from the internal state
    buildArrayWithFormData(language: Language): [string, string][] {
      console.log('buildArrayWithFormData')
      let input = []
      input.push(['_language', language])
      self.sortFields()
      for (const field of self.fields) {
        if (!field.value) continue
        input.push([field.key, field.sanitizeInput()])
      }
      return input
    },
    // used for API requests, which is currently for the CSV function
    buildQueryStringWithFormData(): string {
      const parent = getParent(self) as Instance<typeof RootStore>
      let qs = `_language=${parent.langBrowser}`
      for (const field of self.fields) {
        if (!field.value) continue
        qs += `&${field.key}=${fixedEncodeURIComponent(field.sanitizeInput())}`
      }
      return qs
    },
  }))
  .actions((self) => ({
    saveInputsToState: flow(function* () {
      const parent = getParent(self) as Instance<typeof RootStore>
      const inputArray = self.buildArrayWithFormData(parent.langBrowser)
      parent.setInputs(inputArray)
      parent.saveStoreState()
    }),
  }))
  .actions((self) => ({
    sendAPIRequest: flow(function* () {
      const parent = getParent(self) as Instance<typeof RootStore>
      self.saveInputsToState()
      const input = self.buildObjectWithFormData(parent.langBrowser)
      const data = new MainHandler(input).results

      if ('error' in data) {
        self.clearAllErrors()
        if (!('details' in data.detail))
          return console.error('Unexpected error:', data.detail)
        // sometimes a single field will return multiple errors, and sometimes certain errors are not handled properly.
        // this iterates through those errors, and will ultimately only display one error per field, preferring ones handled properly.
        const allErrors: Joi.ValidationErrorItem[] = data.detail.details
        const allErrorsParsed: {
          [key in FieldKey]?: { text: string; successful: boolean }
        } = allErrors.reduce((allErrorsParsed, err) => {
          const language: Language = parent.langBrowser
          const tsln: WebTranslations = getWebTranslations(language)
          let fieldKey: FieldKey = err.context.key as FieldKey
          let errorKeyOrText: ValidationErrors | string = err.message
          try {
            const handler = new BenefitHandler({ _language: language })
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
          self.getFieldByKey(errorKey).setError(allErrorsParsed[errorKey].text)
        }
      } else {
        self.clearAllErrors()
        parent.setOAS(data.results.oas)
        parent.setGIS(data.results.gis)
        parent.setAFS(data.results.afs)
        parent.setAllowance(data.results.alw)
        parent.setSummary(data.summary)
        parent.setLangData(parent.langBrowser)
        self.removeUnnecessaryFieldsFromForm(data.fieldData)
        self.setupForm(data.fieldData)
        parent.saveStoreState()
      }
    }),
  }))
  .actions((self) => ({
    clearForm(): void {
      const fieldsToRemove: Instance<typeof FormField> = []
      for (const field of self.fields) {
        field.setValue(null)
      }
      self.removeFields(fieldsToRemove)

      // remove the now invalid summary object
      const parent = getParent(self) as Instance<typeof RootStore>
      parent.setSummary({})
      self.sendAPIRequest()
    },
  }))
