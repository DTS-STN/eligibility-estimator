import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight as solidChevronRight } from '@fortawesome/free-solid-svg-icons'

interface BreadcrumbItem {
  text: string
  link: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumbs">
      <ul className="block text-base font-body">
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
            <Link href={item.link}>
              <a className="text-sm text-[#295376] hover:text-[#0535D2] text-canada-footer-font visited:text-purple-700 underline">
                {item.text}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
