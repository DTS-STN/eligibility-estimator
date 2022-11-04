import { DatePicker } from '@dts-stn/service-canada-design-system'
import { debounce } from 'lodash'
import { ChangeEvent, InputHTMLAttributes } from 'react'
import { useSessionStorage } from 'react-use'
import { WebTranslations } from '../../i18n/web'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { QuestionLabel } from './QuestionLabel'
import { useTranslation } from '../Hooks'

export interface MonthAndYearProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  baseOnChange: (newValue: string) => void
  requiredText?: string
}

interface IAgeDateInput {
  month: number
  year: number
}

export const MonthAndYear: React.VFC<MonthAndYearProps> = ({
  name,
  label,
  helpText,
  baseOnChange,
  requiredText,
}) => {
  const tsln = useTranslation<WebTranslations>()

  const [dateInput, setDateInput]: [
    IAgeDateInput,
    (value: IAgeDateInput) => void
  ] = useSessionStorage(`dateInput-${name}`, { month: 1, year: undefined })

  const dateOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const fieldId = e.target.id
    const fieldToSet = fieldId === 'datePickerYear' ? 'year' : 'month'
    const newDate: IAgeDateInput = {
      ...dateInput,
      [fieldToSet]: Number(e.target.value),
    }
    setDateInput(newDate)
    if (newDate.year && newDate.month)
      baseOnChange(
        String(BenefitHandler.calculateAge(newDate.month, newDate.year))
      )
  }

  return (
    <>
      <QuestionLabel
        name={name}
        type="date"
        label={label}
        requiredText={requiredText}
        helpText={helpText}
      />
      <DatePicker
        id={`enter-${name}`}
        month={dateInput.month}
        year={dateInput.year}
        hasDay={false}
        onMonthChange={dateOnChange}
        onYearChange={debounce(dateOnChange, 500)}
        lang={tsln._language}
      />
    </>
  )
}
