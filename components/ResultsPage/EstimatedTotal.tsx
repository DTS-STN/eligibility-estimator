import Image from 'next/image'
import { useRouter } from 'next/router'
import { Summary } from 'prom-client'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  BenefitKey,
  Language,
  ResultKey,
  SummaryState,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { CustomCollapse } from './CustomCollapse'
import { DeferralTable } from './DeferralTable'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const EstimatedTotal: React.VFC<{
  resultsEligible: BenefitResult[]
  entitlementSum: number
  state: SummaryState
  partner?: boolean
  partnerNoOAS: boolean
}> = ({
  resultsEligible,
  entitlementSum,
  state,
  partner = false,
  partnerNoOAS,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)

  const language = useRouter().locale as Language

  const buildSummaryString = (partner) => {
    return `${!partner ? apiTrans.detail.you : apiTrans.detail.yourPartner} ${
      apiTrans.detail.youCouldReceive
    } ${numberToStringCurrency(entitlementSum, language)} ${
      apiTrans.detail.youCouldReceivePerMonth
    }`
  }

  // If partner answers "No" to receiving OAS, the amounts should not show
  // if (partner && partnerNoOAS) {
  //   entitlementSum = 0
  //   resultsEligible = resultsEligible.map((benefit) => {
  //     return { ...benefit, entitlement: { ...benefit.entitlement, result: 0 } }
  //   })
  // }

  const getDeferralTable = (benefitKey, result, future): any => {
    console.log(result.cardDetail.meta?.tableData)
    return benefitKey === BenefitKey.oas &&
      result.eligibility.result === ResultKey.ELIGIBLE &&
      result.entitlement.result > 0 &&
      result.cardDetail.meta?.tableData !== null ? (
      <DeferralTable data={result.cardDetail.meta?.tableData} future={future} />
    ) : null
  }

  return (
    <>
      <div>
        <div>
          <strong>{buildSummaryString(partner)}</strong>
        </div>

        <ul className="pl-[35px] ml-[20px] my-1 list-disc text-content">
          {resultsEligible.map((benefit) => (
            <EstimatedTotalItem
              key={benefit.benefitKey}
              heading={apiTrans.benefit[benefit.benefitKey]}
              result={benefit}
              displayAmount={true}
            />
          ))}
        </ul>
        {/* {resultsEligible.map((benefit) => {
          const collapsedDetails = benefit.cardDetail?.collapsedText

          return (
            <>
              {collapsedDetails &&
                collapsedDetails.map((detail, index) => (
                  <CustomCollapse
                    datacy={`collapse-${benefit.benefitKey}-${index}`}
                    key={`collapse-${benefit.benefitKey}-${index}`}
                    id={`collapse-${benefit.benefitKey}-${index}`}
                    title={detail.heading}
                  >
                    <p
                      className="leading-[26px]"
                      dangerouslySetInnerHTML={{ __html: detail.text }}
                    />
                    {getDeferralTable(benefit.benefitKey, benefit, true) &&
                      // detail.heading ===
                      //   apiTrans.detailWithHeading.yourDeferralOptions
                      //     .heading &&
                      getDeferralTable(benefit.benefitKey, benefit, true)}
                  </CustomCollapse>
                ))}
            </>
          )
        })} */}
      </div>
    </>
  )
}
