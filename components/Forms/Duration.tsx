import { FC, InputHTMLAttributes } from 'react'
import { QuestionLabel } from './QuestionLabel'

interface DurationProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  baseOnChange: (newValue: string) => void
  requiredText?: string
  error?: string
}

const Duration: FC<DurationProps> = ({
  name,
  label,
  helpText,
  baseOnChange,
  requiredText,
  error,
}) => {
  const validationClass = !!error
    ? 'ds-border-specific-red-red50b focus:ds-border-multi-blue-blue60f focus:ds-shadow-text-input'
    : 'ds-border-multi-neutrals-grey85a focus:ds-border-multi-blue-blue60f focus:ds-shadow-text-input'

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
          <label className="ds-form-date" htmlFor="duration-years">
            Years
          </label>

          <select
            id="duration-years"
            defaultValue={0}
            onChange={() => console.log('testing select')}
            className={`ds-w-165px ds-py-5px ds-flex ds-px-14px ds-date-text ds-border-1.5 ds-border-multi-neutrals-grey85a ds-rounded ${validationClass}`}
          >
            {[...Array(10).keys()].map((mv, index) => (
              <option value={mv} key={`datePicker-month-option-${index}`}>
                {mv}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:ds-pl-24px ds-pl-8px">
          <label className="ds-form-date" htmlFor="duration-months">
            Months
          </label>

          <select
            id="duration-months"
            defaultValue={0}
            onChange={() => console.log('testing select')}
            className={`ds-w-165px ds-py-5px ds-flex ds-px-14px ds-date-text ds-border-1.5 ds-border-multi-neutrals-grey85a ds-rounded ${validationClass}`}
          >
            {[...Array(10).keys()].map((mv, index) => (
              <option value={mv} key={`datePicker-month-option-${index}`}>
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
