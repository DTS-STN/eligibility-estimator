import type { Instance } from 'mobx-state-tree'
import { InputHTMLAttributes } from 'react'
import type { FormField } from '../../client-state/models/FormField'
import { useTranslation } from '../Hooks'
import { NumberField } from './NumberField'

export interface MonthAndYearProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  subFields?: any
}

export const MonthAndYear: React.VFC<MonthAndYearProps> = ({
  name,
  label,
  helpText,
  subFields,
  placeholder,
  onChange,
}) => {
  const requiredText = useTranslation<string>('required')
  return (
    <>
      <div className="mb-2.5">
        <label
          htmlFor={name}
          aria-label={name}
          data-testid="number-input-label"
          className="text-content font-bold inline mb-2.5"
        >
          {label}
        </label>

        {label && helpText && (
          <div className="ds-font-body ds-text-lg ds-leading-22px ds-font-medium ds-text-multi-neutrals-grey90a ds-mb-4">
            {helpText}
          </div>
        )}
      </div>

      {subFields.map((subField: FormFieldType) => {
        console.log('front end subfield', subField.key)
        return (
          <div key={subField.key}>
            <NumberField
              type={subField.type}
              name={subField.key}
              label={subField.label}
              placeholder={placeholder ?? ''}
              onChange={onChange}
              value={subField.value}
              helpText={subField.helpText}
            />
          </div>
        )
      })}
    </>
  )
}

type FormFieldType = Instance<typeof FormField>
