import { DetailedHTMLProps, SelectHTMLAttributes, useRef } from 'react'
import Select from 'react-select'
import { FieldData, fieldDefinitions } from '../../utils/api/definitions/fields'
import { Tooltip } from '../Tooltip/tooltip'
import {
  buildQueryStringFromFormData,
  retrieveFormData,
} from './ComponentFactory'
import { ErrorLabel } from './validation/ErrorLabel'
import { observer } from 'mobx-react'
import { Form, FormField } from '../../client-state/store'
import type { Instance } from 'mobx-state-tree'

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  field: FieldData
  sendAPIRequest: (queryString: string) => void
  error?: string
}

/**
 * A form select field rendered by the component factory. Powered by `react-select`.
 * @param props {SelectProps}
 * @returns
 */
export const FormSelect: React.VFC<
  SelectProps & {
    form: Instance<typeof Form>
  }
> = observer((props) => {
  const { field, sendAPIRequest, name, error, form, value } = props
  const defaultValue = (field as any)?.default

  return (
    <>
      <label
        htmlFor={name}
        aria-label={name}
        className="font-semibold inline-block mb-1.5"
      >
        <span className="text-danger">* </span>
        <span className="mb-1.5 font-semibold text-content">{field.label}</span>
        <span className="text-danger font-bold ml-2">(required)</span>
        <Tooltip field={field.key} />
      </label>
      {error && <ErrorLabel errorMessage={error} />}
      <div className="w-full md:w-80">
        <Select
          styles={{
            container: (styles) => ({
              ...styles,
              fontSize: '20px', // tailwind incompatible unfortunately, but since this component is only used here and wrapped as `FormSelect` it should be fine
            }),
            input: (styles) => ({
              ...styles,
              boxShadow: 'none', // remove a blue inset box from react-select
            }),
          }}
          className="rselect"
          placeholder="Select from..."
          defaultValue={
            defaultValue !== undefined
              ? { label: defaultValue, value: defaultValue }
              : undefined
          }
          name={field.key}
          options={(field as any).values.map((opt) => ({
            value: opt,
            label: opt,
          }))}
          onChange={(newValue, action) => {
            if (!newValue) {
              return
            }
            const formField: Instance<typeof FormField> = form.getField(
              field.key
            )
            formField.setValue(newValue.value)

            const formData = retrieveFormData()
            if (!formData) return

            // react select calls this function THEN updates the internal representation of the form so the form element is always out of sync
            //This just stuff the form with the correct information, overwriting the internal bad state.
            formData.set(field.key, newValue.value)
            const queryString = buildQueryStringFromFormData(
              formData,
              form,
              true
            )

            sendAPIRequest(queryString)
          }}
          closeMenuOnScroll={false}
          isSearchable
          isClearable
        />
      </div>
    </>
  )
})
