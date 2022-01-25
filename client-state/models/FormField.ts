import { types, flow, getParent, Instance } from 'mobx-state-tree'
import { FieldKey } from '../../utils/api/definitions/fields'
import { Form } from './Form'

export const KeyValue = types.model({
  key: types.string,
  text: types.string,
})

export const Category = KeyValue.named('Category')
export const Options = KeyValue.named('Options')
export const Default = KeyValue.named('Default')

export const FormField = types
  .model({
    key: types.string,
    type: types.string,
    label: types.string,
    category: Category,
    order: types.number,
    placeholder: types.maybe(types.string),
    default: types.maybe(Default),
    value: types.maybeNull(types.union(types.string, KeyValue)),
    options: types.optional(types.array(Options), []),
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
    sanitizeInput() {
      let val = ''

      if (KeyValue.is(self.value)) {
        val = self.value.key
      } else {
        if (self.value.includes('$')) {
          val = self.value.toString().replaceAll('$', '').replaceAll(',', '')
        } else {
          val = self.value.toString()
        }
      }

      return val
    },
  }))
  .actions((self) => ({
    handleChange: flow(function* (e) {
      const inputVal = e?.target?.value ?? { key: e.value, text: e.label }
      self.setValue(inputVal)
      yield (getParent(self) as Instance<typeof Form>).sendAPIRequest()
    }),
  }))
