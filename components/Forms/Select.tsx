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
      <span className="mb-1.5 font-semibold">{props.label}</span>
      <span className="text-danger font-bold ml-2">(required)</span>
      <select
        name={props.keyForId}
        id={props.keyForId}
        className="form-control mt-1.5"
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
