import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { MaritalStatus } from '../../utils/api/definitions/enums'
import { useTranslation } from '../Hooks'

export const Modal: React.VFC<{
  isOpen
  onClose
  position
  partner
  maritalStatus
}> = ({ isOpen, onClose, position, partner, maritalStatus }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)

  if (!isOpen) return null

  const getModalString = () => {
    let text = ''

    if (partner) {
      text =
        maritalStatus === MaritalStatus.PARTNERED
          ? apiTrans.modal.partnerCoupleIncomeTooHigh
          : apiTrans.modal.partnerIncomeTooHigh
    } else {
      text =
        maritalStatus === MaritalStatus.PARTNERED
          ? apiTrans.modal.userCoupleIncomeTooHigh
          : apiTrans.modal.userIncomeTooHigh
    }

    return text
  }

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="modal-content w-6/12 sm:h-1/3 md:h-1/5 bg-white p-6  shadow-lg z-50">
        <h2 className="h2">
          {!partner
            ? apiTrans.modal.userHeading
            : apiTrans.modal.partnerHeading}
        </h2>
        <p>{getModalString()}</p>
        <div className="mt-4 flex justify-start">
          <button
            className="bg-[#26374A] sm:w-full md:w-1/12 mt-4 text-white p-3"
            onClick={onClose}
          >
            {apiTrans.modal.close}
          </button>
        </div>
      </div>
    </div>
  )
}
