import { Instance } from 'mobx-state-tree'
import { SummaryLink } from '../../client-state/store'

export const NeedHelpList: React.VFC<{
  title: string
  links: Instance<typeof SummaryLink>[]
}> = ({ title, links }) => {
  return (
    <div className="fz-10">
      <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 md:max-w-[380px]">
        <h2 className="h2">{title}</h2>
        <ul className="pl-5 list-disc text-content">
          {links &&
            links.map(({ text, url }, index) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  className="text-default-text underline"
                  rel="noreferrer"
                >
                  {text}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
