import { InputHTMLAttributes } from 'react'
import { Tooltip } from '../Tooltip/tooltip'
import { fieldDefinitions } from '../Tooltip/index'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  extraClasses?: string
}

export const Input: React.VFC<InputProps> = (props) => {
  return (
    <div className={`${props.extraClasses}`}>
      <label
        htmlFor={props.name}
        data-testid="input-label"
        className="text-content font-bold mb-12"
      >
        {props.required && <span className="text-danger">*</span>} {props.label}
        {props.required && (
          <span className="text-danger font-bold ml-2">(required)</span>
        )}
        <Tooltip text={fieldDefinitions.data[props.name]} />
      </label>
      <input
        name={props.name}
        data-testid={props.name}
        {...props}
        className="form-control text-black"
      />
    </div>
  )
}
