import { DetailedHTMLProps, SelectHTMLAttributes, useRef } from 'react'
import Select from 'react-select'
import { Tooltip } from '../Tooltip/tooltip'
import { ErrorLabel } from './validation/ErrorLabel'
import { observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import { FormField } from '../../client-state/models/FormField'
import { FieldKey } from '../../utils/api/definitions/fields'

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  field: Instance<typeof FormField>
  error?: string
}

/**
 * A form select field rendered by the component factory. Powered by `react-select`.
 * @param props {SelectProps}
 * @returns
 */
export const FormSelect: React.VFC<SelectProps> = observer((props) => {
  const { field, name, error } = props
  const defaultValue = field.value ?? field.default

  const stateValue =
    field.value !== null && field.value !== ''
      ? { label: field.value.text, value: field.value.text }
      : null

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
              border: error ? '1px solid red' : undefined,
              borderRadius: '4px',
            }),
            input: (styles) => ({
              ...styles,
              boxShadow: 'none', // remove a blue inset box from react-select
            }),
            indicatorSeparator: (styles) => ({
              ...styles,
              display: field.key == FieldKey.MARITAL_STATUS ? 'none' : 'block',
            }),
          }}
          className="rselect"
          placeholder="Select from..."
          value={stateValue}
          defaultValue={
            defaultValue !== undefined
              ? { label: defaultValue.text, value: defaultValue.key }
              : undefined
          }
          name={field.key}
          options={field.options.map((opt) => ({
            value: opt.key,
            label: opt.text,
          }))}
          onChange={async (newValue: { value: string; label: string }) => {
            if (!newValue) {
              field.clearValue()
              return
            }
            field.handleChange(newValue)
          }}
          closeMenuOnScroll={false}
          isSearchable={field.key == FieldKey.MARITAL_STATUS ? false : true}
          isClearable={field.key == FieldKey.MARITAL_STATUS ? false : true}
        />
      </div>
    </>
  )
})
