import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useStore, useTranslation } from '../Hooks'

export const ContactCTA: React.VFC = () => {
  const router = useRouter()
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()

  const handleFaqClick = () => {
    root.setActiveTab(2)
  }

  useLayoutEffect(() => {
    const self = document.querySelectorAll('#faqLink a')[1]
    if (!self) return

    self.addEventListener('click', handleFaqClick)
    return () => self && self.removeEventListener('click', handleFaqClick)
  })

  return (
    <>
      <p
        id="faqLink"
        className="!mt-6 !md:mt-8 summary-link"
        dangerouslySetInnerHTML={{ __html: tsln.contactCTA }}
      />

      {root.summary?.nextStepsLinks && (
        <div className="flex flex-col">
          {root.summary.nextStepsLinks.map((link, index) => (
            <>
              {index == 0 && (
                <>
                  <h2 className="h2">{tsln.applyHeader}</h2>
                  <p>{tsln.applyText}</p>
                </>
              )}
              <Link key={index} href={link.url} passHref>
                <a
                  className="btn btn-primary !mt-5 whitespace-normal md:whitespace-nowrap md:px-8 md:max-w-[400px]"
                  target="_blank"
                  role="navigation"
                  aria-label={link.text} // TODO: Are we making the Apply for change? If not can delete
                >
                  {link.text}
                </a>
              </Link>
            </>
          ))}
        </div>
      )}
    </>
  )
}
