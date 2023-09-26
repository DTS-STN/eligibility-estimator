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
    returns benefit name with from/de and proper article. ... french nuances.
  */

  function displayBenefitName(benefitName: string, result: number): string {
    if (tsln._language === Language.EN) {
      return ` from the ${benefitName}`
    } else {
      switch (benefitName) {
        case tsln.oas:
          const lowCase =
            benefitName.charAt(0).toLowerCase() + benefitName.slice(1)
          return ` de la ${lowCase}`
        case tsln.gis:
          return ` du ${benefitName}`
        default:
          return ` de l'${benefitName}`
      }
    }
  }

  if (!result.entitlement) return null

  return (
    <li>
      <strong>
        {numberToStringCurrency(result.entitlement.result, tsln._language)}
      </strong>
      {displayBenefitName(heading, result.entitlement.result)}
    </li>
  )
}
