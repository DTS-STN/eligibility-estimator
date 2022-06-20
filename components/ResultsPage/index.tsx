import { Button, Message } from '@dts-stn/decd-design-system'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import { ListLinks } from './ListLinks'
import { ResultsBoxes } from './ResultsBoxes'
import { YourAnswers } from './YourAnswers'

export const ResultsPage: React.VFC = () => {
  const ref = useRef<HTMLDivElement>()
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)
  const root = useStore()
  const router = useRouter()

  const listLinks = [
    { text: tsln.resultsPage.youMayBeEligible, url: '#eligible' },
    { text: tsln.resultsPage.yourEstimatedTotal, url: '#estimated' },
    { text: tsln.resultsPage.whatYouToldUs, url: '#answers' },
    { text: tsln.resultsPage.nextSteps, url: '#next' },
    { text: tsln.resultsPage.youMayNotBeEligible, url: '#noteligible' },
  ]

  const questionsAndAnswers = root.inputs

  const tempUntilNewComponentIsFixed = (
    <span dangerouslySetInnerHTML={{ __html: root.summary.details }}></span>
  )

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2">
          <Message
            id="resultId"
            type="info"
            alert_icon_id="resultIdInfo"
            alert_icon_alt_text="Info"
            message_heading={root.summary.title}
            message_body={tempUntilNewComponentIsFixed}
          />

          <ListLinks title={tsln.resultsPage.onThisPage} links={listLinks} />

          <ResultsBoxes />

          <Button
            text={tsln.startOver}
            styling="secondary"
            className="mt-6 justify-center md:w-[fit-content]"
            onClick={(e) => router.push('/eligibility')}
          />
        </div>

        <div className="col-span-1">
          <YourAnswers
            title={tsln.resultsPage.whatYouToldUs}
            questions={questionsAndAnswers}
          />
        </div>
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
