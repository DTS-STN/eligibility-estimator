import { flow, getParent, Instance, types } from 'mobx-state-tree'
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
          // income handling
          val = self.value
            .toString()
            .replaceAll(' ', '')
            .replace(/(\d+),(\d+)\$/, '$1.$2') // replaces commas with decimals, but only in French!
            .replaceAll(',', '')
            .replaceAll('$', '')
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
      yield (getParent(self, 2) as Instance<typeof Form>).sendAPIRequest() // the form field is 2 children from the form e.g. Form -> fields Object -> current form field instance
    }),
  }))
