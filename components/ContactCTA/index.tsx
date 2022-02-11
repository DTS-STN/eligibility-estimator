import Link from 'next/link'
import { WebTranslations } from '../../i18n/web'
import { useStore, useTranslation } from '../Hooks'

export const ContactCTA: React.VFC = () => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()
  return (
    <>
      <p
        className="!mt-6 !md:mt-8 summary-link"
        dangerouslySetInnerHTML={{ __html: tsln.contactCTA }}
      ></p>
      {root.summary?.nextStepsLink?.url && (
        <>
          <Link href={root.summary.nextStepsLink.url} passHref>
            <a className="btn btn-primary w-min" target="_blank">
              {root.summary.nextStepsLink.text}
            </a>
          </Link>
        </>
      )}
    </>
  )
}
