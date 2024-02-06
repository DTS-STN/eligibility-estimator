/* eslint-disable @next/next/no-img-element */
import React from 'react'

interface ErrorProps {
  id?: string
  errorMessage: string
}

export const Error: React.FC<ErrorProps> = ({ id, errorMessage }) => {
  return (
    <div
      id={`${id}-error`}
      className="relative mt-[1.5px] text-[#D3080C] leading-[26px] font-medium flex"
    >
      <div className="block">
        <span className="iconContainer mr-8" aria-hidden="true">
          <img src="/error.svg" alt={errorMessage} />
        </span>
      </div>
      <div aria-live="assertive" className="errorText text-xl">
        {errorMessage}
      </div>
    </div>
  )
}
