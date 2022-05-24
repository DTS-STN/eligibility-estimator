import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import {
  EntitlementResultType,
  Locale,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'

export const ResultsTableRowNew: React.VFC<{
  heading: string
  data: BenefitResult
  locale: Locale
  showEntitlement: boolean
}> = ({ heading, data, locale, showEntitlement }) => {
  return (
    <>
    {data.entitlement.result !== 0 ? (
      <tr className='border border-[#DDDDDD]'>
        <td>{heading}</td>
        {showEntitlement && (
          <td className="text-right min-w-[68px]">
            {data.entitlement.type !== EntitlementResultType.UNAVAILABLE
              ? numberToStringCurrency(data.entitlement.result ?? 0, locale)
              : 'Unavailable'}
          </td>
        )}
      </tr>
      ) : '' }
    </>
  )
}
