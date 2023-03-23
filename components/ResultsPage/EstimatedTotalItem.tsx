import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'

export const EstimatedTotalItem: React.VFC<{
  heading: string
  result: BenefitResult
}> = ({ heading, result }) => {
  const tsln = useTranslation<WebTranslations>()

  /*
    returns benefit name with proper article
  */
  function displayBenefitName(benefitName: string): string {
    if (tsln._language === Language.EN) {
      return `the ${benefitName}`
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

  // console.log(!result.entitlement, result.entitlement)

  if (!result.entitlement) return null

  return (
    <li>
      <strong>
        {result.entitlement.result > 0
          ? numberToStringCurrency(
              result.entitlement.result ?? 0,
              tsln._language
            )
          : ''}
      </strong>

      {result.entitlement.result > 0 ? tsln.resultsPage.from : ''}

      {displayBenefitName(heading)}
    </li>
  )
}
