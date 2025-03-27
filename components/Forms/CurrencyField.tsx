import { useRouter } from 'next/router'
import { InputHTMLAttributes, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import { TooltipTranslation } from '../../i18n/tooltips'
import { Language } from '../../utils/api/definitions/enums'
import { Error } from './Error'
import { QuestionLabel } from './QuestionLabel'
import { sanitizeCurrency } from './validation/utils'

export interface CurrencyFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  requiredText?: string
  error?: string
  dynamicContent?: TooltipTranslation
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
  dynamicContent,
}) => {
  const locale = useRouter().locale
  const [fieldValue, setFieldValue] = useState(value)

  const localizedIncome =
    locale == Language.EN
      ? { thousandSeparator: ',', decimalSeparator: '.' }
      : { thousandSeparator: ' ', decimalSeparator: ',' }

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

    let stringValue = String(fieldValue)

    // Remove trailing decimal if present
    if (stringValue.endsWith('.')) {
      stringValue = stringValue.slice(0, -1)
    }

    return stringValue + (regex.test(stringValue) ? '0' : '')
  }

  return (
    <div>
      <QuestionLabel
        id={`${name}-label`}
        name={name}
        type="currency-input"
        label={label}
        requiredText={requiredText}
        helpText={helpText}
        fieldId={`enter-${name}`}
        dynamicContent={dynamicContent}
      />

      <div
        className="flex items-center space-x-2"
        aria-labelledby={`${name}-label`}
      >
        {locale === Language.EN && (
          <span id={`${name}-currency-symbol`} className="text-content">
            $
          </span>
        )}
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
          required={requiredText ? true : false}
          autoComplete="off"
          enterKeyHint="done"
          allowNegative={false}
          decimalScale={2}
          onBlur={() => setFieldValue(getFieldValue())}
          maxLength={locale == Language.EN ? 15 : 16}
          aria-label={`${label} ${
            locale === Language.EN
              ? 'Enter amount in dollars'
              : 'Entrez le montant en dollars'
          }`}
          aria-describedby={
            locale === Language.EN ? `${name}-currency-symbol` : undefined
          }
          isAllowed={(values) => {
            const { formattedValue } = values
            return !(
              formattedValue.startsWith('.') || formattedValue.startsWith(',')
            )
          }}
        />
        {locale !== Language.EN && (
          <span id={`${name}-currency-symbol`} className="text-content">
            $
          </span>
        )}
      </div>

      {error && (
        <div className="mt-2" role="alert">
          <Error id={name} errorMessage={error} />
        </div>
      )}
    </div>
  )
}
