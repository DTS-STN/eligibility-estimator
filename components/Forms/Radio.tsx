import { useRouter } from 'next/router'
import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  keyForId: string
  values: any[]
  label: string
}

export const Radio: React.VFC<InputProps> = (props) => {
  const { query } = useRouter()
  return (
    <>
      <div className="radio mb-8">
        <p className="font-bold">
          {props.label}
          <span className="text-danger font-bold ml-2">(required)</span>
        </p>
        {props.values.map((value, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`${props.keyForId}-${index}`}
              name={`${props.keyForId}`}
              value={value}
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
