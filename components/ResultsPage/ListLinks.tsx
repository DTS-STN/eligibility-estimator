import { Link as DSLink } from '@dts-stn/service-canada-design-system'

export const ListLinks: React.VFC<{
  title: string
  links: Array<{ url: string; text: string }>
}> = ({ title, links }) => {
  return (
    <div className="p-4 mt-5">
      <p className="h4">{title}</p>

      <ul className="pl-[2.5rem] list-disc text-content">
        {links &&
          links.map(({ text, url }, index) => (
            <li key={index}>
              <DSLink id={`Link$`} href={url} text={text} />
            </li>
          ))}
      </ul>
    </div>
  )
}
