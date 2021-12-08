import { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  keyForId: string
  values: any[]
  label: string
}

export const Radio: React.VFC<InputProps> = ({ keyForId, values, label }) => (
  <>
    <div className="radio mb-8">
      <p className="font-bold">
        {label}
        <span className="text-danger font-bold ml-2">(required)</span>
      </p>
      {values.map((value, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`${keyForId}-${index}`}
            name={`${keyForId}`}
            className="mr-2"
          />
          <label htmlFor={`${keyForId}-${index}`} className="radio">
            {value}
          </label>
        </div>
      ))}
    </div>
  </>
)
