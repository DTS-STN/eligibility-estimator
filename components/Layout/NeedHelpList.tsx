import { Instance } from 'mobx-state-tree'
import { useEffect, useRef } from 'react'
import { SummaryLink } from '../../client-state/store'
import { useMediaQuery } from '../Hooks'

export const NeedHelpList: React.VFC<{
  title: string
  links: Instance<typeof SummaryLink>[]
}> = ({ title, links }) => {
  const ref = useRef<HTMLDivElement>()
  const isMobile = useMediaQuery(992)

  // handler on scroll for sticky need help
  const shouldBeSticky = (e) => {
    const self = document.querySelector('.fixedElement')
    if (!self) return

    // do not add this behaviour on mobile
    if (isMobile) return

    const data = ref.current ? ref.current.getBoundingClientRect() : null

    if (data) {
      self.setAttribute('style', `left: ${data.x.toString()}px`)

      const scrollTop = window.scrollY
      scrollTop >= 700
        ? self.classList.add('is-sticky')
        : self.classList.remove('is-sticky')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', shouldBeSticky)
    return () => {
      window.removeEventListener('scroll', shouldBeSticky)
    }
  })

  return (
    <div className="fixedElement z-10" ref={ref}>
      <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 max-w-[380px]">
        <h2 className="h2">{title}</h2>
        <ul className="pl-5 list-disc">
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
