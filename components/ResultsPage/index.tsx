import { Button, Message } from '@dts-stn/decd-design-system'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { FieldInput } from '../../client-state/types'
import { WebTranslations } from '../../i18n/web'
import { ResultKey } from '../../utils/api/definitions/enums'
import {
  BenefitResult,
  BenefitResultsObject,
  SummaryObject,
} from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { BenefitCards } from './BenefitCards'
import { EstimatedTotal } from './EstimatedTotal'
import { ListLinks } from './ListLinks'
import { MayBeEligible } from './MayBeEligible'
import { YourAnswers } from './YourAnswers'

export const ResultsPage: React.VFC<{
  inputs: FieldInput[]
  results: BenefitResultsObject
  summary: SummaryObject
}> = ({ inputs, results, summary }) => {
  const ref = useRef<HTMLDivElement>()
  const tsln = useTranslation<WebTranslations>()
  const router = useRouter()

  const listLinks: { text: string; url: string }[] = [
    { text: tsln.resultsPage.youMayBeEligible, url: '#eligible' },
    { text: tsln.resultsPage.yourEstimatedTotal, url: '#estimated' },
    { text: tsln.resultsPage.whatYouToldUs, url: '#answers' },
    { text: tsln.resultsPage.nextSteps, url: '#nextSteps' },
    { text: tsln.resultsPage.youMayNotBeEligible, url: '#notEligible' },
  ]

  const resultsArray: BenefitResult[] = Object.keys(results).map(
    (value) => results[value]
  )

  const resultsEligible: BenefitResult[] = resultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="md:grid md:grid-cols-3 md:gap-12">
        <div className="col-span-2">
          <Message
            id="resultSummaryBox"
            type="info"
            alert_icon_id="resultSummaryBoxIcon"
            alert_icon_alt_text="Info"
            message_heading={summary.title}
            message_body={summary.details}
            asHtml={true}
          />

          <ListLinks title={tsln.resultsPage.onThisPage} links={listLinks} />

          <MayBeEligible resultsEligible={resultsEligible} />

          {resultsEligible.length > 0 && (
            <EstimatedTotal
              resultsEligible={resultsEligible}
              summary={summary}
            />
          )}
        </div>
        <div className="col-span-1">
          <YourAnswers title={tsln.resultsPage.whatYouToldUs} inputs={inputs} />
        </div>
        <div className="col-span-2">
          <hr className="my-12 border border-[#BBBFC5]" />

          <BenefitCards results={resultsArray} />

          <Button
            text={tsln.modifyAnswers}
            styling="secondary"
            className="mt-6 justify-center md:w-[fit-content]"
            onClick={(e) => router.push('/eligibility')}
          />
        </div>
      </div>
    </div>
  )
}
