import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useSessionStorage } from 'react-use'
import { FieldInput, InputHelper } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import {
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
} from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import {
  BenefitResult,
  BenefitResultsObject,
  SummaryObject,
} from '../../utils/api/definitions/types'
import { Button } from '../Forms/Button'
import { useTranslation } from '../Hooks'
import { BenefitCards } from './BenefitCards'
import { YourAnswers } from './YourAnswers'
import { Translations, getTranslations } from '../../i18n/api'
import { SummaryEstimates } from './SummaryEstimates'
import { Intro } from './Intro'
import { PSDBox } from './PSDBox'
import { use } from 'chai'

const getEligibility = (
  resultsEligible: BenefitResult[],
  key: string
): boolean => {
  return resultsEligible.some((benefit) => benefit.benefitKey === key)
}

const ResultsPage: React.VFC<{
  inputHelper: InputHelper
  results: BenefitResultsObject
  futureClientResults: any
  partnerResults: BenefitResultsObject
  futurePartnerResults: any
  summary: SummaryObject
}> = ({
  inputHelper,
  results,
  futureClientResults,
  partnerResults,
  futurePartnerResults,
  summary,
}) => {
  console.log('inputs', inputHelper.asArray)
  const ref = useRef<HTMLDivElement>()
  const inputs: FieldInput[] = inputHelper.asArray
  const inputObj = inputHelper.asObject
  console.log('inputObj.receiveOAS', JSON.parse(inputObj.receiveOAS))
  console.log('inputObj', inputObj)

  // TODO: get eligible age (should probably come in already as a prop or part of the results object) Math.max(eligibleAge, userAge) -> ex. 65, 68 => 68. Check if less than 70.

  // ex:
  // Age/res   EliAge   Deferral Duration
  // 65/10      65           5
  // 68/10      68           2
  // 63/7       66           4
  // 49/20      65           5
  // 68/30      65           2
  // 69/11      68           1
  // 66/20      74           N/A

  // const maxEliAge = Math.max(eligibleAge, userAge)
  // const deferralDurationYrs = maxEliAge >= 70 ? 0 : 70 - maxEliAge

  const showPSD = !JSON.parse(inputObj.receiveOAS)
  const tsln = useTranslation<WebTranslations>()
  const router = useRouter()
  const apiTsln = getTranslations(tsln._language)
  const [isUpdating, setIsUpdating] = useState(false)

  const isPartnered =
    inputs.find((input) => input.key === FieldKey.MARITAL_STATUS)['value'] ===
    MaritalStatus.PARTNERED

  const alreadyReceiving =
    inputs.find((input) => input.key === FieldKey.ALREADY_RECEIVE_OAS) !==
    undefined
      ? inputs.find((input) => input.key === FieldKey.ALREADY_RECEIVE_OAS)[
          'value'
        ]
      : false

  const maritalStatus = inputs.find(
    (input) => input.key === FieldKey.MARITAL_STATUS
  )['value']

  const userAge = inputs.find((input) => input.key === FieldKey.AGE)['value']

  const partnerAge = isPartnered
    ? inputs.find((input) => input.key === FieldKey.PARTNER_AGE)['value']
    : null

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

  const userResultObject =
    resultsEligible.length > 0
      ? resultsEligible.reduce((acc, item) => {
          // Use the value of benefitKey as the key in the resulting object
          acc[item.benefitKey] = item
          return acc
        }, {})
      : null

  const partnerResultObject =
    partnerResultsEligible.length > 0
      ? partnerResultsEligible.reduce((acc, item) => {
          // Use the value of benefitKey as the key in the resulting object
          acc[item.benefitKey] = item
          return acc
        }, {})
      : null

  let userObj = {}
  // userObj['0'] = userResultObject
  if (userResultObject) {
    userObj['0'] = userResultObject
  } else {
    userObj = null
  }
  const userArr = userObj ? [userObj] : []

  let partnerObj = {}
  // partnerObj['0'] = partnerResultObject
  if (partnerResultObject) {
    partnerObj['0'] = partnerResultObject
  } else {
    partnerObj = null
  }
  const partnerArr = partnerObj ? [partnerObj] : []

  const userArrNew = userArr.concat(futureClientResults)
  const partnerArrNew = partnerArr.concat(futurePartnerResults)

  const currentYear = new Date().getFullYear()

  const newestUser = userArrNew.map((item, index) => {
    if (item) {
      const age = Number(Object.keys(item)[0])
      const headingYear =
        currentYear + (Math.trunc(age) - Math.trunc(Number(userAge)))
      let key
      if (age == 0) {
        key = currentYear
      } else {
        key = headingYear
      }
      return { [key]: item }
    }
  })

  const newestPartner = isPartnered
    ? partnerArrNew.map((item, index) => {
        if (item) {
          const age = Number(Object.keys(item)[0])
          const headingYear =
            currentYear + (Math.trunc(age) - Math.trunc(Number(partnerAge)))
          let key
          if (age == 0) {
            key = currentYear
          } else {
            key = headingYear
          }
          return { [key]: item }
        }
      })
    : null

  const userKeys = newestUser.flatMap((obj) => {
    // Check if the object is not null or undefined before extracting keys
    return obj ? Object.keys(obj) : []
  })

  const partnerKeys = isPartnered
    ? newestPartner.flatMap((obj) => {
        // Check if the object is not null or undefined before extracting keys
        return obj ? Object.keys(obj) : []
      })
    : []

  const arr1 = userKeys.length > partnerKeys.length ? userKeys : partnerKeys
  const arr2 = arr1 == partnerKeys ? userKeys : partnerKeys

  //get the headings to display user and partner results
  const headings = [...new Set([...arr1, ...arr2])]

  //has multiple oas benefits
  const multipleOAS_GIS =
    userArrNew
      .filter((item) => item !== null)
      .filter((obj) => !!obj[Object.keys(obj)[0]]['oas']).length > 1

  const handleUpdate = async () => {
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUpdating(false)
  }

  return (
    <div className="flex flex-col space-y-12" ref={ref}>
      <div className="md:grid md:grid-cols-3 md:gap-12">
        <div className="col-span-2 row-span-1">
          <Intro
            hasPartner={isPartnered}
            userAge={Number(userAge)}
            estimateLength={
              userArrNew.filter((element) => element !== null).length
            }
            hasMultipleOasGis={multipleOAS_GIS}
            alreadyReceiving={alreadyReceiving === 'true'}
          />
          {/* Summary Estimates section */}
          <div
            className={`border-[#269ABC] bg-[#EEFAFF] p-8 ${
              isUpdating ? 'opacity-20' : ''
            }`}
          >
            {headings && (
              <SummaryEstimates
                headings={headings}
                userResults={newestUser}
                partnerResults={newestPartner}
                userAge={userAge}
                partnerAge={partnerAge}
                maritalStatus={maritalStatus}
              ></SummaryEstimates>
            )}
          </div>
        </div>

        <div className="col-span-1 row-span-2 space-y-4">
          {showPSD && (
            <PSDBox onUpdate={handleUpdate} isUpdating={isUpdating} />
          )}
          <YourAnswers title={tsln.resultsPage.whatYouToldUs} inputs={inputs} />
        </div>
        <div className="col-span-2 row-span-1">
          <div className={isUpdating ? 'opacity-20' : ''}>
            <h2 className="h2"> {apiTsln.nextStepTitle}</h2>
            <BenefitCards
              inputAge={Number(userAge)}
              results={resultsArray}
              futureClientResults={futureClientResults}
              partnerResults={partnerResultsArray}
              liveInCanada={
                inputs.find((input) => input.key === 'livingCountry').value ===
                LivingCountry.CANADA
              }
            />
          </div>
          <Button
            text={tsln.modifyAnswers}
            id={'EditAnswers'}
            style="secondary"
            custom="mt-6 justify-center md:w-[fit-content]"
            onClick={(e) => {
              e.preventDefault()
              router.push('/questions')
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
