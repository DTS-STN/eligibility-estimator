import Link from 'next/link'

export const BreadcrumbItem: React.VFC<{
  breadcrumb: string
  showDelimiter: boolean
}> = ({ breadcrumb, showDelimiter }) => (
  <li
    data-delimiter=">"
    className={`inline-flex items-center ${
      showDelimiter && `before:content-[attr(data-delimiter)] before:px-3`
    }`}
  >
    <Link href="/" passHref>
      <a className="text-sm text-primary underline inline-flex items-center dark:text-gray-400 dark:hover:text-white ">
        {breadcrumb}
      </a>
    </Link>
  </li>
)
