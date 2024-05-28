import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, SummaryState } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const SummaryEstimates: React.VFC<{
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
    return `${partner ? apiTrans.detail.yourPartner : ''} ${
      apiTrans.detail.youCouldReceive
    } ${numberToStringCurrency(entitlementSum, language)} ${
      apiTrans.detail.youCouldReceivePerMonth
    }`
  }

  // If partner answers "No" to receiving OAS, the amounts should not show
  if (partner && partnerNoOAS) {
    entitlementSum = 0
    resultsEligible = resultsEligible.map((benefit) => {
      return { ...benefit, entitlement: { ...benefit.entitlement, result: 0 } }
    })
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
              displayAmount={partner && partnerNoOAS ? false : true}
            />
          ))}
        </ul>
      </div>
    </>
  )
}
