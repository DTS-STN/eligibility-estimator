import Link from 'next/link'

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
              <Link href={url}>
                <a
                  id={`Link${index}`}
                  className="underline text-[#284162] text-[20px] leading-[22px] hover:text-[#0535D2]"
                >
                  {text}
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}
