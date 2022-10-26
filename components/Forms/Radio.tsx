import { InputHTMLAttributes } from 'react'
import { TypedKeyAndText } from '../../i18n/api'
import { Tooltip } from '../Tooltip/tooltip'
import { ErrorLabel } from './validation/ErrorLabel'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  keyforid: string
  values: TypedKeyAndText<string>[]
  label: string
  checkedValue?: string
  helpText?: string
  error?: string
  requiredText?: string
  setValue(value: string): void
}

/**
 * A form input radio field that is rendered by the component factory.
 * @param props {InputProps}
 * @returns
 */
export const Radio: React.VFC<InputProps> = ({
  name,
  label,
  checkedValue,
  onChange,
  values,
  keyforid,
  helpText,
  error,
  requiredText,
  setValue,
}) => {
  return (
    <div className="radio">
      <fieldset>
        <legend className="mb-2.5">
          <label
            htmlFor={name}
            aria-label={name}
            data-testid="radio-label"
            className="inline flex-nowrap text-content font-bold"
          >
            <span
              className="mb-1.5 text-content font-bold question-link"
              dangerouslySetInnerHTML={{ __html: label }}
            />
            <span className="ml-2 font-medium">{requiredText}</span>
          </label>
        </legend>
        {helpText && (
          <div
            className="ds-font-body ds-text-lg ds-leading-22px ds-font-medium ds-text-multi-neutrals-grey90a ds-mb-4"
            dangerouslySetInnerHTML={{ __html: helpText }}
          />
        )}

        <Tooltip field={name} />

        {error && <ErrorLabel errorMessage={error} />}
        {values.map((val, index) => (
          <div
            key={index}
            id={`${name}-r${index}`}
            className="flex items-center mb-2 md:mb-[12px] last:mb-0"
          >
            <input
              type="radio"
              data-testid="radio"
              id={`${keyforid}-${index}`}
              name={`${keyforid}`}
              value={val.key}
              onChange={onChange}
              checked={checkedValue === correctForBooleans(val.key)}
            />
            <label
              htmlFor={`${keyforid}-${index}`}
              className="flex items-center focus:inherit text-content hover:cursor-pointer"
            >
              {val.text}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  )
}

const correctForBooleans = (value: string) => {
  switch (value) {
    case 'Yes':
      return 'true'
    case 'No':
      return 'false'
    case 'Oui':
      return 'true'
    case 'Non':
      return 'false'
    default:
      return value
  }
}
