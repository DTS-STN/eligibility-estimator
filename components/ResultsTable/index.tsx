import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  EntitlementResultType,
  Locale,
} from '../../utils/api/definitions/enums'
import { useStore, useTranslation } from '../Hooks'
import { EligibilityDetails } from './EligibilityDetails'

export const ResultsTable = observer(() => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()
  const currentLocale = useRouter().locale

  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR

  return (
    <div>
      <table className="hidden md:block text-left">
        <thead className="font-bold border-b border-content">
          <tr>
            <th>{tsln.resultsPage.tableHeader1}</th>
            <th>{tsln.resultsPage.tableHeader2}</th>
            {!root.summary.zeroEntitlements && (
              <th className="text-right min-w-[68px]">
                {tsln.resultsPage.tableHeader3}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="align-top">
          <tr>
            <td>{tsln.oas}</td>
            <td>
              <EligibilityDetails eligibilityType={root.oas} />
            </td>
            {!root.summary.zeroEntitlements && (
              <td className="text-right min-w-[68px]">
                {numberToStringCurrency(root.oas.entitlement.result, locale)}
              </td>
            )}
          </tr>
          <tr className="bg-[#E8F2F4]">
            <td>{tsln.gis}</td>
            <td>
              <EligibilityDetails eligibilityType={root.gis} />
            </td>
            {!root.summary.zeroEntitlements && (
              <td className="text-right min-w-[68px]">
                {root.gis.entitlement.type !== EntitlementResultType.UNAVAILABLE
                  ? numberToStringCurrency(root.gis.entitlement.result, locale)
                  : 'Unavailable'}
              </td>
            )}
          </tr>
          <tr>
            <td>{tsln.alw}</td>
            <td>
              <EligibilityDetails eligibilityType={root.allowance} />
            </td>
            {!root.summary.zeroEntitlements && (
              <td className="text-right min-w-[68px]">
                {numberToStringCurrency(
                  root.allowance.entitlement.result,
                  locale
                )}
              </td>
            )}
          </tr>
          <tr className="bg-[#E8F2F4]">
            <td>{tsln.afs}</td>
            <td>
              <EligibilityDetails eligibilityType={root.afs} />
            </td>
            {!root.summary.zeroEntitlements && (
              <td className="text-right min-w-[68px]">
                {numberToStringCurrency(root.afs.entitlement.result, locale)}
              </td>
            )}
          </tr>
          {!root.summary.zeroEntitlements && (
            <tr className="border-t border-content font-bold ">
              <td colSpan={2}>{tsln.resultsPage.tableTotalAmount}</td>
              <td className="text-right min-w-[68px]">
                {numberToStringCurrency(root.summary.entitlementSum, locale)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="block md:hidden">
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
            {tsln.oas}
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader2}: </span>
            <EligibilityDetails eligibilityType={root.oas} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader3}: </span>
            {numberToStringCurrency(root.oas.entitlement.result, locale)}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
            {tsln.gis}
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader2}: </span>
            <EligibilityDetails eligibilityType={root.gis} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader3}: </span>
            {root.gis.entitlement.type !== EntitlementResultType.UNAVAILABLE
              ? numberToStringCurrency(root.gis.entitlement.result, locale)
              : 'Unavailable'}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
            {tsln.alw}
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader2}: </span>
            <EligibilityDetails eligibilityType={root.allowance} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader3}: </span>
            {numberToStringCurrency(root.allowance.entitlement.result, locale)}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
            {tsln.afs}
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader2}: </span>
            <EligibilityDetails eligibilityType={root.afs} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader3}: </span>
            {numberToStringCurrency(root.afs.entitlement.result, locale)}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
            {tsln.resultsPage.tableTotalAmount}
          </p>
          <p className="px-1.5 py-1.5 font-bold">
            {numberToStringCurrency(root.summary.entitlementSum, locale)}
          </p>
        </div>
      </div>
    </div>
  )
})
