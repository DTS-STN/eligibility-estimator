import { Button } from '@dts-stn/service-canada-design-system'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { FieldInput } from '../../client-state/InputHelper'
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
import { Translations, getTranslations } from '../../i18n/api'
import { FieldKey } from '../../utils/api/definitions/fields'

const getEstimatedMonthlyTotalLinkText = (
  entitlementSum: number,
  resultsEligible: BenefitResult[],
  tsln: WebTranslations,
  textFor = 'client'
): string => {
  if (textFor === 'client') {
    if (entitlementSum > 0) {
      return `${tsln.resultsPage.yourEstimatedTotal}`
    } else if (resultsEligible.length <= 0) {
      return `${tsln.resultsPage.youAreNotEligible}`
    } else {
      return `${tsln.resultsPage.yourEstimatedNoIncome}`
    }
  }

  // text for partner links
  if (entitlementSum > 0) {
    return `${tsln.resultsPage.partnerEstimatedTotal}`
  } else if (resultsEligible.length <= 0) {
    return `${tsln.resultsPage.partnerNotEligible}`
  } else {
    return `${tsln.resultsPage.yourEstimatedNoIncome}`
  }
}

const getEligibilityText = (
  resultsArray: BenefitResult[],
  apiTsln: Translations,
  key: string
): string => {
  return getEligibility(resultsArray, key)
    ? `${apiTsln.benefit[key]}`
    : `${apiTsln.benefit[key]}`
}

const getEligibility = (
  resultsArray: BenefitResult[],
  key: string
): boolean => {
  const eligibityResult = resultsArray.find((r) => r.benefitKey === key)
    .eligibility.result
  return (
    eligibityResult === ResultKey.ELIGIBLE ||
    eligibityResult === ResultKey.INCOME_DEPENDENT
  )
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
  const isPartnered =
    inputs.find((input) => input.key === FieldKey.MARITAL_STATUS)['value'] ===
    'partnered'

  const resultsArray: BenefitResult[] = Object.keys(results).map(
    (value) => results[value]
  )

  const partnerResultsArray: BenefitResult[] = Object.keys(partnerResults).map(
    (value) => partnerResults[value]
  )

  const resultsEligible: BenefitResult[] = resultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  const partnerResultsEligible: BenefitResult[] = partnerResultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  const getListLinks = () => {
    let listLinks: {
      text: string
      url: string
      eligible?: boolean
    }[] = [
      {
        text: getEstimatedMonthlyTotalLinkText(
          summary.entitlementSum,
          resultsEligible,
          tsln
        ),
        url: '#estimated',
      },
      {
        text: tsln.resultsPage.whatYouToldUs,
        url: '#answers',
      },
      {
        text: `${getEligibilityText(resultsArray, apiTsln, 'oas')}`,
        url: '#oas',
        eligible: getEligibility(resultsArray, 'oas'),
      },
      {
        text: `${getEligibilityText(resultsArray, apiTsln, 'gis')}`,
        url: '#gis',
        eligible: getEligibility(resultsArray, 'gis'),
      },
      {
        text: `${getEligibilityText(resultsArray, apiTsln, 'alw')}`,
        url: '#alw',
        eligible: getEligibility(resultsArray, 'alw'),
      },
      {
        text: `${getEligibilityText(resultsArray, apiTsln, 'afs')}`,
        url: '#afs',
        eligible: getEligibility(resultsArray, 'afs'),
      },
    ]

    if (isPartnered) {
      listLinks.splice(1, 0, {
        text: getEstimatedMonthlyTotalLinkText(
          summary.partnerEntitlementSum,
          partnerResultsEligible,
          tsln,
          'partner'
        ),
        url: '#partnerEstimated',
      })
    }

    // filtered out the link item which text is empty.
    listLinks = listLinks.filter((ll) => ll.text)
    // Sort the links based on eligibility
    const sortListLinks = (a, b) => {
      if (a.eligible == null || b.eligible == null) {
        return 0
      }
      if (a.eligible && !b.eligible) {
        return -1
      }
      if (!a.eligible && b.eligible) {
        return 1
      }
      return 0
    }

    return listLinks.sort(sortListLinks)
  }

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="md:grid md:grid-cols-3 md:gap-12">
        <div className="col-span-2 row-span-1">
          <div> {tsln.resultsPage.general} </div>

          <ListLinks
            title={tsln.resultsPage.onThisPage}
            links={getListLinks()}
          />

          <MayBeEligible resultsEligible={resultsEligible} />
          {isPartnered && (
            <MayBeEligible
              resultsEligible={partnerResultsEligible}
              partner={true}
            />
          )}

          {resultsEligible.length > 0 && (
            <EstimatedTotal
              resultsEligible={resultsEligible}
              entitlementSum={summary.entitlementSum}
              state={summary.state}
            />
          )}

          {isPartnered && partnerResultsEligible.length > 0 && (
            <EstimatedTotal
              resultsEligible={partnerResultsEligible}
              entitlementSum={summary.partnerEntitlementSum}
              state={summary.partnerState}
              partner={true}
            />
          )}
        </div>

        <div className="col-span-1 row-span-2">
          <YourAnswers title={tsln.resultsPage.whatYouToldUs} inputs={inputs} />
        </div>
        <div className="col-span-2 row-span-1">
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
