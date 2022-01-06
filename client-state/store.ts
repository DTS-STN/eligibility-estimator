import { types, SnapshotIn } from 'mobx-state-tree'
import { FieldData } from '../utils/api/definitions/fields'

const FormField = types
  .model({
    key: types.string,
    type: types.string,
    label: types.string,
    category: types.string,
    order: types.number,
    placeholder: types.maybe(types.string),
    value: types.maybe(types.string),
  })
  .actions((self) => ({
    clearValue() {
      self.value = null
    },
  }))

const Form = types
  .model({
    fields: types.array(FormField),
  })
  .actions((self) => ({
    addField(data: SnapshotIn<typeof FormField>) {
      self.fields.push({ ...data })
    },
  }))
  .actions((self) => ({
    /**
     * clears all field values in a form
     */
    clear() {
      for (const field of self.fields) {
        field.clearValue()
      }
    },
    setupForm(data: any[]) {
      data.map((field) =>
        self.addField({
          key: field.key,
          type: field.type,
          label: field.label,
          category: field.category,
          order: field.order,
          placeholder: (field as any).placeholder,
        })
      )
    },
  }))

export const RootStore = types.model({
  form: Form,
})
