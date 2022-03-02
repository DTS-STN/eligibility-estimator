import { observer } from 'mobx-react'
import { InputHTMLAttributes, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { useTabIndex } from 'react-tabindex'
import { useTranslation } from '../Hooks'
import { Tooltip } from '../Tooltip/tooltip'
import { ErrorLabel } from './validation/ErrorLabel'

export interface CurrencyFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  error?: string
}

/**
 * A form input field rendered by the component factory. If the field is a currency field (income / partner receiving OAS) then use a NumberFormat to render the number masked as a currency
 * Currently support text and number fields
 * @param props {CurrencyFieldProps}
 * @returns
 */
export const CurrencyField: React.VFC<CurrencyFieldProps> = observer(
  (props) => {
    const { name, label, required, value, placeholder, onChange, error } = props
    const requiredText = useTranslation<string>('required')
    const tabIndex = useTabIndex()

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
      <div>
        <label
          htmlFor={name}
          aria-label={name}
          data-testid="currency-input-label"
          className="text-content font-semibold inline-block mb-1.5"
        >
          {required && <span className="text-danger">*</span>} {label}
          <div>
            {required && (
              <span className="text-danger font-semibold ml-2">
                ({requiredText})
              </span>
            )}
            <Tooltip field={name} />
          </div>
        </label>
        {error && <ErrorLabel errorMessage={error} />}

        <NumberFormat
          id={name}
          name={name}
          data-testid="currency-input"
          thousandSeparator={true}
          prefix="$"
          className={`form-control text-content border-[#333] ${
            error ? ' border-danger' : ''
          }`}
          min={0}
          value={value != null ? (value as string) : ''}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          autoComplete="off"
          tabIndex={tabIndex}
        />
      </div>
    )
  }
)
