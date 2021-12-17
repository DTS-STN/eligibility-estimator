import { useRouter } from 'next/router'
import { InputHTMLAttributes, useEffect, useState } from 'react'
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
        <span className="font-semibold inline-block mb-1.5 flex-nowrap">
          <span className="text-danger">*</span>
          <span className="mb-1.5 font-semibold text-content">
            {' '}
            {props.label}
          </span>
          <span className="text-danger font-bold ml-2">(required)</span>
          <Tooltip field={props.name} />
        </span>
        {props.values.map((value, index) => (
          <div key={index} className="flex items-center my-3 md:my-0">
            <input
              type="radio"
              id={`${props.keyforid}-${index}`}
              name={`${props.keyforid}`}
              value={correctForBooleans(value)}
              className="hidden"
              {...props}
            />
            <label
              htmlFor={`${props.keyforid}-${index}`}
              className="radio flex items-center"
            >
              <span className="w-6 h-6 inline-block mr-2 rounded-full border border-grey min-w-[24px]"></span>
              <p>{value}</p>
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
    case 'No':
      return 'false'
    default:
      return value
  }
}
