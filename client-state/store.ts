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
import {
  ExtractCFromProps,
  IArrayType,
  IModelType,
  _NotCustomized,
} from 'mobx-state-tree/dist/internal'
import {
  EstimationSummaryState,
  FieldCategory,
  ResultKey,
} from '../utils/api/definitions/enums'
import { FieldData, FieldKey } from '../utils/api/definitions/fields'
import { ResponseError, ResponseSuccess } from '../utils/api/definitions/types'
import { fixedEncodeURIComponent } from '../utils/web/helpers/utils'

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
    error: types.maybe(types.string),
  })
  .views((self) => ({
    get filled() {
      return (
        self.value !== undefined && self.value !== null && self.value !== ''
      )
    },
    get hasError() {
      return self.error !== undefined
    },
  }))
  .actions((self) => ({
    setValue(value: string) {
      self.value = value
    },
    setError(error: string) {
      self.error = error
    },
    clearValue() {
      self.value = null
    },
  }))
  .actions((self) => ({
    handleChange: flow(function* (e) {
      const inputVal = e?.target?.value ?? e.value
      self.setValue(inputVal)
      yield getParentOfType(self, Form).sendAPIRequest()
    }),
  }))

export const Form = types
  .model({
    fields: types.array(FormField),
  })
  .views((self) => ({
    get hasErrors() {
      return self.fields.some((field) => field.hasError)
    },
    fieldsByCategory(category: string): Instance<typeof FormField>[] {
      return self.fields.filter((field) => field.category == category)
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
          field.key === FieldKey.EVER_LIVED_SOCIAL_COUNTRY
        ) {
          fieldsToRemove.push(field)
        }
      }
      self.removeFields(fieldsToRemove)
    },
    clearAllErrors() {
      self.fields.map((field) => field.setError(undefined))
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

        let val = ''
        // remove masking from currency
        if (
          field.key == FieldKey.INCOME ||
          field.key == FieldKey.PARTNER_INCOME
        ) {
          val = field.value.toString().replace('$', '').replace(',', '')
        } else {
          val = field.value.toString()
        }

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

export const SummaryLink = types.model({
  url: types.string,
  text: types.string,
  order: types.number,
})

export const Summary = types.model({
  state: types.maybe(types.enumeration(Object.values(EstimationSummaryState))),
  details: types.maybe(types.string),
  title: types.maybe(types.string),
  links: types.maybe(types.array(SummaryLink)),
})

export const RootStore = types
  .model({
    form: Form,
    oas: OAS,
    gis: GIS,
    afs: AFS,
    allowance: Allowance,
    summary: Summary,
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
    setSummary(
      input: ModelCreationType<
        ExtractCFromProps<{
          state: IMaybe<ISimpleType<EstimationSummaryState>>
          details: IMaybe<ISimpleType<string>>
          title: IMaybe<ISimpleType<string>>
          links: IMaybe<
            IArrayType<
              IModelType<
                {
                  url: ISimpleType<string>
                  text: ISimpleType<string>
                  order: ISimpleType<number>
                },
                {},
                _NotCustomized,
                _NotCustomized
              >
            >
          >
        }>
      >
    ) {
      self.summary = Summary.create(input)
    },
  }))
