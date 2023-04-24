import { useTranslation } from '../Hooks'
import { WebTranslations } from '../../i18n/web'
import {
  ContextualAlert as Message,
  Link as DSLink,
} from '@dts-stn/service-canada-design-system'
import { Language } from '../../utils/api/definitions/enums'

export const ErrorsSummary: any = ({ errorFields }) => {
  const tsln = useTranslation<WebTranslations>()
  if (errorFields.length === 0) return null

  const messageBody = (
    <ol>
      {errorFields.map((field) => {
        return (
          <li key={field.key}>
            <DSLink
              id={`errorbox-${field.key}`}
              href={`eligibility#${field.key}`}
              text={field.error}
              target="_self"
              ariaLabel={tsln.resultsEditAriaLabels[field.key]}
            />
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
    <div className="border-2 border-danger rounded py-4 mb-2">
      <Message
        id={`form-errors-${errorFields.length}`}
        type="danger"
        message_heading={
          tsln.errorBoxTitle + errorFields.length + titleTranslation
        }
        message_body={messageBody}
        alert_icon_id="form-errors"
        alert_icon_alt_text={tsln.warningText}
      />
    </div>
  )
}
