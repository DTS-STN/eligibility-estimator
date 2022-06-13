import { Link as DSLink } from '@dts-stn/decd-design-system'
import { Instance } from 'mobx-state-tree'
import { useEffect } from 'react'
import { SummaryLink } from '../../client-state/store'
import { useStore } from '../Hooks'

export const NeedHelp: React.VFC<{
  title: string
  links: Instance<typeof SummaryLink>[]
}> = ({ title, links }) => {
  const root = useStore()

  // scan for a link with "#faqLink" and once found, block the link and scroll to faq
  useEffect(() => {
    const allLinks = document.querySelectorAll('a')
    for (const link of allLinks) {
      if (link.outerHTML.includes('#faqLink')) {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          document.getElementById('faqLink').scrollIntoView()
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
                <DSLink
                  id={`helpLink${index}`}
                  href={url}
                  text={text}
                  target="_blank"
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
