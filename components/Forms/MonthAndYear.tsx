import { useState, useEffect } from 'react'
import { FormDatePicker } from '@dts-stn/service-canada-design-system'
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
  const [dateInput, setDateInput] = useState(null)

  useEffect(() => {
    if (`dateInput-${name}` in sessionStorage) {
      setDateInput(JSON.parse(sessionStorage.getItem(`dateInput-${name}`)))
    } else {
      setDateInput({ month: 1, year: undefined })
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(`dateInput-${name}`, JSON.stringify(dateInput))
  }, [dateInput])

  useEffect(() => {
    if (name === 'partnerAge' && error !== undefined)
      setDateInput({ month: 1, year: undefined })
  }, [name])

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
    <fieldset>
      <legend>
        <QuestionLabel
          name={name}
          type="date"
          label={label}
          requiredText={requiredText}
          helpText={helpText}
          fieldId={`enter-${name}`}
        />
      </legend>
      {dateInput && (
        <FormDatePicker
          id={`enter-${name}`}
          month={dateInput.month}
          year={dateInput.year}
          hasDay={false}
          onMonthChange={dateOnChange}
          onYearChange={debounce(dateOnChange, 500)}
          lang={tsln._language}
          yearId={`${name}-birth-year`}
          monthId={`${name}-birth-month`}
          hasError={!!error}
          formErrorProps={{ id: 'formErrorId', errorMessage: error }}
        />
      )}
    </fieldset>
  )
}
