import { FormError } from '@dts-stn/service-canada-design-system'
import { useRouter } from 'next/router'
import { useState, InputHTMLAttributes, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { Language } from '../../utils/api/definitions/enums'
import { QuestionLabel } from './QuestionLabel'
import { Tooltip } from '../Tooltip/tooltip'
import { sanitizeCurrency } from './validation/utils'
import { set } from 'lodash'

export interface CurrencyFieldProps
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
 * @param props {CurrencyFieldProps}
 * @returns
 */
export const CurrencyField: React.VFC<CurrencyFieldProps> = ({
  name,
  label,
  value,
  placeholder,
  onChange,
  helpText,
  requiredText,
  error,
}) => {
  const locale = useRouter().locale
  const [fieldValue, setFieldValue] = useState(value)

  const localizedIncome =
    locale == Language.EN
      ? { thousandSeparator: ',', prefix: '$', decimalSeparator: '.' }
      : { thousandSeparator: ' ', suffix: ' $', decimalSeparator: ',' }

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

  const handleOnChange = (e) => {
    setFieldValue(sanitizeCurrency(e.target.value, locale))
    onChange(e)
  }

  const getFieldValue = () => {
    const regex = /\d+\.\d{1}$/
    if (!fieldValue) return ''
    return fieldValue + (regex.test(fieldValue as string) ? '0' : '')
  }

  return (
    <div>
      <QuestionLabel
        name={name}
        type="currency-input"
        label={label}
        requiredText={requiredText}
        helpText={helpText}
        fieldId={`enter-${name}`}
      />

      <Tooltip field={name} />

      <NumberFormat
        id={`enter-${name}`}
        name={name}
        {...localizedIncome}
        data-testid="currency-input"
        className={`form-control text-content border-form-border w-44 ${
          error ? ' !border-danger' : ''
        }`}
        value={getFieldValue()}
        isNumericString={true}
        placeholder={placeholder}
        onChange={(e) => handleOnChange(e)}
        required
        autoComplete="off"
        enterKeyHint="done"
        allowNegative={false}
        decimalScale={2}
        onBlur={() => setFieldValue(getFieldValue())}
        maxLength={locale == Language.EN ? 15 : 16}
      />

      {error && (
        <div className="mt-2" role="alert">
          <FormError errorMessage={error} />
        </div>
      )}
    </div>
  )
}
