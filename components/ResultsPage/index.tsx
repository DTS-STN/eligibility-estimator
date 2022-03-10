import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { WebTranslations } from '../../i18n/web'
import { EstimationSummaryState } from '../../utils/api/definitions/enums'
import { ConditionalLinks } from '../ConditionalLinks'
import { ContactCTA } from '../ContactCTA'
import { DownloadCSVButton } from '../DownloadCSVButton'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import { NeedHelpList } from '../Layout/NeedHelpList'
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
      const tabs = document.getElementById('tabList') as HTMLDivElement
      const tabsVisible = isElementInViewport(tabs)
      if (!tabsVisible) tabs.scrollIntoView(true)
    }
    html.removeAttribute('style')
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 mt-14">
      <div className="flex flex-col space-y-12 md:col-span-2" ref={ref}>
        {isMobile && <DownloadCSVButton />}
        {root.summary.state &&
          root.summary.state !== EstimationSummaryState.MORE_INFO && (
            <div className="">
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
            </div>
          )}
      </div>
      <div className="md:col-span-1">
        <NeedHelpList
          title={tsln.needHelp}
          links={root.summary.needHelpLinks}
        />
      </div>
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
