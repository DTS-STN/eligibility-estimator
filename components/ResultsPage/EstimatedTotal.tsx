import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, SummaryState } from '../../utils/api/definitions/enums'
import { BenefitResult, SummaryObject } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { EstimatedTotalRow } from './EstimatedTotalRow'

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

  return (
    <>
      <h2 id="estimated" className="h2 mt-12">
        <Image
          src="/money.png"
          alt={tsln.resultsPage.dollarSign}
          width={30}
          height={30}
        />{' '}
        {tsln.resultsPage.yourEstimatedTotal}
        {numberToStringCurrency(summary.entitlementSum, language)}
      </h2>

      <div>
        <p className="pl-[35px]">
          {introSentence.replace(
            '{AMOUNT}',
            numberToStringCurrency(summary.entitlementSum, language)
          )}
        </p>
        <h3 className="my-6 font-semibold">{tsln.resultsPage.header}</h3>
        <table className="text-left w-full">
          <thead className="font-bold border border-[#DDDDDD] bg-[#EEEEEE]">
            <tr>
              <th className="pl-5">{tsln.resultsPage.tableHeader1}</th>
              <th className="pr-5 text-right">
                {tsln.resultsPage.tableHeader2}
              </th>
            </tr>
          </thead>

          <tbody className="align-top">
            {resultsEligible.map((benefit) => (
              <EstimatedTotalRow
                key={benefit.benefitKey}
                heading={apiTrans.benefit[benefit.benefitKey]}
                result={benefit}
                showEntitlement={summary.entitlementSum != 0}
              />
            ))}
            {summary.entitlementSum != 0 && (
              <tr className="border border-[#DDDDDD]">
                <td className="pl-5">{tsln.resultsPage.tableTotalAmount}</td>
                <td className="text-right min-w-[68px] pr-5">
                  {numberToStringCurrency(summary.entitlementSum, language)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
