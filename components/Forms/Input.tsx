import { InputHTMLAttributes, useEffect, WheelEvent } from 'react'
import NumberFormat from 'react-number-format'
import { Tooltip } from '../Tooltip/tooltip'
import { ErrorLabel } from './validation/ErrorLabel'
import { observer } from 'mobx-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  error?: string
}

/**
 * A form input field rendered by the component factory. If the field is a currency field (income / partner receiving OAS) then use a NumberFormat to render the number masked as a currency
 * Currently support text and number fields
 * @param props {InputProps}
 * @returns
 */
export const Input: React.VFC<InputProps> = observer((props) => {
  const { name, label, required, value, placeholder, onChange, error } = props
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
      <label
        htmlFor={name}
        aria-label={name}
        data-testid="input-label"
        className="text-content font-bold"
      >
        {required && <span className="text-danger">*</span>} {label}
        {required && (
          <span className="text-danger font-bold ml-2">(required)</span>
        )}
        <Tooltip field={name} />
      </label>
      {error && <ErrorLabel errorMessage={error} />}
      {name == 'income' || name == 'partnerIncome' ? (
        <NumberFormat
          name={name}
          thousandSeparator={true}
          prefix="$"
          className="form-control text-content"
          data-testid={name}
          min={0}
          value={value as string}
          placeholder={placeholder}
          onChange={onChange}
        />
      ) : (
        <input
          name={name}
          data-testid={name}
          {...props}
          value={value as string}
          min={0}
          className="form-control text-content"
        />
      )}
    </>
  )
})
