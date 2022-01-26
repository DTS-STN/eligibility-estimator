import { Instance } from 'mobx-state-tree'
import { useEffect } from 'react'
import { SummaryLink } from '../../client-state/store'
import { useMediaQuery } from '../Hooks'

export const NeedHelpList: React.VFC<{
  title: string
  links: Instance<typeof SummaryLink>[]
}> = ({ title, links }) => {
  const isMobile = useMediaQuery(992)

  // handler on scroll for sticky need help
  const shouldBeSticky = (e) => {
    const self = document.querySelector('.fixedElement')

    // do not add this behaviour on mobile
    if (isMobile) return

    const scrollTop = window.scrollY
    scrollTop >= 700
      ? self.classList.add('is-sticky')
      : self.classList.remove('is-sticky')
  }

  useEffect(() => {
    window.addEventListener('scroll', shouldBeSticky)
    return () => {
      window.removeEventListener('scroll', shouldBeSticky)
    }
  })

  return (
    <div className="fixedElement">
      <div className="p-8 bg-emphasis rounded mt-8 md:mt-0">
        <h2 className="h2">{title}</h2>
        <ul className="pl-5 list-disc">
          <li>
            <a
              className="text-default-text underline"
              href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
              target="_blank" rel="noreferrer"
            >
              Contact Service Canada
            </a>
          </li>
          {links &&
            links.map(({ text, url }, index) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  className="text-default-text underline" rel="noreferrer"
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
