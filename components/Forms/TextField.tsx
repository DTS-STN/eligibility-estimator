import { FormError } from '@dts-stn/service-canada-design-system'
import { InputHTMLAttributes } from 'react'

export interface TextFieldProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label: string
  error?: string
}

/**
 * A form input field rendered by the component factory. If the field is a currency field (income / partner receiving OAS) then use a NumberFormat to render the number masked as a currency
 * Currently support text and number fields
 * @param props {TextFieldProps}
 * @returns
 */
export const TextField: React.VFC<TextFieldProps> = ({
  name,
  label,
  value,
  placeholder,
  onChange,
  error,
}) => {
  return (
    <>
      <div className="mb-2 5">
        <label
          htmlFor={name}
          aria-label={name}
          data-testid="text-input-label"
          className="text-content font-bold inline mb-2.5"
        >
          {label}
        </label>
      </div>
      {error && (
        <div className="mt-2" role="alert">
          <FormError errorMessage={error} />
        </div>
      )}
      <textarea
        data-testid="text-input"
        className={`form-control text-content ${error ? ' border-danger' : ''}`}
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={value}
        rows={2}
        required
        autoComplete="off"
      />
    </>
  )
}
