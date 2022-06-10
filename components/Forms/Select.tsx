import { observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import Select from 'react-select'
import { FormField } from '../../client-state/models/FormField'
import { FieldType } from '../../utils/api/definitions/fields'
import { useTranslation } from '../Hooks'
import { Tooltip } from '../Tooltip/tooltip'
import { ErrorLabel } from './validation/ErrorLabel'

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
export const FormSelect: React.VFC<SelectProps> = observer(
  ({ field, name, error, placeholder }) => {
    const requiredText = useTranslation<string>('required')
    const defaultValue = field.value ?? field.default

    const stateValue =
      field.value !== null && field.value !== ''
        ? { label: field.value.text, value: field.value.text }
        : null

    return (
      <>
        <div className="mb-2 5">
          <label
            htmlFor={name}
            aria-label={name}
            data-testid="select-label"
            className="inline mb-2.5"
          >
            <span className="mb-1.5 font-bold text-content">{field.label}</span>
          </label>
          <span>
            <span className="ml-1">({requiredText})</span>
          </span>
        </div>
        <div className="w-full md:w-80">
          <Select
            aria-labelledby={name}
            styles={{
              container: (styles) => ({
                ...styles,
                fontSize: '20px', // tailwind incompatible unfortunately, but since this component is only used here and wrapped as `FormSelect` it should be fine
                border: error ? '1px solid red' : '1px solid #6f6f6f',
                borderRadius: '4px',
              }),
              control: (styles) => ({
                ...styles,
                border: 'none',
              }),
              dropdownIndicator: (styles) => ({
                ...styles,
                color: '#333',
                paddingRight: '6px',
              }),
              clearIndicator: (styles) => ({
                ...styles,
                color: '#333',
                paddingRight: '6px',
              }),
              input: (styles) => ({
                ...styles,
                boxShadow: 'none', // remove a blue inset box from react-select
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                opacity: field.key == FieldType.DROPDOWN_SEARCHABLE ? 1 : 0,
              }),
            }}
            className="rselect"
            placeholder={placeholder}
            data-testid="select"
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
            isSearchable={
              field.type !== FieldType.DROPDOWN_SEARCHABLE ? undefined : true
            }
            isClearable={
              field.type !== FieldType.DROPDOWN_SEARCHABLE ? undefined : true
            }
          />
        </div>
      </>
    )
  }
)
