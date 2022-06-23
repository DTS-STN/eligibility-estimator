import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  EntitlementResultType,
  Locale,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'

export const ResultsTableRow: React.VFC<{
  heading: string
  data: BenefitResult
  locale: Locale
  showEntitlement: boolean
}> = ({ heading, data, locale, showEntitlement }) => {
  const tsln = useTranslation<WebTranslations>()

  const html =
    data.entitlement?.result !== 0 ? (
      <tr className="border border-[#DDDDDD]">
        <td className="pl-5">{heading}</td>
        {showEntitlement && (
          <td className="text-right pr-5">
            {data.entitlement.type !== EntitlementResultType.UNAVAILABLE
              ? numberToStringCurrency(data.entitlement.result ?? 0, locale)
              : tsln.unavailable}
          </td>
        )}
      </tr>
    ) : (
      ''
    )

  if (html === '') return null
  else return <>{html}</>
}
