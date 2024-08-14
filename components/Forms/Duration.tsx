import { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { QuestionLabel } from './QuestionLabel'
import { MonthsYears } from '../../utils/api/definitions/types'

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
  console.log('age', age)
  console.log('ageDate', ageDate)
  const tsln = useTranslation<WebTranslations>()
  const [durationInput, setDurationInput] = useState(null)
  const [resideny, setResidency] = useState(null) // TODO: if residency is known, we need to base drop down year/month on age of eligibility, not just age in July 2013. For now assume minimum required 10 years

  const calculate2013Age = (ageDateObj) => {
    const { month, year } = ageDateObj

    let yearsDifference = 2013 - year
    let monthsDifference = 7 - month

    if (monthsDifference < 0) {
      yearsDifference -= 1
      monthsDifference += 12
    }

    const age = yearsDifference + monthsDifference / 12
    return parseFloat(age.toFixed(2))
  }

  const getMaxYears = (ageJ2013) => {
    let years
    if (ageJ2013 < 65) {
      const diff = Number(age) <= 70 ? Number(age) - 65 : 5
      years = Math.floor(diff)
    } else if (ageJ2013 >= 70) {
      years = 0
    } else {
      // between ages 65 and 70 in July 2013
      years = Math.floor(70 - ageJ2013)
    }

    return years
  }

  const ageJuly2013 = calculate2013Age(ageDate)
  const maxYears = getMaxYears(ageJuly2013)

  // Returns num of months for select option
  const getMaxMonths = () => {
    let months
    if (ageJuly2013 < 65) {
      const birthMonth = ageDate.month
      const today = new Date()
      const month = today.getMonth() + 1

      let monthsDiff = month - birthMonth
      if (monthsDiff < 0) monthsDiff += 12
      months = monthsDiff
    } else if (ageJuly2013 >= 70) {
      months = 0
    } else {
      months = Math.round((Math.ceil(ageJuly2013) - ageJuly2013) * 12)
    }

    return months
  }

  const getSelectOptions = (maxMonths = 11) => {
    let years = maxYears
    let months = maxMonths
    if (ageJuly2013 >= 70) {
      years = 0
      months = 0
    }

    if (durationInput?.years === maxYears) {
      const maxMonths = getMaxMonths()
      if (durationInput?.months > maxMonths) {
        const newDuration = { ...durationInput, months: 0 }
        setDurationInput(newDuration)
        baseOnChange(JSON.stringify(newDuration))
      }
    }

    console.log('years', years)
    console.log('months', months)
    return { years, months }
  }
  const [selectOptions, setSelectOptions] = useState(getSelectOptions())

  // Duration input
  useEffect(() => {
    if (name in sessionStorage) {
      setDurationInput(JSON.parse(sessionStorage.getItem(name)))
    } else {
      setDurationInput({ months: 0, years: 0 })
    }
  }, [])

  useEffect(() => {
    setSelectOptions(getSelectOptions())
    if (durationInput?.years === maxYears) {
      const maxMonths = getMaxMonths()
      setSelectOptions(getSelectOptions(maxMonths))
      if (durationInput?.months > maxMonths) {
        setDurationInput({ ...durationInput, months: 0 })
      }
    }

    if (durationInput?.years > maxYears) {
      setDurationInput({ months: 0, years: 0 })
    }

    sessionStorage.setItem(name, JSON.stringify(durationInput))
    if (durationInput) {
      baseOnChange(JSON.stringify(durationInput))
    }
  }, [age, durationInput, ageDate])

  const validationClass = !!error
    ? 'border-specific-red-red50b focus:border-multi-blue-blue60f focus:shadow-text-input'
    : 'border-multi-neutrals-grey85a focus:border-multi-blue-blue60f focus:shadow-text-input'

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
      <div className="datePicker relative flex">
        <div className="flex flex-col">
          <label className="form-date" htmlFor={`${name}-years`}>
            {tsln.duration.years}
          </label>

          <select
            id={`${name}-years`}
            value={durationInput?.years || 0}
            onChange={(e) => durationOnChange(e)}
            className={`w-20 py-[5px] flex px-[14px] ds-date-text ds-border-1.5 border-multi-neutrals-grey85a rounded ${validationClass}`}
          >
            {[...Array(selectOptions['years'] + 1).keys()].map((mv, index) => (
              <option value={mv} key={`${name}-years-option-${index}`}>
                {mv}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:pl-[24px] pl-[8px]">
          <label className="form-date" htmlFor={`${name}-months`}>
            {tsln.duration.months}
          </label>

          <select
            id={`${name}-months`}
            value={durationInput?.months || 0}
            onChange={(e) => durationOnChange(e)}
            className={`w-20 py-[5px] flex px-[14px] ds-date-text ds-border-1.5 border-multi-neutrals-grey85a rounded ${validationClass}`}
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
