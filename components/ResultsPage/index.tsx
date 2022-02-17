import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { WebTranslations } from '../../i18n/web'
import { EstimationSummaryState } from '../../utils/api/definitions/enums'
import { Alert } from '../Alert'
import { ConditionalLinks } from '../ConditionalLinks'
import { ContactCTA } from '../ContactCTA'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import ProgressBar from '../ProgressBar'
import { ResultsTable } from '../ResultsTable'

export const ResultsPage: React.VFC = () => {
  const ref = useRef<HTMLDivElement>()
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)
  const root = useStore()

  /**
   * Runs once on mount to process the scrolling behaviour. Does a check to prevent any serverside process from throwing any warnings / errors
   */
  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    html.setAttribute('style', 'scroll-behavior: smooth;')

    if (process.browser) {
      const results = document.getElementById('elig-results')
      if (results) {
        const componentInViewport = isElementInViewport(
          results as HTMLDivElement
        )
        if (!componentInViewport) {
          results.scrollIntoView(true)
        }
      }
      html.removeAttribute('style')
    }
  })

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      {root.summary.state &&
      root.summary.state !== EstimationSummaryState.MORE_INFO ? (
        <>
          <ProgressBar
            sections={[
              { title: tsln.category.incomeDetails, complete: true },
              { title: tsln.category.personalInformation, complete: true },
              { title: tsln.category.legalStatus, complete: true },
            ]}
            estimateSection
          />
          <Alert
            id="elig-results"
            title={root.summary.title}
            type={root.summary.state}
            insertHTML
          >
            {root.summary.details}
          </Alert>
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
          {root.summary?.moreInfoLinks?.length && (
            <ConditionalLinks links={root.summary.moreInfoLinks} />
          )}
        </>
      ) : (
        <div className="w-full">
          <Alert
            title={root.summary.title}
            type={EstimationSummaryState.MORE_INFO}
            insertHTML
          >
            {root.summary.details}
          </Alert>
        </div>
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
