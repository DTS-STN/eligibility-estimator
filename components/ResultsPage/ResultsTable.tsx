import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Locale } from '../../utils/api/definitions/enums'
import { useStore, useTranslation } from '../Hooks'
import { ResultsTableRowDesktop } from './ResultsTableRowDesktop'
import { ResultsTableRowMobile } from './ResultsTableRowMobile'

export const ResultsTable = observer(() => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()
  const currentLocale = useRouter().locale

  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR

  // Send the details and eligibility results separately and create a new column
  return (
    <div>
      <h3 className="h3 mb-5">{tsln.resultsPage.header}</h3>
      {/* desktop only */}
      <table className="hidden md:block text-left">
        <thead className="font-bold border-b border-content">
          <tr>
            <th>{tsln.resultsPage.tableHeader1}</th>
            <th>{tsln.resultsPage.tableHeader2}</th>
            <th>{tsln.resultsPage.tableHeader3}</th>
            {!root.summary.zeroEntitlements && (
              <th className="text-right min-w-[68px]">
                {tsln.resultsPage.tableHeader4}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="align-top">
          <ResultsTableRowDesktop
            heading={tsln.oas}
            data={root.oas}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={false}
          />
          <ResultsTableRowDesktop
            heading={tsln.gis}
            data={root.gis}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={true}
          />
          <ResultsTableRowDesktop
            heading={tsln.alw}
            data={root.allowance}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={false}
          />
          <ResultsTableRowDesktop
            heading={tsln.afs}
            data={root.afs}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={true}
          />
          {!root.summary.zeroEntitlements && (
            <tr className="border-t border-content font-bold">
              <td colSpan={3}>{tsln.resultsPage.tableTotalAmount}</td>
              <td className="text-right min-w-[68px]">
                {numberToStringCurrency(root.summary.entitlementSum, locale)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* mobile only */}
      <div className="block md:hidden">
        <ResultsTableRowMobile
          heading={tsln.oas}
          tsln={tsln}
          data={root.oas}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        <ResultsTableRowMobile
          heading={tsln.gis}
          tsln={tsln}
          data={root.gis}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        <ResultsTableRowMobile
          heading={tsln.alw}
          tsln={tsln}
          data={root.allowance}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        <ResultsTableRowMobile
          heading={tsln.afs}
          tsln={tsln}
          data={root.afs}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        {!root.summary.zeroEntitlements && (
          <div className="mb-4">
            <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
              {tsln.resultsPage.tableTotalAmount}
            </p>
            <p className="px-1.5 py-1.5 font-bold">
              {numberToStringCurrency(root.summary.entitlementSum, locale)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
})
