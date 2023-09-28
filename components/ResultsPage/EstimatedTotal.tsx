import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, SummaryState } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
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

  const getText = (type) => {
    switch (type) {
      case 'header':
        return partner
          ? tsln.resultsPage.partnerEstimatedTotal
          : tsln.resultsPage.yourEstimatedTotal
      case 'intro':
        return partner
          ? tsln.resultsPage.basedOnPartnerInfoTotal
          : tsln.resultsPage.basedOnYourInfoTotal
    }
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
      <h2 id={partner ? 'partner-estimate' : 'estimate'} className="h2 mt-12">
        {entitlementSum != 0 ? (
          <Image src="/money.png" alt="" width={30} height={30} />
        ) : (
          <Image src="/green-check-mark.svg" alt="" width={30} height={30} />
        )}
        {getText('header')}
      </h2>

      <div>
        <p
          className="pl-[35px]"
          dangerouslySetInnerHTML={{
            __html: getText('intro'),
          }}
        />

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

        {entitlementSum != 0 && resultsEligible.length > 1 && (
          <p className="pl-[35px]">
            {partner ? tsln.resultsPage.partnerTotal : tsln.resultsPage.total}
            <strong>{numberToStringCurrency(entitlementSum, language)}</strong>.
          </p>
        )}
      </div>
    </>
  )
}
