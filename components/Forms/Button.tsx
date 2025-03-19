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
  alt?: string
  title?: string
}

type ButtonType = 'submit' | 'reset' | 'button'

const BUTTON_STYLES = {
  primary:
    'text-white visited:text-white bg-[#26374A] hover:bg-[#2B4380] focus:bg-[#0535D2] border-transparent border-[2px]',
  secondary:
    'text-[#2B4380] visited:text-[#2B4380] focus:text-white bg-white hover:bg-[#D7E5F5] focus:bg-[#0535D2] border-[#2B4380] border-[2px]',
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
  alt,
  title,
}) => {
  const btnStyle = BUTTON_STYLES[style]

  const classes = `${btnStyle} ${custom} min-h-[48px] flex flex-row items-center justify-center focus:ring focus:ring-offset-4 ring-[#0E62C9] py-2 px-4 w-fit font-[500] text-[20px] leading-[24px] rounded-md`

  return href ? (
    <Link href={href} locale={locale}>
      <a
        className={classes}
        aria-label={ariaLabel}
        target="_blank"
        title={title}
        {...attributes}
      >
        {imgHref && <img src={imgHref} alt={alt} className="pr-3" />} {text}
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
      {text}
      {imgHref && <img src={imgHref} alt={alt} className="pl-3 w-8 h-8" />}
    </button>
  )
}
