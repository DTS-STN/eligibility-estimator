import { useRouter } from 'next/router'
import { InputHTMLAttributes } from 'react'
import { fieldDefinitions } from '../Tooltip'
import { Tooltip } from '../Tooltip/tooltip'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  keyForId: string
  values: any[]
  label: string
  category: string
}

export const Radio: React.VFC<InputProps> = (props) => {
  const { query } = useRouter()

  return (
    <>
      <div className="radio mb-8" data-category={props.category}>
        <p className="font-semibold inline-block mb-1.5">
          {props.label}
          <span className="text-danger font-bold ml-2">(required)</span>
          <Tooltip text={fieldDefinitions.data[props.keyForId]} />
        </p>
        {props.values.map((value, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`${props.keyForId}-${index}`}
              name={`${props.keyForId}`}
              value={correctForBooleans(value)}
              className="mr-2"
              {...props}
            />
            <label htmlFor={`${props.keyForId}-${index}`} className="radio">
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
