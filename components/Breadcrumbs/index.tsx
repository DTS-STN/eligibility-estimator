import { BreadcrumbItem } from './BreadcrumbItem'

export const Breadcrumbs: React.VFC<{ items: string[] }> = ({ items }) => {
  return (
    <nav className="flex mt-10" aria-label="Breadcrumb">
      <ol className="inline-flex flex-col md:flex-row items-start md:items-center space-x-1 md:space-x-3">
        {items.map((breadcrumb, index) => (
          <BreadcrumbItem
            key={index}
            showDelimiter={index > 0}
            breadcrumb={`${breadcrumb}`}
          />
        ))}
      </ol>
    </nav>
  )
}
