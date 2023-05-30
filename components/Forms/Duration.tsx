import { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { QuestionLabel } from './QuestionLabel'
import { MonthsYears } from '../../utils/api/definitions/types'
import { useSessionStorage } from 'react-use'

interface DurationProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  baseOnChange: (newValue: string) => void
  requiredText?: string
  error?: string
  age: string
  ageDate: { month: number; year: number }
}

const Duration: FC<DurationProps> = ({
  name,
  label,
  helpText,
  baseOnChange,
  requiredText,
  error,
  age,
  ageDate,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const [durationInput, setDurationInput] = useState(null)

  const diff = Number(age) <= 70 ? Number(age) - 65 : 5
  const maxYears = Math.floor(diff)

  // Returns num of months for select option
  const getMaxMonths = (age) => {
    const birthMonth = ageDate.month
    const today = new Date()
    const month = today.getMonth() + 1

    let monthsDiff = month - birthMonth
    if (monthsDiff < 0) monthsDiff += 12

    return age < 70 ? monthsDiff : 0
  }

  // Dynamically populate select options. Return object that represents years and months away from age 65 but upto 70
  const getSelectOptions = (maxMonths = 11) => {
    if (durationInput?.years === maxYears) {
      const maxMonths = getMaxMonths(age)
      if (durationInput?.months > maxMonths) {
        setDurationInput({ ...durationInput, months: 0 })
      }
    }

    return { years: maxYears, months: maxMonths }
  }
  const [selectOptions, setSelectOptions] = useState(getSelectOptions())

  // Duration input
  useEffect(() => {
    if (name in sessionStorage) {
      setDurationInput(JSON.parse(sessionStorage.getItem(name)))
    } else {
      setDurationInput({ months: 0, years: 0 })
    }

    return () => {
      sessionStorage.setItem(name, JSON.stringify({ months: 0, years: 0 }))
    }
  }, [])

  useEffect(() => {
    setSelectOptions(getSelectOptions())
    if (durationInput?.years === maxYears) {
      const maxMonths = getMaxMonths(age)
      setSelectOptions(getSelectOptions(maxMonths))
      if (durationInput?.months > maxMonths) {
        setDurationInput({ ...durationInput, months: 0 })
      }
    }

    if (durationInput?.years > maxYears) {
      setDurationInput({ months: 0, years: 0 })
    }

    sessionStorage.setItem(name, JSON.stringify(durationInput))
  }, [age, durationInput, ageDate])

  const validationClass = !!error
    ? 'ds-border-specific-red-red50b focus:ds-border-multi-blue-blue60f focus:ds-shadow-text-input'
    : 'ds-border-multi-neutrals-grey85a focus:ds-border-multi-blue-blue60f focus:ds-shadow-text-input'

  const durationOnChange = (e): void => {
    const fieldId = e.target.id

    let fieldToSet = ''
    if (fieldId === `${name}-years`) {
      fieldToSet = 'years'
    } else if (fieldId === `${name}-months`) {
      fieldToSet = 'months'
    }

    const newDuration: MonthsYears = {
      ...durationInput,
      [fieldToSet]: Number(e.target.value),
    }

    setDurationInput(newDuration)
    baseOnChange(JSON.stringify(newDuration))
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
      <div className="datePicker ds-relative ds-flex">
        <div className="flex flex-col">
          <label className="ds-form-date" htmlFor={`${name}-years`}>
            {tsln.duration.years}
          </label>

          <select
            id={`${name}-years`}
            value={durationInput?.years || 0}
            onChange={(e) => durationOnChange(e)}
            className={`w-20 ds-py-5px ds-flex ds-px-14px ds-date-text ds-border-1.5 ds-border-multi-neutrals-grey85a ds-rounded ${validationClass}`}
          >
            {[...Array(selectOptions['years'] + 1).keys()].map((mv, index) => (
              <option value={mv} key={`${name}-years-option-${index}`}>
                {mv}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:ds-pl-24px ds-pl-8px">
          <label className="ds-form-date" htmlFor={`${name}-months`}>
            {tsln.duration.months}
          </label>

          <select
            id={`${name}-months`}
            value={durationInput?.months || 0}
            onChange={(e) => durationOnChange(e)}
            className={`w-20 ds-py-5px ds-flex ds-px-14px ds-date-text ds-border-1.5 ds-border-multi-neutrals-grey85a ds-rounded ${validationClass}`}
          >
            {[...Array(selectOptions['months'] + 1).keys()].map((mv, index) => (
              <option value={mv} key={`${name}-years-option-${index}`}>
                {mv}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  )
}

export default Duration
