import { fill } from 'lodash'
import {
  types,
  SnapshotIn,
  Instance,
  flow,
  getParentOfType,
  IMaybe,
  ISimpleType,
  ModelCreationType,
} from 'mobx-state-tree'
import { ExtractCFromProps } from 'mobx-state-tree/dist/internal'
import { ResultKey } from '../utils/api/definitions/enums'
import { FieldData } from '../utils/api/definitions/fields'

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

export const Form = types
  .model({
    fields: types.array(FormField),
    // all errors on form
  })
  .views((self) => ({
    fieldsByCategory(category: string) {
      return self.fields.filter((field) => field.category == category)
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
    getField(key: string): Instance<typeof FormField> {
      return self.fields.find((field) => field.key == key)
    },
    addField(data: SnapshotIn<typeof FormField>) {
      self.fields.push({ ...data })
    },
    removeAllFields() {
      self.fields.clear()
    },
  }))
  .actions((self) => ({
    clearForm() {
      for (const field of self.fields) {
        field.clearValue()
      }
    },
    setupForm(data: FieldData[]) {
      data.map((field) => {
        const fieldExists = self.getField(field.key)

        if (!fieldExists)
          self.addField({
            key: field.key,
            type: field.type,
            label: field.label,
            category: field.category,
            order: field.order,
            placeholder: (field as any).placeholder,
            options: (field as any).values,
          })
      })
    },
    buildQueryStringWithFormData(): string {
      let qs = ''
      for (const field of self.fields) {
        if (field.value == undefined) continue

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
      const data = yield apiData.json()

      const parent = getParentOfType(self, RootStore)
      parent.setOAS(data.oas)
      parent.setGIS(data.gis)
      parent.setAFS(data.afs)
      parent.setAllowance(data.allowance)
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
