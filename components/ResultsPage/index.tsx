import { Instance } from 'mobx-state-tree'
import { Dispatch, useEffect, useRef } from 'react'
import { RootStore } from '../../client-state/store'
import { EstimationSummaryState } from '../../utils/api/definitions/enums'
import { Alert } from '../Alert'
import { ConditionalLinks } from '../ConditionalLinks'
import { ContactCTA } from '../ContactCTA'
import { useMediaQuery } from '../Hooks'
import ProgressBar from '../ProgressBar'
import { ResultsTable } from '../ResultsTable'
import Image from 'next/image'

export const ResultsPage: React.FC<{
  root: Instance<typeof RootStore>
  setSelectedTab: Dispatch<number>
}> = ({ root, setSelectedTab }) => {
  const ref = useRef<HTMLDivElement>()
  const isMobile = useMediaQuery(992)

  /**
   * runs once on mount to process the scrolling behaviour; does a check to prevent any serverside process from throwing any warnings / errors
   */
  useEffect(() => {
    if (process.browser) {
      const results = document.getElementById('elig-results')
      if (results) {
        const componentInViewport = isElementInViewport(
          results as HTMLDivElement
        )
        if (!componentInViewport) results.scrollIntoView(true)
      }
    }
  })

  return (
    <div ref={ref}>
      {root.summary.state &&
      root.summary.state !== EstimationSummaryState.MORE_INFO ? (
        <>
          <ProgressBar
            sections={[
              { title: 'Income Details', complete: true },
              { title: 'Personal Information', complete: true },
              { title: 'Legal Status', complete: true },
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
                alt="People of all walks of life, happy together."
              />
            </div>
          ) : (
            <ResultsTable />
          )}
          {root.summary.state !== EstimationSummaryState.UNAVAILABLE && (
            <ContactCTA setSelectedTab={setSelectedTab} />
          )}
          {root.summary?.links?.length && (
            <ConditionalLinks links={root.summary.links} />
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
