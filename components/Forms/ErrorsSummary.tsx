import { useTranslation } from '../Hooks'
import { WebTranslations } from '../../i18n/web'
import { ContextualAlert as Message } from './ContextualAlert'
import { Language } from '../../utils/api/definitions/enums'
import Link from 'next/link'

export const ErrorsSummary: any = ({ errorFields, receiveOAS }) => {
  const tsln = useTranslation<WebTranslations>()
  const incomeError = receiveOAS
    ? tsln.validationErrors['incomeEmptyReceiveOAS']
    : tsln.validationErrors['incomeEmpty']
  const partnerIncomeError = receiveOAS
    ? tsln.validationErrors['partnerIncomeEmptyReceiveOAS']
    : tsln.validationErrors['partnerIncomeEmpty']

  if (errorFields.length === 0) return null

  const messageBody = (
    <ol>
      {errorFields.map((field) => {
        return (
          <li key={field.key}>
            <Link href={`questions#${field.key}`}>
              <a
                id={`errorbox-${field.key}`}
                target="_self"
                aria-label={tsln.resultsEditAriaLabels[field.key]}
                className="underline text-[#284162] text-[20px] leading-[22px] hover:text-[#0535D2]"
              >
                {field.key === 'income'
                  ? incomeError
                  : field.key === 'partnerIncome'
                  ? partnerIncomeError
                  : field.error}
              </a>
            </Link>
          </li>
        )
      })}
    </ol>
  )

  const titleTranslation =
    tsln._language === Language.EN
      ? errorFields.length === 1
        ? ' error was found'
        : ' errors were found'
      : errorFields.length === 1
      ? ' erreur a été trouvée'
      : ' erreurs ont été trouvées'

  return (
    <div
      id="errorField"
      className="border-[2px] border-specific-red-red50b rounded py-4 mb-2"
      aria-live="polite"
    >
      <Message
        id={`form-errors-${errorFields.length}`}
        type="danger"
        heading={tsln.errorBoxTitle + errorFields.length + titleTranslation}
        body={messageBody}
        iconId="form-errors"
        iconAltText={tsln.warningText}
      />
    </div>
  )
}
