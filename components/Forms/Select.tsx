import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from 'react'

interface SelectProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  keyForId: string
  label: string
  options: any[]
}
export const Select: React.VFC<SelectProps> = (props) => {
  return (
    <>
      <label htmlFor={props.keyForId}>{props.label}</label>
      <select
        name={props.keyForId}
        id={props.keyForId}
        className="form-control"
        {...props}
      >
        {props.options.map((option, index) => (
          <option key={index} value={option} selected={props.value == option}>
            {option}
          </option>
        ))}
      </select>
    </>
  )
}
