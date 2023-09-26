import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight as solidChevronRight } from '@fortawesome/free-solid-svg-icons'

export interface BreadcrumbItem {
  text: string
  link: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  locale: string
}

export function Breadcrumb({ locale, items = [] }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumbs">
      <ul className="block text-base font-body mt-6">
        {items.map((item, index) => (
          <li
            key={item.link}
            className="inline-block min-w-0 max-w-full truncate -my-4 px-1"
          >
            <FontAwesomeIcon
              icon={solidChevronRight}
              className={`${
                index === 0 ? 'hidden' : ''
              } h-[8px] w-[8px] py-[2px] pr-[4px]`}
            />
            <Link href={item.link} locale={locale}>
              <a className="font-sans text-[16px] leading-[23px] font-[400] text-[#295376] hover:text-[#0535D2] underline">
                {item.text}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
