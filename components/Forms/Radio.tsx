import { FormError } from '@dts-stn/service-canada-design-system'
import { InputHTMLAttributes } from 'react'
import { TypedKeyAndText } from '../../i18n/api'
import { Tooltip } from '../Tooltip/tooltip'
import { QuestionLabel } from './QuestionLabel'

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
        {/* <QuestionLabel
          name={name}
          type="radio"
          label={label}
          requiredText={requiredText}
          helpText={helpText}
        /> */}
        <legend
          className="text-content font-bold inline mb-2.5 mr-2"
          data-testid="radio-legend"
        >
          <span dangerouslySetInnerHTML={{ __html: label }} />
          {requiredText && <span className="font-medium"> {requiredText}</span>}
        </legend>

        <Tooltip field={name} />

        {/* {error && <ErrorLabel errorMessage={error} />} */}

        <div role="radiogroup">
          {values.map((val, index) => (
            <span
              key={index}
              id={`${name}-${index}`}
              className="flex items-center mb-2 md:mb-[12px] last:mb-0 hover:cursor-pointer"
              aria-labelledby={`${keyforid}-lbl-${index}`}
              aria-checked={checkedValue === correctForBooleans(val.key)}
              tab-index={index}
              role="radio"
            >
              <input
                className="hover:cursor-pointer"
                type="radio"
                data-testid="radio"
                id={`${keyforid}-rad-${index}`}
                name={`${keyforid}`}
                value={val.key}
                onChange={onChange}
                checked={checkedValue === correctForBooleans(val.key)}
              />
              <span
                id={`${keyforid}-lbl-${index}`}
                className="flex items-center focus:inherit text-content hover:cursor-pointer"
                dangerouslySetInnerHTML={{ __html: val.text }}
              />
            </span>
          ))}
        </div>
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
