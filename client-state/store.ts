import {
  types,
  SnapshotIn,
  Instance,
  flow,
  getParentOfType,
  getSnapshot,
  IMaybe,
  ISimpleType,
  ModelCreationType,
} from 'mobx-state-tree'
import { ExtractCFromProps } from 'mobx-state-tree/dist/internal'
import { ResultKey } from '../utils/api/definitions/enums'
import { FieldData } from '../utils/api/definitions/fields'
import { ResponseError, ResponseSuccess } from '../utils/api/definitions/types'

type FormProgress = {
  income: boolean
  personal: boolean
  legal: boolean
  estimation?: boolean
}

/** API endpoint for eligibility*/
const API_URL = `api/calculateEligibility`

export const FormField = types
  .model({
    key: types.string,
    type: types.string,
    label: types.string,
    category: types.string,
    order: types.number,
    placeholder: types.maybe(types.string),
    default: types.maybe(types.string),
    value: types.maybeNull(types.string),
    options: types.optional(types.array(types.string), []),
    // error on a field
  })
  .views((self) => ({
    get filled() {
      return self.value !== undefined
    },
  }))
  .actions((self) => ({
    setValue(value: string) {
      self.value = value
    },
    clearValue() {
      self.value = null
    },
  }))
  .actions((self) => ({
    handleChange: flow(function* (e) {
      const inputVal = e?.target?.value ?? e.value

      // remove income masking and set field value
      const value = inputVal.replace('$', '').replace(',', '')
      self.setValue(value)

      yield getParentOfType(self, Form).sendAPIRequest()
    }),
  }))

export const Form = types
  .model({
    fields: types.array(FormField),
    // all errors on form
  })
  .views((self) => ({
    fieldsByCategory(category: string): Instance<typeof FormField>[] {
      return self.fields.filter((field) => field.category == category)
    },
    get empty(): boolean {
      return self.fields.length === 0
    },
    get previouslySavedValues(): { key: string; value: string }[] {
      // TODO: remove function, for debugging purposes
      return self.fields.map((field) => ({
        key: field.key,
        value: field.value,
      }))
    },
  }))
  .views((self) => ({
    get progress(): FormProgress {
      const iComplete = self
        .fieldsByCategory('Income Details')
        .every((field) => field.filled)

      const pComplete = [
        ...self.fieldsByCategory('Personal Information'),
        ...self.fieldsByCategory('Partner Details'),
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
      self.fields.push({ ...data })
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
  }))
  .actions((self) => ({
    clearForm(): void {
      for (const field of self.fields) {
        field.clearValue()
      }
    },
    setupForm(data: FieldData[]) {
      data.map((fieldData) => {
        const field = self.getFieldByKey(fieldData?.key)

        const defaultValue = (fieldData as any).default

        if (!field) {
          self.addField({
            key: fieldData.key,
            type: fieldData.type,
            label: fieldData.label,
            category: fieldData.category,
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

        if (qs !== '') qs += '&'
        qs += `${field.key}=${encodeURIComponent(field.value)}`
      }
      return qs
    },
  }))
  .actions((self) => ({
    sendAPIRequest: flow(function* () {
      // build query  string
      const queryString = self.buildQueryStringWithFormData()

      const apiData = yield fetch(`${API_URL}?${queryString}`)
      const data: ResponseSuccess | ResponseError = yield apiData.json()

      if ('error' in data) {
        // validate errors
        console.log(data.error)
      } else {
        const parent = getParentOfType(self, RootStore)
        parent.setOAS(data.oas)
        parent.setGIS(data.gis)
        parent.setAFS(data.afs)
        parent.setAllowance(data.allowance)

        self.removeUnnecessaryFieldsFromForm(data.fieldData)
        self.setupForm(data.fieldData)
      }
    }),
  }))

const Eligibility = types.model({
  eligibilityResult: types.maybe(types.enumeration(Object.values(ResultKey))),
  entitlementResult: types.maybe(types.number),
  reason: types.maybe(types.string),
  detail: types.maybe(types.string),
})

export const OAS = Eligibility.named('OAS')
export const GIS = Eligibility.named('GIS')
export const AFS = Eligibility.named('AFS')
export const Allowance = Eligibility.named('Allowance')

export const RootStore = types
  .model({
    form: Form,
    oas: OAS,
    gis: GIS,
    afs: AFS,
    allowance: Allowance,
    //summary
  })
  .actions((self) => ({
    setOAS(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
      self.oas = OAS.create(input)
    },
    setGIS(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
      self.gis = GIS.create(input)
    },
    setAFS(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
      self.afs = AFS.create(input)
    },
    setAllowance(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
      self.allowance = Allowance.create(input)
    },
  }))
