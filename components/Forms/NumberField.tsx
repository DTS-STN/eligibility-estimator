import { observer } from 'mobx-react'
import { InputHTMLAttributes, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { useTranslation } from '../Hooks'
import { Tooltip } from '../Tooltip/tooltip'
import { ErrorLabel } from './validation/ErrorLabel'

export interface NumberFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  error?: string
}

/**
 * A form input field rendered by the component factory. If the field is a currency field (income / partner receiving OAS) then use a NumberFormat to render the number masked as a currency
 * Currently support text and number fields
 * @param props {NumberFieldProps}
 * @returns
 */
export const NumberField: React.VFC<NumberFieldProps> = observer((props) => {
  const {
    name,
    label,
    required,
    value,
    placeholder,
    onChange,
    helpText,
    error,
  } = props
  const requiredText = useTranslation<string>('required')

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
      <div className="mb-2.5">
        <label
          htmlFor={name}
          aria-label={name}
          data-testid="number-input-label"
          className="text-content font-bold inline mb-2.5"
        >
          {label}
        </label>
        {helpText && (
          <div className="ds-font-body ds-text-lg ds-leading-22px ds-font-medium ds-text-multi-neutrals-grey90a ds-mb-4">
            {helpText}
          </div>
        )}
      </div>
      {error && <ErrorLabel errorMessage={error} />}
      <NumberFormat
        id={name}
        name={name}
        className={`form-control text-content border-form-border ${
          error ? ' border-danger' : ''
        }`}
        data-testid="number-input"
        min={0}
        value={value != null ? (value as string) : ''}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        autoComplete="off"
        enterKeyHint="done"
      />
    </>
  )
})
