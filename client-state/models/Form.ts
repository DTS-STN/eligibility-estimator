import { flow, getParent, Instance, SnapshotIn, types } from 'mobx-state-tree'
import { FieldCategory } from '../../utils/api/definitions/enums'
import { FieldData, FieldKey } from '../../utils/api/definitions/fields'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { fixedEncodeURIComponent } from '../../utils/web/helpers/utils'
import { RootStore } from '../store'
import { FormField } from './FormField'

type FormProgress = {
  income: boolean
  personal: boolean
  legal: boolean
  estimation?: boolean
}

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
  }))
  .views((self) => ({
    get progress(): FormProgress {
      const incomeFields = self.fieldsByCategory(FieldCategory.INCOME_DETAILS)
      const legalFields = self.fieldsByCategory(FieldCategory.LEGAL_STATUS)
      const personalFields = self.fieldsByCategory([
        FieldCategory.PERSONAL_INFORMATION,
        FieldCategory.PARTNER_DETAILS,
      ])

      const iComplete =
        incomeFields.length > 0 && incomeFields.every((field) => field.filled)
      const pComplete =
        personalFields.length > 0 &&
        personalFields.every((field) => field.filled)
      const lComplete =
        legalFields.length > 0 && legalFields.every((field) => field.filled)

      return { income: iComplete, personal: pComplete, legal: lComplete }
    },
  }))
  .actions((self) => ({
    getFieldByKey(key: string): Instance<typeof FormField> {
      return self.fields.find((field) => field.key == key)
    },
    removeFields(fields: Instance<typeof FormField>[]): void {
      for (const field of fields) {
        self.fields.remove(field)
      }
    },
  }))
  .actions((self) => ({
    addField(data: SnapshotIn<typeof FormField>): void {
      try {
        self.fields.push({ ...data })
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
    validateAgainstEmptyFields(): boolean {
      let errorsExist = false
      self.fields.map((field) => {
        if (!field.filled) {
          field.setError('This field is required')
          errorsExist = true
        }
        return field
      })
      return errorsExist
    },
  }))
  .actions((self) => ({
    clearForm(): void {
      const fieldsToRemove: Instance<typeof FormField> = []
      for (const field of self.fields) {
        field.setValue(null)
        if (
          field.key === FieldKey.PARTNER_INCOME ||
          field.key === FieldKey.PARTNER_BENEFIT_STATUS ||
          field.key === FieldKey.EVER_LIVED_SOCIAL_COUNTRY ||
          field.key === FieldKey.LEGAL_STATUS_OTHER
        ) {
          fieldsToRemove.push(field)
        }
      }
      self.removeFields(fieldsToRemove)

      // remove the now invalid summary object
      const parent = getParent(self) as Instance<typeof RootStore>
      parent.setSummary({})
    },
    clearAllErrors() {
      self.fields.map((field) => field.setError(undefined))
    },
    setupForm(data: FieldData[]): void {
      data.map((fieldData) => {
        let placeholder,
          defaultValue,
          options = undefined

        const field = self.getFieldByKey(fieldData?.key)

        if ('default' in fieldData) {
          defaultValue = fieldData.default
        }

        if ('placeholder' in fieldData) {
          placeholder = fieldData.placeholder
        }

        if ('values' in fieldData) {
          options = fieldData.values
        }

        if (!field) {
          self.addField({
            key: fieldData.key,
            type: fieldData.type,
            label: fieldData.label,
            category: {
              key: fieldData.category.key,
              text: fieldData.category.text,
            },
            order: fieldData.order,
            placeholder: placeholder,
            default: defaultValue,
            options: options,
            value: defaultValue ?? null,
          })
        }
        self.fields.sort((a, b) => a.order - b.order)
      })
    },
    buildQueryStringWithFormData(): string {
      let qs = ''
      for (const field of self.fields) {
        if (!field.value) continue

        // remove masking from currency and use object keys for react-select
        let val = field.sanitizeInput()

        if (qs !== '') qs += '&'
        //encodeURI and fix for encodeURIComponent and circle brackets
        qs += `${field.key}=${fixedEncodeURIComponent(val)}`
      }
      return qs
    },
  }))
  .actions((self) => ({
    sendAPIRequest: flow(function* () {
      // build query  string
      const queryString = self.buildQueryStringWithFormData()

      const apiData = yield fetch(`${self.API_URL}?${queryString}`)
      const data: ResponseSuccess | ResponseError = yield apiData.json()

      if ('error' in data) {
        self.clearAllErrors()
        // validate errors
        for (const d of data.detail) {
          const field = self.getFieldByKey(d.context.key)
          field.setError(d.message)
        }
      } else {
        self.clearAllErrors()
        const parent = getParent(self) as Instance<typeof RootStore>
        parent.setOAS(data.results.oas)
        parent.setGIS(data.results.gis)
        parent.setAFS(data.results.afs)
        parent.setAllowance(data.results.allowance)

        parent.setSummary(data.summary)

        self.removeUnnecessaryFieldsFromForm(data.fieldData)
        self.setupForm(data.fieldData)
      }
    }),
  }))
