import Link from 'next/link'
import React from 'react'

interface ButtonProps {
  id?: string
  style: 'primary' | 'secondary' | 'supertask' | 'danger' | 'link'
  custom?: string
  href?: string
  imgHref?: string
  text: string
  type?: ButtonType
  locale?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  ariaLabel?: string
  attributes?: any
}

type ButtonType = 'submit' | 'reset' | 'button'

const BUTTON_STYLES = {
  primary: 'text-white bg-[#26374A] hover:bg-[#1C578A] focus:bg-[#0E62C9]',
  secondary:
    'text-[#335075] bg-[#EAEBED] hover:bg-[#CFD1D5] focus:bg-[#CFD1D5]',
  supertask: 'text-white bg-[#318000] hover:bg-[#1D4D00] focus:bg-[#1D4D00]',
  danger: 'text-white bg-[#BC3331] hover:bg-[#942826] focus:bg-[#942826]',
  link: 'text-[#2B4380] hover:text-[#0535D2] focus:text-[#0535D2]n hover:underline focus:underline',
}

export const Button: React.FC<ButtonProps> = ({
  id,
  style,
  custom = '',
  href,
  imgHref,
  text,
  type = 'button',
  locale,
  onClick,
  disabled,
  ariaLabel,
  attributes,
}) => {
  const btnStyle = BUTTON_STYLES[style]

  const classes = `${btnStyle} ${custom} flex flex-row focus:ring focus:ring-offset-4 ring-[#0E62C9] py-2 px-4 rounded-sm w-fit font-lato font-[400] text-[20px] leading-[33px]`

  return href ? (
    <Link href={href} locale={locale}>
      <a className={classes} aria-label={ariaLabel} {...attributes}>
        {imgHref && <img src={imgHref} alt="alt" className="pr-3" />} {text}
      </a>
    </Link>
  ) : (
    <button
      id={id}
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      {...attributes}
    >
      {imgHref && <img src={imgHref} alt="alt" className="pr-3" />}
      {text}
    </button>
  )
}
