import Link from 'next/link'
import { useLayoutEffect } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useStore, useTranslation } from '../Hooks'

export const ContactCTA: React.VFC = () => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()

  const handleClick = () => {
    root.setActiveTab(2)
  }

  useLayoutEffect(() => {
    const self = document.querySelectorAll('#faqLink a')[1]
    if (!self) return

    self.addEventListener('click', handleClick)
    return () => self && self.removeEventListener('click', handleClick)
  })

  return (
    <>
      <p
        id="faqLink"
        className="!mt-6 !md:mt-8 summary-link"
        dangerouslySetInnerHTML={{ __html: tsln.contactCTA }}
      />
      {root.summary?.nextStepsLinks && (
        <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 mt-4 justify-center">
          {root.summary.nextStepsLinks.map((link, index) => (
            <Link key={index} href={link.url} passHref>
              <a
                className="btn btn-primary !mt-5 whitespace-normal md:whitespace-nowrap md:min-w-min md:px-8"
                target="_blank"
              >
                {link.text}
              </a>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
