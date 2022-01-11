import {
  types,
  flow,
  getParentOfType,
  Instance,
  SnapshotIn,
} from 'mobx-state-tree'
import { FieldCategory } from '../../utils/api/definitions/enums'
import { FieldData, FieldKey } from '../../utils/api/definitions/fields'
import {
  ResponseSuccess,
  ResponseError,
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

/** API endpoint for eligibility*/
const API_URL = `api/calculateEligibility`

export const Form = types
  .model({
    fields: types.array(FormField),
  })
  .views((self) => ({
    get hasErrors() {
      return self.fields.some((field) => field.hasError)
    },
    fieldsByCategory(category: string): Instance<typeof FormField>[] {
      return self.fields.filter((field) => field.category.key == category)
    },
    get empty(): boolean {
      return self.fields.length === 0
    },
    get previouslySavedValues(): { key: string; value: string }[] {
      return self.fields.map((field) => ({
        key: field.key,
        value: field.value,
      }))
    },
  }))
  .views((self) => ({
    get progress(): FormProgress {
      const iComplete = self
        .fieldsByCategory(FieldCategory.INCOME_DETAILS)
        .every((field) => field.filled)

      const pComplete = [
        ...self.fieldsByCategory(FieldCategory.PERSONAL_INFORMATION),
        ...self.fieldsByCategory(FieldCategory.PARTNER_DETAILS),
      ].every((field) => field.filled)

      const lComplete = self
        .fieldsByCategory('Legal Status')
        .every((field) => field.filled)

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
          field.key === FieldKey.PARTNER_RECEIVING_OAS ||
          field.key === FieldKey.EVER_LIVED_SOCIAL_COUNTRY ||
          field.key === FieldKey.LEGAL_STATUS_OTHER
        ) {
          fieldsToRemove.push(field)
        }
      }
      self.removeFields(fieldsToRemove)

      // remove the now invalid summary object
      const parent = getParentOfType(self, RootStore)
      parent.setSummary({})
    },
    clearAllErrors() {
      self.fields.map((field) => field.setError(undefined))
    },
    setupForm(data: FieldData[]): void {
      data.map((fieldData) => {
        const field = self.getFieldByKey(fieldData?.key)

        const defaultValue = (fieldData as any).default

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
            placeholder: (fieldData as any).placeholder,
            default: (fieldData as any).default,
            options: (fieldData as any).values,
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
      console.log(queryString)

      const apiData = yield fetch(`${API_URL}?${queryString}`)
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
        console.log(data)
        const parent = getParentOfType(self, RootStore)
        parent.setOAS(data.oas)
        parent.setGIS(data.gis)
        parent.setAFS(data.afs)
        parent.setAllowance(data.allowance)

        parent.setSummary(data.summary)

        self.removeUnnecessaryFieldsFromForm(data.fieldData)
        self.setupForm(data.fieldData)
      }
    }),
  }))
