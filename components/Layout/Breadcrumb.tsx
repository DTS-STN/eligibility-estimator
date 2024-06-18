import React from 'react'
import Link from 'next/link'

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
            className="inline-block min-w-0 max-w-full truncate -my-4"
          >
            <Link href={item.link} locale={locale}>
              <a className="font-sans text-[16px] leading-[23px] font-[400] !text-[#295376] hover:text-[#0535D2] underline">
                {item.text}
              </a>
            </Link>

            {index < items.length - 1 && (
              <span className="ml-2 mr-1 inline-block align-middle text-multi-blue-blue70b icoxxxn-cheveron-right">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  id={`chevron-${index}`}
                  src={'/chevron-right.svg'}
                  alt=""
                />
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
