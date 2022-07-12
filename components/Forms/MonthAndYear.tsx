import { DatePicker } from '@dts-stn/decd-design-system'
import type { Instance } from 'mobx-state-tree'
import { InputHTMLAttributes, useState } from 'react'
import type { FormField } from '../../client-state/models/FormField'
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
  const [dateInput] = useState({ month: 'January', year: undefined })

  const customOnChange = (e) => {
    const fieldId = e.target.id
    const fieldToSet = fieldId === 'datePickerYear' ? 'year' : 'month'
    dateInput[fieldToSet] = e.target.value
    if (dateInput.year && dateInput.month)
      console.log('gotta push the change to api now:', dateInput)
    else console.log('not pushing change')
  }

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

      <DatePicker
        // formErrorProps={{
        //   errorMessage: 'This is how form error will be displayed',
        //   id: 'formErrorId',
        // }}
        formLabelProps={{
          helpText,
          // id: 'requiredWithInfo',
          // infoText:
          //   'Required label style with information icon. You can hide by clicking on icon again.',
          label,
          // required: true,
        }}
        hasDay={false}
        // hasError={false}
        hasLabel
        id="DatePicker"
        // maxYear={2050}
        // minYear={1999}
        // onDayChange={function noRefCheck() {}}
        onMonthChange={customOnChange}
        onYearChange={customOnChange}
      />
    </>
  )
}

type FormFieldType = Instance<typeof FormField>
