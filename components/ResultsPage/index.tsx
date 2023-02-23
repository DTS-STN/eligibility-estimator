import { Button, Message } from '@dts-stn/service-canada-design-system'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { FieldInput } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { ResultKey, SummaryState } from '../../utils/api/definitions/enums'
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
import { numberToStringCurrency } from '../../i18n/api'
import { Translations, getTranslations } from '../../i18n/api'

// get the link text by current summary state
const getEligibleLinkText = (
  summary: SummaryState,
  tsln: WebTranslations
): string => {
  return summary !== SummaryState.AVAILABLE_INELIGIBLE
    ? tsln.resultsPage.youMayBeEligible
    : tsln.resultsPage.youAreNotEligible
}

const getEstimatedMonthlyTotalLinkText = (
  entitlementSum: number,
  tsln: WebTranslations
): string => {
  if (entitlementSum !== 0) {
    return `${tsln.resultsPage.yourEstimatedTotal}${numberToStringCurrency(
      entitlementSum,
      tsln._language
    )}`
  }
  return ''
}

const getEligibility = (
  resultsArray: BenefitResult[],
  apiTsln: Translations,
  key: string
): string => {
  const eligibityResult = resultsArray.find((r) => r.benefitKey === key)
    .eligibility.result

  return eligibityResult === ResultKey.ELIGIBLE ||
    eligibityResult === ResultKey.INCOME_DEPENDENT
    ? `${apiTsln.benefit[key]}: ${apiTsln.result.eligible}`
    : `${apiTsln.benefit[key]}: ${apiTsln.result.ineligible}`
}

const ResultsPage: React.VFC<{
  inputs: FieldInput[]
  results: BenefitResultsObject
  partnerResults: BenefitResultsObject
  summary: SummaryObject
}> = ({ inputs, results, partnerResults, summary }) => {
  const ref = useRef<HTMLDivElement>()
  const tsln = useTranslation<WebTranslations>()
  const apiTsln = getTranslations(tsln._language)
  const router = useRouter()
  const resultsArray: BenefitResult[] = Object.keys(results).map(
    (value) => results[value]
  )
  const partnerResultsArray: BenefitResult[] = Object.keys(partnerResults).map(
    (value) => partnerResults[value]
  )
  let listLinks: {
    text: string
    url: string
  }[] = [
    {
      text: getEligibleLinkText(summary.state, tsln),
      url: '#eligible',
    },
    {
      text: getEstimatedMonthlyTotalLinkText(summary.entitlementSum, tsln),
      url: '#estimated',
    },
    {
      text: tsln.resultsPage.whatYouToldUs,
      url: '#answers',
    },
    {
      text: `${getEligibility(resultsArray, apiTsln, 'oas')}`,
      url: '#oas',
    },
    {
      text: `${getEligibility(resultsArray, apiTsln, 'gis')}`,
      url: '#gis',
    },
    {
      text: `${getEligibility(resultsArray, apiTsln, 'alw')}`,
      url: '#alw',
    },
    {
      text: `${getEligibility(resultsArray, apiTsln, 'afs')}`,
      url: '#afs',
    },
  ]

  // filtered out the link item which text is empty.
  listLinks = listLinks.filter((ll) => ll.text)

  const resultsEligible: BenefitResult[] = resultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="md:grid md:grid-cols-3 md:gap-12 ">
        <div className="col-span-2 row-span-1">
          <div> {tsln.resultsPage.general} </div>

          <ListLinks title={tsln.resultsPage.onThisPage} links={listLinks} />

          <MayBeEligible resultsEligible={resultsEligible} />

          {resultsEligible.length > 0 && summary.entitlementSum > 0 && (
            <EstimatedTotal
              resultsEligible={resultsEligible}
              summary={summary}
            />
          )}
        </div>
        <div className="col-span-1 row-span-2">
          <YourAnswers title={tsln.resultsPage.whatYouToldUs} inputs={inputs} />
        </div>
        <div className="col-span-2 row-span-1">
          <hr className="my-12 border border-[#BBBFC5]" />

          <BenefitCards
            results={resultsArray}
            partnerResults={partnerResultsArray}
          />

          <Button
            text={tsln.modifyAnswers}
            id={'EditAnswers'}
            styling="secondary"
            className="mt-6 justify-center md:w-[fit-content]"
            onClick={(e) => router.push('/eligibility')}
          />
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
