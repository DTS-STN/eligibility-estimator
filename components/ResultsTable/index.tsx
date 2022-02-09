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
    <>
      <table className="hidden md:block text-left">
        <thead className="font-semibold text-content border-b border-content">
          <tr className=" ">
            <th>{tsln.resultsPage.tableHeader1}</th>
            <th>{tsln.resultsPage.tableHeader2}</th>
            <th>{tsln.resultsPage.tableHeader3}</th>
          </tr>
        </thead>
        <tbody className="align-top">
          <tr>
            <td>Old Age Security (OAS)</td>
            <td>
              <EligibilityDetails eligibilityType={root.oas} />
            </td>
            <td>
              {numberToStringCurrency(root.oas.entitlement.result, locale)}
            </td>
          </tr>
          <tr className="bg-[#E8F2F4]">
            <td>Guaranteed Income Supplement (GIS)</td>
            <td>
              <EligibilityDetails eligibilityType={root.gis} />
            </td>
            <td>
              {root.gis.entitlement.type !== EntitlementResultType.UNAVAILABLE
                ? numberToStringCurrency(root.gis.entitlement.result, locale)
                : 'Unavailable'}
            </td>
          </tr>
          <tr>
            <td>Allowance</td>
            <td>
              <EligibilityDetails eligibilityType={root.allowance} />
            </td>
            <td>
              {numberToStringCurrency(
                root.allowance.entitlement.result,
                locale
              )}
            </td>
          </tr>
          <tr className="bg-[#E8F2F4]">
            <td>Allowance for Survivor</td>
            <td>
              <EligibilityDetails eligibilityType={root.afs} />
            </td>
            <td>
              {numberToStringCurrency(root.afs.entitlement.result, locale)}
            </td>
          </tr>
          <tr className="border-t border-content font-semibold ">
            <td colSpan={2}>{tsln.resultsPage.tableTotalAmount}</td>
            <td>${root.totalEntitlementInDollars}</td>
          </tr>
        </tbody>
      </table>
      <div className="block md:hidden">
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Old Age Security (OAS)
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.oas} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>
            {numberToStringCurrency(root.oas.entitlement.result, locale)}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Guaranteed Income Supplement (GIS)
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.gis} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>
            {root.gis.entitlement.type !== EntitlementResultType.UNAVAILABLE
              ? numberToStringCurrency(root.gis.entitlement.result, locale)
              : 'Unavailable'}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Allowance
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.allowance} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>
            {numberToStringCurrency(root.allowance.entitlement.result, locale)}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Allowance for the Survivor
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.afs} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>
            {numberToStringCurrency(root.afs.entitlement.result, locale)}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Estimated Total Monthly Benefit Amount
          </p>
          <p className="px-1.5 py-1.5 font-bold">
            {numberToStringCurrency(root.summary.entitlementSum, locale)}
          </p>
        </div>
      </div>
    </>
  )
})
