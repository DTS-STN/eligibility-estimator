import { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import Select from 'react-select'
import { FormField } from '../../client-state/FormField'
import { KeyAndText } from '../../i18n/api'
import { FieldType } from '../../utils/api/definitions/fields'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  field: FormField
  error?: string
  customOnChange
}

/**
 * A form select field rendered by the component factory. Powered by `react-select`.
 * @param props {SelectProps}
 * @returns
 */
export const FormSelect: React.VFC<SelectProps> = ({
  field,
  name,
  customOnChange,
  error,
  placeholder,
}) => {
  if (!('default' in field.config))
    throw new Error('wrong field type encountered')
  if (!('values' in field.config))
    throw new Error('wrong field type encountered')
  if (typeof field.config.default === 'string')
    throw new Error('wrong field type encountered')

  const currentItemKeyText: KeyAndText = field.config.values.find(
    (item) => item.key === field.value
  )

  const currentItem = {
    label: currentItemKeyText.text,
    value: currentItemKeyText.key,
  }

  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <div className="mb-2 5">
        <label
          htmlFor={name}
          aria-label={name}
          data-testid="select-label"
          className="inline mb-2.5"
        >
          <span className="mb-1.5 font-bold text-content">
            {field.config.label}
          </span>
        </label>
        <span className="ds-inline ds-text-error-border-red ds-text-xl ds-font-medium pl-2">
          ({tsln.required})
        </span>
      </div>
      <div className="w-full md:w-80">
        <Select
          inputId={name}
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
              opacity:
                field.config.type == FieldType.DROPDOWN_SEARCHABLE ? 1 : 0,
            }),
          }}
          className="rselect"
          placeholder={placeholder}
          data-testid="select"
          value={currentItem}
          name={field.key}
          options={field.config.values.map((opt) => ({
            value: opt.key,
            label: opt.text,
          }))}
          onChange={async (newValue: { value: string; label: string }) => {
            customOnChange(newValue)
          }}
          closeMenuOnScroll={false}
          isSearchable={
            field.config.type !== FieldType.DROPDOWN_SEARCHABLE
              ? undefined
              : true
          }
        />
      </div>
    </>
  )
}
