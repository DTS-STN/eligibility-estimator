import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  EntitlementResultType,
  Locale,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'

export const ResultsTableRowMobile: React.VFC<{
  heading: string
  tsln: WebTranslations
  data: BenefitResult
  showEntitlement: boolean
  locale: Locale
}> = ({ heading, tsln, data, showEntitlement, locale }) => {
  return (
    <>
      <div className="mb-4">
        <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
          {heading}
        </p>
        <p className="px-1.5 py-1.5">
          <span className="font-bold">{tsln.resultsPage.tableHeader2}: </span>
          <span
            className="summary-link"
            dangerouslySetInnerHTML={{
              __html: data.eligibility.detail.split('\n')[0],
            }}
          />
        </p>
        <p className="px-1.5">
          <span
            className="inline summary-link"
            dangerouslySetInnerHTML={{
              __html: data.eligibility.detail.split('\n')[1],
            }}
          />
        </p>
        {showEntitlement && (
          <p className="px-1.5 py-1.5">
            <span className="font-bold">{tsln.resultsPage.tableHeader4}: </span>
            {data.entitlement.type !== EntitlementResultType.UNAVAILABLE
              ? numberToStringCurrency(data?.entitlement?.result ?? 0, locale)
              : 'Unavailable'}
          </p>
        )}
      </div>
    </>
  )
}
