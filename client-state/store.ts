import { types, SnapshotIn, Instance } from 'mobx-state-tree'
import { FieldData } from '../utils/api/definitions/fields'

export const FormField = types
  .model({
    key: types.string,
    type: types.string,
    label: types.string,
    category: types.string,
    order: types.number,
    placeholder: types.maybe(types.string),
    value: types.maybe(types.string),
    // error on a field
  })
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
          })
      })
    },
    buildQueryStringWithFormData(): string {
      let qs = ''
      for (const field of self.fields) {
        if (qs !== '') qs += '&'
        qs += `${field.key}=${field.value}`
      }
      return ''
    },
  }))

export const RootStore = types.model({
  form: Form,
})
