import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import {
  EntitlementResultType,
  Locale,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'

export const ResultsTableRowDesktop: React.VFC<{
  heading: string
  data: BenefitResult
  locale: Locale
  showEntitlement: boolean
  tintedBackground: boolean
}> = ({ heading, data, locale, showEntitlement, tintedBackground }) => {
  const className = tintedBackground ? 'bg-[#E8F2F4]' : ''
  return (
    <>
      <tr className={className}>
        <td>{heading}</td>
        <td>
          <p
            className="summary-link"
            dangerouslySetInnerHTML={{
              __html: data.eligibility.detail.split('\n')[0],
            }}
          />
        </td>
        <td>
          <p
            className="summary-link"
            dangerouslySetInnerHTML={{
              __html: data.eligibility.detail.split('\n')[1],
            }}
          />
        </td>
        {showEntitlement && (
          <td className="text-right min-w-[68px]">
            {data.entitlement.type !== EntitlementResultType.UNAVAILABLE
              ? numberToStringCurrency(data.entitlement.result ?? 0, locale)
              : 'Unavailable'}
          </td>
        )}
      </tr>
    </>
  )
}
