import { Button, Message } from '@dts-stn/decd-design-system'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { WebTranslations } from '../../i18n/web'
import { EstimationSummaryState } from '../../utils/api/definitions/enums'
import { FAQ } from '../FAQ'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import { ListLinks } from './ListLinks'
import { MoreInfoLinks } from './MoreInfoLinks'
import { ResultsApply } from './ResultsApply'
//import { ResultsTable } from './ResultsTable'
import { ResultsBoxes } from './ResultsBoxes'
import { NeedHelp } from '../NeedHelp'

export const ResultsPage: React.VFC = () => {
  const ref = useRef<HTMLDivElement>()
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)
  const root = useStore()
  const router = useRouter()

  const listLinks = [
    { text: "You may be eligible at this time", url: "#eligible" },
    { text: "Your estimated monthly total", url: "#estimated" },
    { text: "What you told us", url: "#answers" },
    { text: "Next steps for benefits you may be eligible", url: "#next" },
    { text: "Benefits you may not be eligible for", url: "#noteligible" }
  ]

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2">
          <Message id="resultId" type="info" alert_icon_id="resultIdInfo" message_heading={root.summary.title} message_body={root.summary.details} />

          <ListLinks title="On This Page:" links={listLinks} />
          
          <ResultsBoxes />
          
        </div>

        <div className="col-span-1">
          <NeedHelp title={tsln.needHelp} links={root.summary.needHelpLinks} />
        </div>
      </div>
      {/* {root.summary.state &&
        root.summary.state !== EstimationSummaryState.MORE_INFO && (
          <>
            {root.summary.state === EstimationSummaryState.UNAVAILABLE ? (
              <div
                className={`mt-10 w-full relative ${!isMobile ? 'h-[450px]' : 'h-[180px]'
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
            <ResultsApply />
            <p>{tsln.modifyAnswersText}</p>
            <Button
              text={tsln.modifyAnswers}
              styling="secondary"
              className="mt-6 justify-center md:w-[fit-content]"
              onClick={(e) => router.push('/eligibility')}
            />
            {root.summary?.moreInfoLinks?.length && (
              <MoreInfoLinks links={root.summary.moreInfoLinks} />
            )}

            <FAQ />
          </>
        )} */}
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
