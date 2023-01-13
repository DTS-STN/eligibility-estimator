import { DatePicker, FormError } from '@dts-stn/service-canada-design-system'
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
  error?: string
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
  error,
}) => {
  const tsln = useTranslation<WebTranslations>()

  const [dateInput, setDateInput]: [
    IAgeDateInput,
    (value: IAgeDateInput) => void
  ] = useSessionStorage(`dateInput-${name}`, { month: 1, year: undefined })

  const dateOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const fieldId = e.target.id
    let fieldToSet = ''
    if (fieldId === `${name}-birth-year`) {
      fieldToSet = 'year'
    } else if (fieldId === `${name}-birth-month`) {
      fieldToSet = 'month'
    }

    const newDate: IAgeDateInput = {
      ...dateInput,
      [fieldToSet]: Number(e.target.value),
    }
    setDateInput(newDate)
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
        yearId={`${name}-birth-year`}
        monthId={`${name}-birth-month`}
      />

      {error && (
        <div className="mt-2">
          <FormError errorMessage={error} />
        </div>
      )}
    </>
  )
}
