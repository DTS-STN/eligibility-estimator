import Link from 'next/link'
import React from 'react'

export const BreadcrumbItem: React.VFC<{
  breadcrumb: { title: string; link: string }
  showDelimiter: boolean
}> = ({ breadcrumb, showDelimiter }) => (
  <li className={`inline-flex items-center`}>
    <Link href={breadcrumb.link} passHref>
      <a className="text-sm text-primary underline inline-flex items-center dark:text-gray-400 dark:hover:text-white ">
        {breadcrumb.title}
      </a>
    </Link>
    {showDelimiter && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 ml-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </li>
)
