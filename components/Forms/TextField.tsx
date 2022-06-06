import { observer } from 'mobx-react'
import { InputHTMLAttributes } from 'react'
import { useTranslation } from '../Hooks'
import { ErrorLabel } from './validation/ErrorLabel'

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
export const TextField: React.VFC<TextFieldProps> = observer((props) => {
  const { name, label, required, value, placeholder, onChange, error } = props
  const requiredText = useTranslation<string>('required')

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
        <span>{required && <span className="ml-1">{requiredText}</span>}</span>
      </div>
      {error && <ErrorLabel errorMessage={error} />}
      <textarea
        data-testid="text-input"
        className={`form-control text-content ${error ? ' border-danger' : ''}`}
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={value}
        rows={2}
        required={required}
        autoComplete="off"
      />
    </>
  )
})
