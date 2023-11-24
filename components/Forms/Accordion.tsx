/* eslint-disable @next/next/no-img-element */
import React from 'react'

interface AccordionProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  onClick,
}) => {
  return (
    <div className="mb-2 px-4 bg-emphasis">
      <button
        className="flex justify-between items-center w-full py-[20px] text-[#284162] text-[16px] font-bold leading-[20px]"
        onClick={onClick}
      >
        {title}
        <img alt="" src={isOpen ? '/arrowUp.svg' : '/arrowDown.svg'} />
      </button>
      {isOpen && <div className="w-full pb-2">{children}</div>}
    </div>
  )
}
