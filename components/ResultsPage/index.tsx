import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { WebTranslations } from '../../i18n/web'
import { EstimationSummaryState } from '../../utils/api/definitions/enums'
import { ConditionalLinks } from '../ConditionalLinks'
import { ContactCTA } from '../ContactCTA'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import { NeedHelpList } from '../Layout/NeedHelpList'
import { ResultsTable } from '../ResultsTable'

export const ResultsPage: React.VFC = () => {
  const ref = useRef<HTMLDivElement>()
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)
  const root = useStore()

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2">
          <h2 className="h2">{root.summary.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: root.summary.details }} />
        </div>
        <div className="col-span-1">
          <NeedHelpList
            title={tsln.needHelp}
            links={root.summary.needHelpLinks}
          />
        </div>
      </div>
      {root.summary.state &&
        root.summary.state !== EstimationSummaryState.MORE_INFO && (
          <>
            {root.summary.state === EstimationSummaryState.UNAVAILABLE ? (
              <div
                className={`mt-10 w-full relative ${
                  !isMobile ? 'h-[450px]' : 'h-[180px]'
                }`}
              >
                <Image
                  src={'/people.png'}
                  layout="fill"
                  alt={tsln.unavailableImageAltText}
                />
              </div>
            ) : (
              <ResultsTable />
            )}
            {root.summary.state !== EstimationSummaryState.UNAVAILABLE && (
              <ContactCTA />
            )}
            <p>{tsln.modifyAnswersText}</p>
            <Link href="/eligibility" passHref={true}>
              <button className="btn btn-default md:w-48 mt-6">
                {tsln.modifyAnswers}
              </button>
            </Link>
            {root.summary?.moreInfoLinks?.length && (
              <ConditionalLinks links={root.summary.moreInfoLinks} />
            )}
          </>
        )}
    </div>
  )
}

/**
 * @param element The *div element* to check against the document viewport
 * @returns whether or not the element is in the viewport
 */
const isElementInViewport = (element: HTMLDivElement): boolean => {
  const rect = element.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
