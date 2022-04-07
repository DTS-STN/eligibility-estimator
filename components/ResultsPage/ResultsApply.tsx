import Link from 'next/link'
import { WebTranslations } from '../../i18n/web'
import { EstimationSummaryState } from '../../utils/api/definitions/enums'
import { useStore, useTranslation } from '../Hooks'

export const ResultsApply: React.VFC = () => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <p
        className="!mt-6 !md:mt-8 summary-link"
        dangerouslySetInnerHTML={{ __html: tsln.contactCTA }}
      />
      {root.summary?.nextStepsLinks &&
        root.summary.state !== EstimationSummaryState.UNAVAILABLE && (
          <div className="flex flex-col">
            <h2 className="h2">{tsln.applyHeader}</h2>
            <p>{tsln.applyText}</p>
            {root.summary.nextStepsLinks.map((link, index) => (
              <Link key={index} href={link.url} passHref>
                <a
                  className="btn btn-primary !mt-5 whitespace-normal md:whitespace-nowrap md:px-8 md:max-w-[400px]"
                  target="_blank"
                  role="navigation"
                  aria-label={`${tsln.applyForLabel} ${link.text}`}
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
