import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'

export const EstimatedTotalItem: React.VFC<{
  heading: string
  result: BenefitResult
  displayAmount: boolean
}> = ({ heading, result, displayAmount }) => {
  const tsln = useTranslation<WebTranslations>()
  /*
    returns benefit name with from/de and proper article. ... french nuances.
  */

  function displayBenefitName(
    benefitName: string,
    result: number,
    displayAmount: boolean
  ): string {
    if (tsln._language === Language.EN) {
      return displayAmount ? ` from the ${benefitName}` : `the ${benefitName}`
    } else {
      switch (benefitName) {
        case tsln.oas:
          const lowCase =
            benefitName.charAt(0).toLowerCase() + benefitName.slice(1)
          return displayAmount ? ` de la ${lowCase}` : `la ${lowCase}`
        case tsln.gis:
          return displayAmount ? ` du ${benefitName}` : `le ${benefitName}`
        default:
          return displayAmount ? ` de l'${benefitName}` : `l'${benefitName}`
      }
    }
  }

  if (!result.entitlement) return null

  return (
    <li>
      {displayAmount &&
        numberToStringCurrency(result.entitlement.result, tsln._language)}
      {displayBenefitName(heading, result.entitlement.result, displayAmount)}
    </li>
  )
}
