import { Button } from '../Forms/Button'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { FieldInput } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import {
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
} from '../../utils/api/definitions/enums'
import {
  BenefitResult,
  BenefitResultsObject,
  SummaryObject,
} from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { BenefitCards } from './BenefitCards'
import { EstimatedTotal } from './EstimatedTotal'
import { YourAnswers } from './YourAnswers'
import { Translations, getTranslations } from '../../i18n/api'
import { FieldKey } from '../../utils/api/definitions/fields'
import { FutureSummaryEstimates } from './FutureSummaryEstimates'

const getEligibility = (
  resultsEligible: BenefitResult[],
  key: string
): boolean => {
  return resultsEligible.some((benefit) => benefit.benefitKey === key)
}

const ResultsPage: React.VFC<{
  inputs: FieldInput[]
  results: BenefitResultsObject
  futureClientResults: any
  partnerResults: BenefitResultsObject
  futurePartnerResults: any
  summary: SummaryObject
}> = ({
  inputs,
  results,
  futureClientResults,
  partnerResults,
  futurePartnerResults,
  summary,
}) => {
  const ref = useRef<HTMLDivElement>()
  const tsln = useTranslation<WebTranslations>()
  const apiTsln = getTranslations(tsln._language)
  const router = useRouter()
  const isPartnered =
    inputs.find((input) => input.key === FieldKey.MARITAL_STATUS)['value'] ===
    MaritalStatus.PARTNERED

  const partnerNoOAS =
    inputs.find((input) => input.key === FieldKey.PARTNER_BENEFIT_STATUS)?.[
      'value'
    ] === PartnerBenefitStatus.NONE

  // CURRENT CLIENT
  const resultsArray: BenefitResult[] = Object.keys(results).map(
    (value) => results[value]
  )

  const resultsEligible: BenefitResult[] = resultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  // CURRENT PARTNER
  const partnerResultsArray: BenefitResult[] = Object.keys(partnerResults).map(
    (value) => partnerResults[value]
  )

  const partnerResultsEligible: BenefitResult[] = partnerResultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="md:grid md:grid-cols-3 md:gap-12">
        <div className="col-span-2 row-span-1 border-[#269ABC] bg-[#EEFAFF] p-8">
          {/* Current results eligible */}
          <div className="mb-7">
            {(resultsEligible.length > 0 ||
              partnerResultsEligible.length > 0) && (
              <h3 className="h3">{apiTsln.detail.currentEligible}</h3>
            )}
            {resultsEligible.length > 0 && (
              <EstimatedTotal
                resultsEligible={resultsEligible}
                entitlementSum={summary.entitlementSum}
                state={summary.state}
                partnerNoOAS={partnerNoOAS}
              />
            )}

            {isPartnered && partnerResultsEligible.length > 0 && (
              <EstimatedTotal
                resultsEligible={partnerResultsEligible}
                entitlementSum={summary.partnerEntitlementSum}
                state={summary.partnerState}
                partner={true}
                partnerNoOAS={partnerNoOAS}
              />
            )}
          </div>

          {/* FUTURE RESULTS SUMMARY */}
          {futureClientResults && (
            <FutureSummaryEstimates
              futureResults={futureClientResults}
              futurePartnerResults={futurePartnerResults}
              partnerNoOAS={partnerNoOAS}
              multipleResults={resultsEligible.length > 0}
              eligibleOAS={
                resultsEligible.filter((obj) => obj.benefitKey === 'oas')
                  .length > 0
              }
              userAge={inputs[0].value}
            />
          )}
        </div>

        <div className="col-span-1 row-span-2">
          <YourAnswers title={tsln.resultsPage.whatYouToldUs} inputs={inputs} />
        </div>
        <div className="col-span-2 row-span-1">
          <BenefitCards
            inputAge={Math.floor(
              Number(inputs.find((input) => input.key === 'age').value)
            )}
            results={resultsArray}
            futureClientResults={futureClientResults}
            partnerResults={partnerResultsArray}
          />

          <Button
            text={tsln.modifyAnswers}
            id={'EditAnswers'}
            style="secondary"
            custom="mt-6 justify-center md:w-[fit-content]"
            onClick={(e) => router.push('/questions')}
          />
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
