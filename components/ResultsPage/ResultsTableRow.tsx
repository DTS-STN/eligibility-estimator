import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import {
  EntitlementResultType,
  Locale,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'

export const ResultsTableRow: React.VFC<{
  heading: string
  data: BenefitResult
  locale: Locale
  showEntitlement: boolean
}> = ({ heading, data, locale, showEntitlement }) => {

  const datax = (data.entitlement?.result !== 0) ? (
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
    ) : ''

    if (datax === '') return null
    else return (
    <>
      {datax} 
    </>
  )
}
