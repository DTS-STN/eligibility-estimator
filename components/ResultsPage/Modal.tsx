import { Button } from '../Forms/Button'
import { useEffect, useRef } from 'react'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { MaritalStatus } from '../../utils/api/definitions/enums'
import { useTranslation } from '../Hooks'

export const Modal: React.VFC<{
  isOpen
  onClose
  partner
  maritalStatus
  benefitName
  involSep
}> = ({ isOpen, onClose, partner, maritalStatus, benefitName, involSep }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)
  const modalRef = useRef(null)

  // ########## Block start ##########

  useEffect(() => {
    if (isOpen) {
      // Focus the first focusable element when the modal opens
      const firstFocusableRef = modalRef.current.querySelectorAll('button')

      firstFocusableRef[0].focus()

      // Event listener for trapping focus
      const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
          )

          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]

          if (event.shiftKey && document.activeElement === firstElement) {
            // Shift + Tab pressed on first element: move focus to the last element
            event.preventDefault()
            lastElement.focus()
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            // Tab pressed on the last element: move focus to the first element
            event.preventDefault()
            firstElement.focus()
          }
        }
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // ########## Block End ##########

  if (!isOpen) return null

  const getModalString = () => {
    let text = ''

    if (partner) {
      text =
        maritalStatus === MaritalStatus.PARTNERED
          ? benefitName === tsln.oas
            ? apiTrans.modal.partnerIncomeTooHigh
            : involSep == 'true'
            ? apiTrans.modal.partnerIncomeTooHigh
            : apiTrans.modal.partnerCoupleIncomeTooHigh
          : apiTrans.modal.partnerIncomeTooHigh
    } else {
      text =
        maritalStatus === MaritalStatus.PARTNERED
          ? benefitName === tsln.oas
            ? apiTrans.modal.userIncomeTooHigh
            : involSep == 'true'
            ? apiTrans.modal.userIncomeTooHigh
            : apiTrans.modal.userCoupleIncomeTooHigh
          : apiTrans.modal.userIncomeTooHigh
    }

    return text
  }

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      // aria-describedby="modalDescription"
      ref={modalRef}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        role={'document'}
        className="modal-content md:w-6/12 sm:w-9/12 bg-white p-6  shadow-lg z-50"
      >
        <h2 className="h2" id="modalTitle">
          {!partner
            ? apiTrans.modal.userHeading
            : apiTrans.modal.partnerHeading}
        </h2>
        <p id="modalDescription">{getModalString()}</p>
        <div className="mt-4 flex justify-start">
          <Button
            text={apiTrans.modal.close}
            id="closeButton"
            style="primary"
            custom="mt-6 justify-center md:w-[fit-content]"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  )
}
