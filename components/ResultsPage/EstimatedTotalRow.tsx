import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  EntitlementResultType,
  Locale,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'

export const EstimatedTotalRow: React.VFC<{
  heading: string
  result: BenefitResult
  locale: Locale
  showEntitlement: boolean
}> = ({ heading, result, locale, showEntitlement }) => {
  const tsln = useTranslation<WebTranslations>()

  if (!result.entitlement || result.entitlement.result === 0) return null

  return (
    <tr className="border border-[#DDDDDD]">
      <td className="pl-5">{heading}</td>
      {showEntitlement && (
        <td className="text-right pr-5">
          {result.entitlement.type !== EntitlementResultType.UNAVAILABLE
            ? numberToStringCurrency(result.entitlement.result ?? 0, locale)
            : tsln.unavailable}
        </td>
      )}
    </tr>
  )
}
