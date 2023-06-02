import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, SummaryState } from '../../utils/api/definitions/enums'
import { BenefitResult, SummaryObject } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const EstimatedTotal: React.VFC<{
  resultsEligible: BenefitResult[]
  summary: SummaryObject
}> = ({ resultsEligible, summary }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)

  const language = useRouter().locale as Language

  const introSentence =
    summary.state === SummaryState.AVAILABLE_DEPENDING
      ? tsln.resultsPage.basedOnYourInfoAndIncomeTotal
      : tsln.resultsPage.basedOnYourInfoTotal

  const totalSentence =
    summary.state === SummaryState.AVAILABLE_DEPENDING
      ? tsln.resultsPage.ifIncomeNotProvided
      : null

  const headerSentence =
    summary.entitlementSum != 0
      ? tsln.resultsPage.yourEstimatedTotal
      : tsln.resultsPage.yourEstimatedNoIncome

  return (
    <>
      <h2 id="estimated" className="h2 mt-12">
        {summary.entitlementSum != 0 ? (
          <Image src="/money.png" alt="" width={30} height={30} />
        ) : (
          <Image src="/green-check-mark.svg" alt="" width={30} height={30} />
        )}
        {headerSentence}
      </h2>

      <div>
        <p
          className="pl-[35px]"
          dangerouslySetInnerHTML={{
            __html: introSentence.replace(
              '{AMOUNT}',
              numberToStringCurrency(summary.entitlementSum, language)
            ),
          }}
        />

        <ul className="pl-[35px] ml-[20px] my-2 list-disc text-content">
          {resultsEligible.map((benefit) => (
            <EstimatedTotalItem
              key={benefit.benefitKey}
              heading={apiTrans.benefit[benefit.benefitKey]}
              result={benefit}
            />
          ))}
        </ul>

        {summary.entitlementSum != 0 && (
          <p className="pl-[35px]">
            {tsln.resultsPage.total}
            <strong>
              {numberToStringCurrency(summary.entitlementSum, language)}
            </strong>
            . {totalSentence}
          </p>
        )}
      </div>
    </>
  )
}
