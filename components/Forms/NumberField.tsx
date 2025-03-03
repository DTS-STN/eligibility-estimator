import { Error } from './Error'
import { InputHTMLAttributes, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { QuestionLabel } from './QuestionLabel'

export interface NumberFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  requiredText?: string
  error?: string
}

/**
 * A form input field rendered by the component factory. If the field is a currency field (income / partner receiving OAS) then use a NumberFormat to render the number masked as a currency
 * Currently support text and number fields
 * @param props {NumberFieldProps}
 * @returns
 */
export const NumberField: React.VFC<NumberFieldProps> = ({
  name,
  label,
  value,
  placeholder,
  onChange,
  helpText,
  requiredText,
  error,
}) => {
  // only need to run this once at component render, so no need for deps
  useEffect(() => {
    // blur the input element on scroll instead of changing the value! Does not affect Keyboard input.
    document.addEventListener('wheel', function (event) {
      const el = document.activeElement as HTMLInputElement
      if (el?.type === 'number') {
        el.blur()
      }
    })
  }, [])

  return (
    <>
      <QuestionLabel
        id={`${name}-label`}
        name={name}
        type="number-input"
        label={label}
        requiredText={requiredText}
        helpText={helpText}
        fieldId={`enter-${name}`}
      />

      <NumberFormat
        id={`enter-${name}`}
        name={name}
        className={`form-control text-content border-form-border w-24 ${
          error ? ' !border-danger' : ''
        }`}
        data-testid="number-input"
        value={value != null ? (value as string) : ''}
        placeholder={placeholder}
        onChange={onChange}
        required
        autoComplete="off"
        enterKeyHint="done"
        allowNegative={false}
        decimalSeparator={null}
        aria-labelledby={`${name}-label`}
        aria-describedby={`help-text-enter-${name}`}
        maxLength={15}
      />

      {error && (
        <div className="mt-2" role="alert">
          <Error errorMessage={error} />
        </div>
      )}
    </>
  )
}
