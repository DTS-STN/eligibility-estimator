import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, ResultKey } from '../../utils/api/definitions/enums'
import {
  BenefitResult,
  BenefitResultsObject,
} from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const Estimation: React.VFC<{
  partner
  resultObject
  resultArray
  age
  maritalStatus
  partnerReceiving
  involSep
  isSecondEstimate
}> = ({
  partner,
  resultObject,
  resultArray,
  age,
  maritalStatus,
  partnerReceiving,
  involSep,
  isSecondEstimate,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)
  const roundedAge = Math.trunc(Number(age))
  age = Math.round(age)

  const language = useRouter().locale as Language

  const benefitAge = Object.keys(resultObject)[0]
  const benefitType = Object.keys(resultObject[Object.keys(resultObject)[0]])

  let estimateIsSame = false

  const showPartnerAmounts = () => {
    if (!partner) return true
    else if (roundedAge < 65) {
      return true
    } else {
      return partner && partnerReceiving
    }
  }

  const resultsArray: BenefitResult[] = Object.keys(
    resultObject[benefitAge]
  ).map((value) => resultObject[benefitAge][value])

  let eligible = resultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  const eligibleTotalAmount = eligible.reduce(
    (sum, obj) => sum + obj.entitlement.result,
    0
  )

  let benefitResultArray: BenefitResult[] = []
  for (const prop in resultArray) {
    if (prop) {
      if (resultArray[prop]) {
        benefitResultArray.push(
          resultArray[prop][Object.keys(resultArray[prop])[0]]
        )
      }
    }
  }

  const isFirstOasGis = () => {
    let isFirst = false

    for (let i = 0; i < benefitResultArray.length; i++) {
      const obj = benefitResultArray[i]
      if (
        Object.keys(obj[Object.keys(obj)[0]]).includes('oas') ||
        Object.keys(obj[Object.keys(obj)[0]]).includes('gis')
      ) {
        // Check if it's the same object
        if (JSON.stringify(obj) === JSON.stringify(resultObject)) {
          isFirst = true
        }
        break
      }
    }
    return isFirst
  }

  const isLastOasGis = () => {
    let isLast = false

    for (let i = benefitResultArray.length - 1; i >= 0; i--) {
      const obj = benefitResultArray[i]
      if (
        Object.keys(obj[Object.keys(obj)[0]]).includes('oas') ||
        Object.keys(obj[Object.keys(obj)[0]]).includes('gis')
      ) {
        // Check if it's the same object
        if (JSON.stringify(obj) === JSON.stringify(resultObject)) {
          isLast = true
        }
        break
      }
    }

    return isLast
  }

  //BUILD THE SUMMARY STRINGS FOR EACH BENFIT
  const buildSummaryString = () => {
    let text = ''

    age = benefitAge == '0' ? age : benefitAge
    let isPartnerStr = partner
      ? apiTrans.detail.yourPartner
      : apiTrans.detail.you

    const displayAge = Math.trunc(Number(age)) // If this is the first occurence of the "same" age (68.08), leave truncated, but if it's subsequent (68.67) then add the months
    const firstOasGis = isFirstOasGis()
    const lastOasGis = isLastOasGis()

    const eligibleAmt = numberToStringCurrency(eligibleTotalAmount, language)
    const arrayOfBen = benefitResultArray

    //ALW & ALWS
    if (benefitType.includes('alw') || benefitType.includes('alws')) {
      //CURRENT ELIGIBLE
      if (benefitAge == '0') {
        text = `${apiTrans.detail.youCouldReceiveUntil} 65${
          language == 'fr' ? ' ans' : ''
        },`
      }
      //FUTURE ELIGIBLE
      else {
        text = `${apiTrans.detail.youCouldReceiveFrom} ${displayAge} ${
          apiTrans.detail.youCouldReceiveTo
        } 65${language == 'fr' ? ' ans' : ''},`
      }
      text += ` ${isPartnerStr} ${apiTrans.detail.youCouldReceive} ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}:`
    }
    //OAS AND GIS BENEFIT
    else {
      //FIRST OAS AND GIS
      if (firstOasGis) {
        //IS CURRENTLY AVAILABLE
        if (benefitAge == '0') {
          //FIRST AND LAST
          //I1
          if (lastOasGis) {
            text += `${
              partner ? apiTrans.detail.yourPartner : apiTrans.detail.you
            } ${apiTrans.detail.youCouldReceive}${
              showPartnerAmounts()
                ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                : ''
            }:`
          }
          //FIRST NOT LAST
          else {
            const nextBenefitResult =
              arrayOfBen[arrayOfBen.indexOf(resultObject) + 1]

            //have to get the GIS before hand because when user not in Canada, GIS is null
            const gis =
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['gis']

            const nextBenefitTotal =
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['oas']
                .entitlement.result + (gis ? gis.entitlement.result : 0)

            const nextBenefitAge = Object.keys(nextBenefitResult)[0]

            //IS NEXT RESULT THE SAME
            //I1 & I2
            if (eligibleTotalAmount !== nextBenefitTotal) {
              text = `${
                apiTrans.detail.youCouldReceiveUntil
              } ${nextBenefitAge}${language == 'fr' ? ' ans' : ''}, ${
                partner ? apiTrans.detail.yourPartner : apiTrans.detail.you
              } ${apiTrans.detail.youCouldReceive}${
                showPartnerAmounts()
                  ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                  : ''
              }:`
            }
            text = `${
              partner ? apiTrans.detail.yourPartner : apiTrans.detail.you
            } ${apiTrans.detail.youCouldReceive}${
              showPartnerAmounts()
                ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                : ''
            }:`
          }
        }

        //FUTURE
        else {
          //LAST ESTIMATE
          if (lastOasGis) {
            //I5
            text = `${apiTrans.detail.youCouldStartReceivingAt} ${displayAge}${
              language == 'fr' ? ' ans' : ''
            }, ${partner ? apiTrans.detail.yourPartner : apiTrans.detail.you} ${
              apiTrans.detail.youCouldStartReceiving
            }${
              showPartnerAmounts()
                ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                : ''
            }:`
          }
          //NOT LAST
          else {
            const nextBenefitResult =
              arrayOfBen[arrayOfBen.indexOf(resultObject) + 1]

            //have to get the GIS before hand because when user not in Canada, GIS is null
            const gis =
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['gis']

            const nextBenefitTotal =
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['oas']
                .entitlement.result + (gis ? gis.entitlement.result : 0)

            const nextBenefitAge = Math.trunc(
              Number(Object.keys(nextBenefitResult)[0])
            )

            //NEXT SAME
            if (eligibleTotalAmount == nextBenefitTotal) {
              text = `${
                apiTrans.detail.youCouldStartReceivingAt
              } ${displayAge}${language == 'fr' ? ' ans' : ''}, ${
                partner ? apiTrans.detail.yourPartner : apiTrans.detail.you
              } ${apiTrans.detail.youCouldStartReceiving}${
                showPartnerAmounts()
                  ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                  : ''
              }:`
            }
            //NEXT NOT SAME
            else {
              text = `${apiTrans.detail.youCouldReceiveFrom} ${displayAge} ${
                apiTrans.detail.youCouldReceiveTo
              } ${nextBenefitAge}${language == 'fr' ? ' ans' : ''},`
              text += ` ${isPartnerStr} ${apiTrans.detail.youCouldReceive}${
                showPartnerAmounts()
                  ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                  : ''
              }:`
            }
          }
        }
      }
      //NOT FIRST
      else {
        const previousBenefitResult =
          arrayOfBen[arrayOfBen.indexOf(resultObject) - 1]

        //have to get the GIS before hand because when user not in Canada, GIS is null
        const gis =
          previousBenefitResult[Object.keys(previousBenefitResult)[0]]['gis']

        const previousBenefitTotal =
          previousBenefitResult[Object.keys(previousBenefitResult)[0]]['oas']
            .entitlement.result + (gis ? gis.entitlement.result : 0)

        //PREVIOUS THE SAME
        if (previousBenefitTotal === eligibleTotalAmount) {
          estimateIsSame = true
          text = !isSecondEstimate
            ? `${
                partner
                  ? apiTrans.detail.yourEstimateIsStillPartner
                  : apiTrans.detail.yourEstimateIsStill
              } ${
                showPartnerAmounts()
                  ? `${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                  : apiTrans.detail.theSame
              }.`
            : ''
        }
        //PREVIOUS NOT THE SAME
        else {
          //IS LAST
          if (lastOasGis) {
            text = `${apiTrans.detail.youCouldStartReceivingAt} ${displayAge}${
              language == 'fr' ? ' ans' : ''
            }, ${partner ? apiTrans.detail.yourPartner : apiTrans.detail.you} ${
              apiTrans.detail.youCouldContinueReceiving
            }${
              showPartnerAmounts()
                ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                : ''
            }:`
          } else {
            const nextBenefitResult =
              arrayOfBen[arrayOfBen.indexOf(resultObject) + 1]

            //have to get the GIS before hand because when user not in Canada, GIS is null
            const gis =
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['gis']

            const nextBenefitTotal =
              nextBenefitResult[Object.keys(nextBenefitResult)[0]]['oas']
                .entitlement.result + (gis ? gis.entitlement.result : 0)

            const nextBenefitAge = Object.keys(nextBenefitResult)[0]

            if (eligibleTotalAmount == nextBenefitTotal) {
              text = `${
                apiTrans.detail.youCouldStartReceivingAt
              } ${displayAge}${language == 'fr' ? ' ans' : ''}, ${
                partner ? apiTrans.detail.yourPartner : apiTrans.detail.you
              } ${apiTrans.detail.youCouldContinueReceiving}${
                showPartnerAmounts()
                  ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                  : ''
              }:`
            } else {
              text = `${apiTrans.detail.youCouldReceiveFrom} ${displayAge} ${
                apiTrans.detail.youCouldReceiveTo
              } ${Math.trunc(Number(nextBenefitAge))}${
                language == 'fr' ? ' ans' : ''
              },`
              text += ` ${isPartnerStr} ${
                apiTrans.detail.youCouldContinueReceiving
              }${
                showPartnerAmounts()
                  ? ` ${eligibleAmt} ${apiTrans.detail.youCouldReceivePerMonth}`
                  : ''
              }:`
            }
          }
        }
      }
    }

    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  return (
    <div key={age}>
      <strong>
        <p
          dangerouslySetInnerHTML={{
            __html: buildSummaryString(),
          }}
        />
      </strong>

      <ul className="pl-[35px] ml-[20px] my-1 list-disc text-content">
        {!estimateIsSame &&
          eligible.map((benefit, index) => (
            <EstimatedTotalItem
              key={benefit.benefitKey + index}
              heading={apiTrans.benefit[benefit.benefitKey]}
              result={benefit}
              displayAmount={!partner || showPartnerAmounts()}
              partner={partner}
              maritalStatus={maritalStatus}
              partnerReceiving={partnerReceiving}
              involSep={involSep}
            />
          ))}
      </ul>
      {isFirstOasGis() &&
        eligible.map((benefit, index) => {
          if (
            benefit.cardDetail.meta.residency &&
            benefit.entitlement.result > 0
          ) {
            return (
              <p>
                {language == 'en'
                  ? `This estimate is based on ${benefit.cardDetail.meta.residency} years of Canadian residence.`
                  : `Cette estimation est basée sur ${benefit.cardDetail.meta.residency} années de résidence canadienne.`}
              </p>
            )
          }
        })}
    </div>
  )
}
