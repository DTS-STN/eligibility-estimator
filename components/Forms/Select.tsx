import { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import Select, { InputActionMeta } from 'react-select'
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
export const CustomSelect: React.VFC<SelectProps> = (props) => {
  const { field, sendAPIRequest } = props
  const placeholder = (field as any)?.placeholder
  return (
    <>
      <span className="font-semibold inline-block mb-1.5">
        <span className="text-danger">* </span>
        <span className="mb-1.5 font-semibold text-content">{field.label}</span>
        <span className="text-danger font-bold ml-2">(required)</span>
        <Tooltip field={field.key} />
      </span>
      <Select
        styles={{
          container: (styles) => ({
            ...styles,
            width: '320px',
            fontSize: '20px',
          }),
          input: (styles) => ({
            ...styles,
            boxShadow: 'none',
          }),
        }}
        className="rselect"
        isSearchable
        isClearable
        placeholder="Select from..."
        defaultValue={
          placeholder
            ? undefined
            : (field as any).values.map((opt) => ({
                value: opt,
                label: opt,
              }))[0]
        }
        name={field.key}
        options={(field as any).values.map((opt) => ({
          value: opt,
          label: opt,
        }))}
        onChange={(newValue, _action) => {
          if (!newValue) return

          const formData = retrieveFormData()
          if (!formData) return

          // react select calls this function THEN updates the internal representation of the form so the form element is always out of sync
          //This just stuff the form with the correct information, pverwriting the internal bad state.
          formData.set(field.key, newValue.value)
          const queryString = buildQueryStringFromFormData(formData)

          sendAPIRequest(queryString)
        }}
      />
    </>
  )
}
