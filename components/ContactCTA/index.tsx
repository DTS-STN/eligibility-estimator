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
      {root.summary?.nextStepsLink?.url && (
        <>
          <h2 className="h2 mt-8">{tsln.nextSteps}</h2>
          <Link href={root.summary.nextStepsLink.url} passHref>
            <a className="btn btn-primary w-min !mt-4" target="_blank">
              {root.summary.nextStepsLink.text}
            </a>
          </Link>
        </>
      )}
    </>
  )
}
