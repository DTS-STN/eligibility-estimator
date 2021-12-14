import { useRouter } from 'next/router'
import { InputHTMLAttributes } from 'react'
import { fieldDefinitions } from '../Tooltip'
import { Tooltip } from '../Tooltip/tooltip'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  keyforid: string
  values: any[]
  label: string
  category: string
}

export const Radio: React.VFC<InputProps> = (props) => {
  const { query } = useRouter()

  return (
    <>
      <div className="radio mb-8" data-category={props.category}>
        <span className="font-semibold inline-block mb-1.5">
          <span className="text-danger">*</span>
          <span className="mb-1.5 font-semibold text-content">
            {' '}
            {props.label}
          </span>
          <span className="text-danger font-bold ml-2">(required)</span>
          <Tooltip text={fieldDefinitions.data[props.keyforid]} />
        </span>
        {props.values.map((value, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`${props.keyforid}-${index}`}
              name={`${props.keyforid}`}
              value={correctForBooleans(value)}
              className="mr-2 text-content focus:ring-content"
              {...props}
            />
            <label htmlFor={`${props.keyforid}-${index}`} className="radio">
              {value}
            </label>
          </div>
        ))}
      </div>
    </>
  )
}

const correctForBooleans = (value: string) => {
  switch (value) {
    case 'Yes':
      return 'true'
      break
    case 'No':
      return 'false'
      break
    default:
      return value
      break
  }
}
