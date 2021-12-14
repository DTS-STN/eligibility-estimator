import { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
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
      <span className="font-semibold inline-block mb-1.5">
        <span className="mb-1.5 font-semibold text-content">
          {' '}
          {props.label}
        </span>
        <span className="text-danger font-bold ml-2">(required)</span>
        <Tooltip field={props.name} />
      </span>
      <select
        name={props.keyforid}
        id={props.keyforid}
        className="form-control mt-1.5 text-content"
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
