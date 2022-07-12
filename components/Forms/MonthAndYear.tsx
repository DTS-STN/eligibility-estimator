import { DatePicker } from '@dts-stn/decd-design-system'
import { debounce } from 'lodash'
import { ChangeEvent, InputHTMLAttributes, useState } from 'react'
import { BenefitHandler } from '../../utils/api/benefitHandler'

export interface MonthAndYearProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  baseOnChange: (newValue: string) => void
}

export const MonthAndYear: React.VFC<MonthAndYearProps> = ({
  name,
  label,
  helpText,
  baseOnChange,
}) => {
  const [dateInput]: [
    { month: number; year: number },
    (value: { month: number; year: number }) => void
  ] = useState({
    month: 1,
    year: undefined,
  })

  const dateOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const fieldId = e.target.id
    const fieldToSet = fieldId === 'datePickerYear' ? 'year' : 'month'
    dateInput[fieldToSet] = Number(e.target.value)
    if (dateInput.year && dateInput.month)
      baseOnChange(
        String(BenefitHandler.calculateAge(dateInput.month, dateInput.year))
      )
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
        id={name}
        // maxYear={2050}
        // minYear={1999}
        // onDayChange={function noRefCheck() {}}
        onMonthChange={dateOnChange}
        onYearChange={debounce(dateOnChange, 500)}
      />
    </>
  )
}
