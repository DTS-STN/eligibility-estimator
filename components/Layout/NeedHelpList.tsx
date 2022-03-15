import { Instance } from 'mobx-state-tree'
import { useLayoutEffect } from 'react'
import { SummaryLink } from '../../client-state/store'
import { useStore } from '../Hooks'

export const NeedHelpList: React.VFC<{
  title: string
  links: Instance<typeof SummaryLink>[]
}> = ({ title, links }) => {
  const root = useStore()

  // scan for a link with "#faqLink" and once found, block the link and set the active tab
  useLayoutEffect(() => {
    const allLinks = document.querySelectorAll('a')
    for (const link of allLinks) {
      if (link.outerHTML.includes('#faqLink')) {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          root.setActiveTab(2)
        })
        return
      }
    }
  })

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
