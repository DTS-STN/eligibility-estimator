import { DetailedHTMLProps, SelectHTMLAttributes, useState } from 'react'
import Select from 'react-select'
import { FieldData, fieldDefinitions } from '../../utils/api/definitions/fields'
import { Tooltip } from '../Tooltip/tooltip'
import {
  buildQueryStringFromFormData,
  retrieveFormData,
} from './ComponentFactory'

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  field: FieldData
  sendAPIRequest: (queryString: string) => void
}

/**
 * A form select field rendered by the component factory. Powered by `react-select`.
 * @param props {SelectProps}
 * @returns
 */
export const FormSelect: React.VFC<SelectProps> = (props) => {
  const { field, sendAPIRequest, name } = props
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
      <div className="w-full md:w-80">
        <Select
          closeMenuOnScroll={false}
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

            const formData = retrieveFormData()
            if (!formData) return

            // react select calls this function THEN updates the internal representation of the form so the form element is always out of sync
            //This just stuff the form with the correct information, overwriting the internal bad state.
            formData.set(field.key, newValue.value)
            const queryString = buildQueryStringFromFormData(formData, true)

            sendAPIRequest(queryString)
          }}
          isSearchable
          isClearable
        />
      </div>
    </>
  )
}
