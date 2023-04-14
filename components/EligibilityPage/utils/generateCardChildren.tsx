import { ContextualAlert as Message } from '@dts-stn/service-canada-design-system'
import { CurrencyField } from '../../Forms/CurrencyField'
import { MonthAndYear } from '../../Forms/MonthAndYear'
import { NumberField } from '../../Forms/NumberField'
import { Radio } from '../../Forms/Radio'
import { FormSelect } from '../../Forms/Select'
import { TextField } from '../../Forms/TextField'
import { MaritalStatus, Steps } from '../../../utils/api/definitions/enums'
import { FieldKey, FieldType } from '../../../utils/api/definitions/fields'
import { CardChildren } from '../../../utils/api/definitions/types'
import { FormField } from '../../../client-state/FormField'
import { getErrorForField, getPlaceholderForSelect } from '.'
import { debounce } from 'lodash'
import { useTranslation } from '../../Hooks'
import { WebTranslations } from '../../../i18n/web'

export default function generateCardChildren(
  form,
  stepKeys: FieldKey[],
  handleOnChange,
  errorsVisible,
  tsln
): CardChildren {
  const fields = form.visibleFields.filter((field) =>
    stepKeys.includes(field.key)
  )

  return fields.map((field: FormField) => {
    const [formError, alertError] = getErrorForField(field, errorsVisible)

    return (
      <div key={field.key}>
        <div className="pb-4" id={field.key}>
          {field.config.type === FieldType.DATE && (
            <MonthAndYear
              name={field.key}
              label={field.config.label}
              helpText={field.config.helpText}
              baseOnChange={(newValue) => handleOnChange(field, newValue)}
              requiredText={tsln.required}
              error={formError}
            />
          )}
          {field.config.type === FieldType.NUMBER && (
            <NumberField
              type={field.config.type}
              name={field.key}
              label={field.config.label}
              placeholder={field.config.placeholder ?? ''}
              onChange={debounce(
                (e) => handleOnChange(field, e.target.value),
                500
              )}
              value={field.value}
              requiredText={tsln.required}
              helpText={field.config.helpText}
              error={formError}
            />
          )}
          {field.config.type == FieldType.CURRENCY && (
            <CurrencyField
              type={field.config.type}
              name={field.key}
              label={field.config.label}
              onChange={debounce(
                (e) => handleOnChange(field, e.target.value),
                100
              )}
              placeholder={field.config.placeholder ?? ''}
              value={field.value}
              helpText={field.config.helpText}
              requiredText={tsln.required}
              error={formError}
            />
          )}
          {field.config.type == FieldType.STRING && (
            <TextField
              type={field.config.type}
              name={field.key}
              label={field.config.label}
              placeholder={field.config.placeholder ?? ''}
              onChange={debounce((e) => {
                handleOnChange(field, e.target.value)
              }, 500)}
              value={field.value}
              error={field.error}
            />
          )}
          {(field.config.type == FieldType.DROPDOWN ||
            field.config.type == FieldType.DROPDOWN_SEARCHABLE) && (
            <FormSelect
              name={field.key}
              field={field}
              requiredText={tsln.required}
              placeholder={getPlaceholderForSelect(field, tsln)}
              customOnChange={(newValue: { value: string; label: string }) =>
                handleOnChange(field, newValue.value)
              }
              value={null}
            />
          )}
          {field.config.type == FieldType.RADIO && (
            <Radio
              name={field.key}
              checkedValue={field.value}
              values={field.config.values}
              keyforid={field.key}
              label={field.config.label}
              requiredText={tsln.required}
              onChange={(e) => handleOnChange(field, e.target.value)}
              helpText={field.config.helpText}
              setValue={(val) => handleOnChange(field, val)}
              error={formError}
            />
          )}
        </div>
        {field.error && alertError && (
          <div className="mt-6 md:pr-12 msg-container border-warning">
            <Message
              id={field.key}
              alert_icon_id={field.key}
              alert_icon_alt_text={tsln.warningText}
              type={'warning'}
              message_heading={tsln.unableToProceed}
              message_body={field.error}
              asHtml={true}
              whiteBG={true}
            />
          </div>
        )}
        {/* {showWarningMessage(field)} */}
        {field.key === FieldKey.MARITAL_STATUS &&
          field.value === MaritalStatus.PARTNERED && (
            <div className="my-6">
              <p className="ds-accordion-header mb-4">
                {tsln.partnerInformation}
              </p>
              <p>{tsln.partnerInformationDescription}</p>
            </div>
          )}
      </div>
    )
  })
}
