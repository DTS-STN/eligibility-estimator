import { result } from 'lodash'
import next from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { P } from 'pino'
import { useState } from 'react'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import Results from '../../pages/results'
import {
  BenefitKey,
  Language,
  ResultKey,
  ResultReason,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { DeferralTable } from './DeferralTable'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const FutureBenefitEstimate: React.VFC<{
  partnerNoOAS?: boolean
  futureBenefits?: any
  futurePartnerBenefits?: any
  multipleResults?: boolean
  eligibleOAS?: boolean
  resultObj: BenefitResult
  index: number
  key?: any
}> = ({
  partnerNoOAS,
  futureBenefits,
  futurePartnerBenefits,
  multipleResults,
  eligibleOAS,
  index,
  key,
  resultObj,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)
  const language = useRouter().locale as Language

  const age = Object.keys(resultObj)[0]
  const benefitType = Object.keys(resultObj[Object.keys(resultObj)[0]])

  //   const onlyOASGIS = Object.keys(resultObj[Object.keys(resultObj)[0]]).filter(
  //     (key) => key === 'oas' || key === 'gis'
  //   )

  //   // show if some are non zero
  //   const nonZeroExist = onlyOASGIS.some(
  //     (key) => resultObj[age][key].entitlement?.result > 0
  //   )
  const partner = futurePartnerBenefits.includes(resultObj)

  const resultsArray: BenefitResult[] = Object.keys(resultObj[age]).map(
    (value) => resultObj[age][value]
  )

  let eligible = resultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  // If partner answers "No" to receiving OAS, the amounts should not show
  if (partner && partnerNoOAS) {
    eligible = eligible.map((benefit) => {
      return {
        ...benefit,
        entitlement: { ...benefit.entitlement, result: 0 },
      }
    })
  }

  const eligibleTotalAmount = eligible.reduce(
    (sum, obj) => sum + obj.entitlement.result,
    0
  )

  //check if current resultObj is the first Oas and Gis estimation
  const isFirstOasGis = (partner, resultObj) => {
    let isFirst = false

    const resultArray = partner ? futurePartnerBenefits : futureBenefits

    for (let i = 0; i < resultArray.length; i++) {
      const obj = resultArray[i]
      if (
        Object.keys(obj[Object.keys(obj)[0]]).includes('oas') &&
        Object.keys(obj[Object.keys(obj)[0]]).includes('gis')
      ) {
        // Check if it's the same object
        if (JSON.stringify(obj) === JSON.stringify(resultObj)) {
          // console.log(' is first')
          isFirst = true
        }
        break
      }
    }
    return isFirst
  }

  //check if current resultObj is the last Oas and Gis estimation
  const isLastOasGis = (partner, resultObj) => {
    let isLast = false

    const resultArray = partner ? futurePartnerBenefits : futureBenefits

    for (let i = resultArray.length - 1; i >= 0; i--) {
      const obj = resultArray[i]
      if (
        Object.keys(obj[Object.keys(obj)[0]]).includes('oas') &&
        Object.keys(obj[Object.keys(obj)[0]]).includes('gis')
      ) {
        // Check if it's the same object
        if (JSON.stringify(obj) === JSON.stringify(resultObj)) {
          isLast = true
        }
        break
      }
    }

    return isLast
  }

  // build the string to display current estimation
  const getSummaryBenefitStr = (eligibleAmt) => {
    let text

    let isPartnerStr = partner
      ? apiTrans.detail.yourPartner
      : apiTrans.detail.you

    //ALW & ALWS
    if (!benefitType.includes('oas') || !benefitType.includes('gis')) {
      if (
        resultObj[age][benefitType[0]].eligibility.result === ResultKey.ELIGIBLE
      ) {
        text = `${apiTrans.detail.youCouldReceiveFrom} ${age} ${
          apiTrans.detail.youCouldReceiveTo
        } 65${language == 'fr' ? ' ans' : ''},`
      } else {
        text = `${apiTrans.detail.youCouldReceiveUntil} ${age}${
          language == 'fr' ? ' ans' : ''
        },`
      }
      text += ` ${isPartnerStr} ${apiTrans.detail.youCouldReceive} ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
    }
    //OAS GIS ESTIMATE
    else {
      const firstOasGis = isFirstOasGis(partner, resultObj)
      const lastOasGis = isLastOasGis(partner, resultObj)
      // console.log(resultObj)
      // console.log(futureBenefits)

      const arrayofben = partner ? futurePartnerBenefits : futureBenefits

      //NOT FIRST ESTIMATE
      if (!firstOasGis) {
        const previousBenefitResult =
          arrayofben[arrayofben.indexOf(resultObj) - 1]
        console.log('previous one', previousBenefitResult)
        const previousBenefitTotal =
          previousBenefitResult[Object.keys(previousBenefitResult)[0]]['oas']
            .entitlement.result +
          previousBenefitResult[Object.keys(previousBenefitResult)[0]]['gis']

        //IF ESTIMATE IS THE SAME AS LAST
        if (previousBenefitTotal === eligibleTotalAmount) {
          text = `${
            partner
              ? apiTrans.detail.yourEstimateIsStillPartner
              : apiTrans.detail.yourEstimateIsStill
          } ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
        } else {
          //NOT THE LAST ESTIMATE
          if (!lastOasGis) {
            text += 'middle'
            const nextBenefitResult =
              arrayofben[arrayofben.indexOf(resultObj) + 1]
            console.log('next one', nextBenefitResult)

            const nextBenefitTotal =
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['oas']
                .entitlement.result +
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['gis']
                .entitlement.result

            console.log(Object.keys(nextBenefitResult)[0])
            //CHECK IF NEXT RESULT IS THE SAME
            //I4
            if (eligibleTotalAmount !== nextBenefitTotal) {
              text = `${apiTrans.detail.youCouldReceiveFrom} ${age} ${
                apiTrans.detail.youCouldReceiveTo
              } ${Object.keys(nextBenefitResult)[0]}${
                language == 'fr' ? ' ans' : ''
              },`
              text += ` ${isPartnerStr} ${apiTrans.detail.youCouldReceive} ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
            }
            //I6
            else {
              text = `${apiTrans.detail.youCouldStartReceivingAt} ${age}${
                language == 'fr' ? ' ans' : ''
              }, ${
                partner ? apiTrans.detail.yourPartner : apiTrans.detail.you
              } ${apiTrans.detail.youCouldContinueReceiving} ${eligibleAmt} ${
                apiTrans.detail.youCouldReceivePerMonth
              }`
            }
          }
          //LAST ESTIMATE
          else {
            text = `${apiTrans.detail.youCouldStartReceivingAt} ${age}${
              language == 'fr' ? ' ans' : ''
            }, ${partner ? apiTrans.detail.yourPartner : apiTrans.detail.you} ${
              apiTrans.detail.youCouldContinueReceiving
            } ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
          }
        }
      }
      //FIRST ESTIMATE
      else {
        //IS ALSO THE LAST
        if (lastOasGis) {
          //DIsplay I5
          text = `${apiTrans.detail.youCouldStartReceivingAt} ${age}${
            language == 'fr' ? ' ans' : ''
          }, ${partner ? apiTrans.detail.yourPartner : apiTrans.detail.you} ${
            apiTrans.detail.youCouldContinueReceiving
          } ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
        }
        //NOT THE LAST
        else {
          //NEXT ESTIMATE THE SAME -> I5
          const nextBenefitResult =
            arrayofben[arrayofben.indexOf(resultObj) + 1]
          console.log('next one', nextBenefitResult)

          const nextBenefitTotal =
            nextBenefitResult[Object.keys(nextBenefitResult)[0]]['oas']
              .entitlement.result +
            nextBenefitResult[Object.keys(nextBenefitResult)[0]]['gis']
              .entitlement.result
          if (nextBenefitTotal === eligibleTotalAmount) {
            text = `${apiTrans.detail.youCouldStartReceivingAt} ${age}${
              language == 'fr' ? ' ans' : ''
            }, ${partner ? apiTrans.detail.yourPartner : apiTrans.detail.you} ${
              apiTrans.detail.youCouldContinueReceiving
            } ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
          }
          //ELSE -> I3
          else {
            text = `${apiTrans.detail.youCouldStartReceivingAt} ${age}${
              language == 'fr' ? ' ans' : ''
            }, ${partner ? apiTrans.detail.yourPartner : apiTrans.detail.you} ${
              apiTrans.detail.youCouldReceive
            } ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
          }
        }
      }
    }

    return text
  }

  return (
    <div key={index}>
      <div key={age}>
        <strong>
          <p
            dangerouslySetInnerHTML={{
              __html: getSummaryBenefitStr(
                numberToStringCurrency(eligibleTotalAmount, language)
              ),
            }}
          />
        </strong>

        <ul className="pl-[35px] ml-[20px] my-1 list-disc text-content">
          {eligible.map((benefit) => (
            <EstimatedTotalItem
              key={benefit.benefitKey}
              heading={apiTrans.benefit[benefit.benefitKey]}
              result={benefit}
              displayAmount={partner && partnerNoOAS ? false : true}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
