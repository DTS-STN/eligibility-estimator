import { DatePicker } from '@dts-stn/decd-design-system'
import { InputHTMLAttributes, useState } from 'react'

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
