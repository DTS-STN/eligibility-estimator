import { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import Select from 'react-select'
import { FormField } from '../../client-state/FormField'
import { KeyAndText } from '../../i18n/api'
import { FieldType } from '../../utils/api/definitions/fields'
import { QuestionLabel } from './QuestionLabel'

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  field: FormField
  error?: string
  requiredText?: string
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
  requiredText,
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

  console.log('current item', currentItemKeyText)

  const currentItem = {
    label: currentItemKeyText.text,
    value: currentItemKeyText.key,
  }

  return (
    <>
      <QuestionLabel
        id={`${name}-label`}
        name={name}
        type="select"
        label={field.config.label}
        requiredText={requiredText}
        fieldId={`${name}-select`}
      />
      <div className="w-full md:w-80 datePicker">
        <select
          id={`${name}-select`}
          className="inputStyles w-[320px] bg-white"
          aria-labelledby={`${name}-label`}
          placeholder={placeholder}
          data-testid="select"
          name={field.key}
          onChange={customOnChange}
          value={currentItem.value}
        >
          {field.config.values.map((opt) => (
            <option value={opt.key} key={opt.key}>
              {opt.text}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
