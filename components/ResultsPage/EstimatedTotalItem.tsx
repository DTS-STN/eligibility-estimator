import React, { useState } from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { Modal } from './Modal'
import Image from 'next/image'
import { Button } from '../Forms/Button'

export const EstimatedTotalItem: React.VFC<{
  heading: string
  result: BenefitResult
  displayAmount: boolean
  partner: boolean
  maritalStatus
}> = ({ heading, result, displayAmount, partner, maritalStatus }) => {
  const tsln = useTranslation<WebTranslations>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  /*
    returns benefit name with from/de and proper article. ... french nuances.
  */

  const openModal = (e) => {
    setModalPosition({ x: e.clientX, y: e.clientY })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

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
    <li key={`benefitName-${displayAmount}`} className="align-middle">
      {displayAmount &&
        numberToStringCurrency(result.entitlement.result, tsln._language)}
      {displayBenefitName(heading, result.entitlement.result, displayAmount)}
      {result.entitlement.result == 0 && (
        <>
          <span className="align-middle ml-2">
            <button
              onClick={openModal}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              aria-label={tsln.resultsPage.moreInformation + ' ' + heading}
            >
              <Image
                className="cursor-pointer"
                src="/moreInfo.png"
                alt={tsln.resultsPage.moreInformation + ' ' + heading}
                width="25"
                height="25"
                onClick={openModal}
              />
            </button>

            <Modal
              isOpen={modalOpen}
              onClose={closeModal}
              partner={partner}
              maritalStatus={maritalStatus}
            />
          </span>
        </>
      )}
    </li>
  )
}
