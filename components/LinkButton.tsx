import { useRouter } from 'next/router'
import Image from 'next/image'
import React, { MouseEventHandler } from 'react'

export const LinkButton: React.FC<{
  text: string
  src?: string
  alt?: string
  handlePrint: MouseEventHandler
}> = ({ text, src, alt, handlePrint }) => {
  return (
    <div className="inline-block">
      <div className="ml-5 flex items-center justify-center">
        <div className="flex items-center justify-center">
          {src && alt && (
            <Image src={`/${src}.png`} alt={alt} width="28" height="28" />
          )}
        </div>
        <div className="pl-1 w-full inline ml-1">
          <span className="ds-font-body ds-text-lg ds-leading-22px ds-font-medium ds-text-multi-blue-blue70b ds-mb-4">
            <button onClick={handlePrint}>{text}</button>
          </span>
        </div>
      </div>
    </div>
  )
}
