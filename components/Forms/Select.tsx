import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from 'react'
import { fieldDefinitions } from '../Tooltip'
import { Tooltip } from '../Tooltip/tooltip'

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  keyforid: string
  label: string
  options: any[]
}
export const Select: React.VFC<SelectProps> = (props) => {
  return (
    <>
      <span className="text-danger">*</span>
      <span className="mb-1.5 font-semibold"> {props.label}</span>
      <span className="text-danger font-bold ml-2">(required)</span>
      <Tooltip text={fieldDefinitions.data[props.keyforid]} />
      <select
        name={props.keyforid}
        id={props.keyforid}
        className="form-control mt-1.5"
        {...props}
      >
        {props.options.map((option, index) => (
          <option key={index} value={option} defaultValue={props.value}>
            {option}
          </option>
        ))}
      </select>
    </>
  )
}
