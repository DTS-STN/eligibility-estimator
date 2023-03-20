import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import {
  EntitlementResultType,
  Language,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'

export const EstimatedTotalItem: React.VFC<{
  heading: string
  result: BenefitResult
  showEntitlement: boolean
}> = ({ heading, result, showEntitlement }) => {
  const tsln = useTranslation<WebTranslations>()

  /*
    returns english benefit name or french with proper article
  */
  function displayBenefitName(benefitName: string): string {
    if (tsln._language === Language.EN) {
      return benefitName
    } else {
      switch (benefitName) {
        case tsln.oas:
          return `la ${benefitName}`
        case tsln.gis:
          return `le ${benefitName}`
        default:
          return `l'${benefitName}`
      }
    }
  }

  if (!result.entitlement || result.entitlement.result === 0) return null

  return (
    showEntitlement && (
      <li>
        <strong>
          {result.entitlement.type !== EntitlementResultType.UNAVAILABLE
            ? numberToStringCurrency(
                result.entitlement.result ?? 0,
                tsln._language
              )
            : ''}
        </strong>

        {result.entitlement.type !== EntitlementResultType.UNAVAILABLE
          ? tsln.resultsPage.from
          : ''}

        {displayBenefitName(heading)}
      </li>
    )
  )
}
