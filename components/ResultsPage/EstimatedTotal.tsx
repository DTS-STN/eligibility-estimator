import { Instance } from 'mobx-state-tree'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Summary } from '../../client-state/store'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Locale } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { ResultsTableRow } from './ResultsTableRow'

export const EstimatedTotal: React.VFC<{
  resultsEligible: BenefitResult[]
  summary: Instance<typeof Summary>
}> = ({ resultsEligible, summary }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)

  const currentLocale = useRouter().locale
  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR

  return (
    <>
      <h2 id="estimated" className="h2 mt-12">
        <Image
          src="/money.png"
          alt={tsln.resultsPage.dollarSign}
          width={30}
          height={30}
        />
        {tsln.resultsPage.yourEstimatedTotal}
        {numberToStringCurrency(summary.entitlementSum, locale)}
      </h2>

      <div className="pl-12">
        {tsln.resultsPage.basedOnYourInfoTotal}
        {numberToStringCurrency(summary.entitlementSum, locale)}
        <h3 className="my-6 font-semibold">{tsln.resultsPage.header}</h3>
        <table className="hidden md:block text-left">
          <thead className="font-bold border border-[#DDDDDD] bg-[#EEEEEE]">
            <tr>
              <th>{tsln.resultsPage.tableHeader1}</th>
              <th>{tsln.resultsPage.tableHeader2}</th>
            </tr>
          </thead>

          <tbody className="align-top">
            {resultsEligible.map((benefit) => (
              <ResultsTableRow
                key={benefit.benefitKey}
                heading={apiTrans.benefit[benefit.benefitKey]}
                data={benefit}
                locale={locale}
                showEntitlement={!summary.zeroEntitlements}
              />
            ))}
            {!summary.zeroEntitlements && (
              <tr className="border border-[#DDDDDD]">
                <td>{tsln.resultsPage.tableTotalAmount}</td>
                <td className="text-right min-w-[68px]">
                  {numberToStringCurrency(summary.entitlementSum, locale)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
