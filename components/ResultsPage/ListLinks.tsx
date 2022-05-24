import { Link as DSLink } from '@dts-stn/decd-design-system'

export const ListLinks: React.VFC<{
  title: string
  links: Array<{ url: string, text: string }>
}> = ({ title, links }) => {

  return (
    <div className="p-4">
      <p className="h4">{title}</p>

      <ul className="pl-5 list-disc text-content">
        {links && links.map(({ text, url }, index) => (
          <li key={index}>
            <DSLink
              id={`link${index}`}
              href={url}
              text={text}
            />
          </li>
        ))}
      </ul>

    </div>
  )
}
