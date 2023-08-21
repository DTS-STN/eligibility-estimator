import { useState, useEffect } from 'react'
import { FormDatePicker } from '@dts-stn/service-canada-design-system'
import { debounce } from 'lodash'
import { ChangeEvent, InputHTMLAttributes } from 'react'
import { WebTranslations } from '../../i18n/web'
import { calculateAge } from '../../utils/api/helpers/utils'
import { QuestionLabel } from './QuestionLabel'
import { useTranslation } from '../Hooks'
import Age from './Age'
import { getMinBirthYear } from '../../utils/api/definitions/schemas'

export interface MonthAndYearProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  age: string
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
  age,
  label,
  helpText,
  baseOnChange,
  requiredText,
  error,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const [dateInput, setDateInput] = useState(null)
  const ageValid =
    age &&
    age !== '0' &&
    !error &&
    Number(age) >= 18 &&
    Number(age) <= getMinBirthYear()

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
    if (name === 'partnerAge' && error !== undefined && error.length > 0) {
      setDateInput({ month: 1, year: undefined })
    }
  }, [name])

  const dateOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const fieldId = e.target.id
    let fieldToSet = ''
    if (fieldId === `${name}-birth-year`) {
      fieldToSet = 'year'
    } else if (fieldId === `${name}-birth-month`) {
      fieldToSet = 'month'
    }

    const limit = 15
    const newDate: IAgeDateInput = {
      ...dateInput,
      [fieldToSet]: Number(e.target.value.slice(0, limit)),
    }
    setDateInput(newDate)

    const ageObj = {
      value: String(calculateAge(newDate.month, newDate.year)),
      date: newDate,
    }
    baseOnChange(JSON.stringify(ageObj))
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
        <div className="flex flex-row flex-wrap gap-y-4">
          <div className="flex-auto">
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
          </div>
          {ageValid && (
            <div className="flex-auto m-auto">
              <Age age={age} name={name} />
            </div>
          )}
        </div>
      )}
    </fieldset>
  )
}
