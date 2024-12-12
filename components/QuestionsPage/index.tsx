import { AccordionForm } from '@dts-stn/service-canada-design-system'
import { ContextualAlert as Message } from '../Forms/ContextualAlert'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSessionStorage } from 'react-use'
import { Form } from '../../client-state/Form'
import { FormField } from '../../client-state/FormField'
import {
  ErrorsVisibleObject,
  FieldInputsObject,
  InputHelper,
} from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { FieldsHandler } from '../../utils/api/fieldsHandler'
import { Language, MaritalStatus } from '../../utils/api/definitions/enums'
import {
  FieldConfig,
  FieldKey,
  FieldType,
} from '../../utils/api/definitions/fields'
import {
  Card,
  CardChildren,
  CardConfig,
  NextClickedObject,
  Steps,
  VisibleFieldsObject,
} from '../../utils/web/types'
import { CurrencyField } from '../Forms/CurrencyField'
import Duration from '../Forms/Duration'
import { ErrorsSummary } from '../Forms/ErrorsSummary'
import { MonthAndYear } from '../Forms/MonthAndYear'
import { NumberField } from '../Forms/NumberField'
import { Radio } from '../Forms/Radio'
import { FormSelect } from '../Forms/Select'
import { TextField } from '../Forms/TextField'
import { useMediaQuery, useTranslation } from '../Hooks'
import {
  getDefaultInputs,
  getDefaultVisibleFields,
  getErrorForField,
  getErrorVisibility,
  getKeyStepMap,
  getNextClickedObj,
  getPlaceholderForSelect,
  getStepValidity,
  getVisisbleErrorsForStep,
  getBirthMonthAndYear,
} from './utils'

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 */

export const QuestionsPage: React.VFC = ({}) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)

  const langx = useRouter().locale as Language
  const language =
    langx === Language.EN || langx === Language.FR ? langx : Language.EN

  const allFieldConfigs: FieldConfig[] = FieldsHandler.getAllFieldData(language)
  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))
  const [ageDate, setAgeDate] = useState(
    inputs.age
      ? getBirthMonthAndYear(inputs.age)
      : { month: 1, year: undefined }
  )

  const [nextForStepClicked, setNextForStepClicked]: [
    NextClickedObject,
    (value: NextClickedObject) => void
  ] = useSessionStorage('next-clicked', getNextClickedObj())

  const [errorsVisible, setErrorsVisible]: [
    ErrorsVisibleObject,
    (value: ErrorsVisibleObject) => void
  ] = useSessionStorage('errors-visible', getErrorVisibility(allFieldConfigs))

  const [visibleFields]: [
    VisibleFieldsObject,
    (value: VisibleFieldsObject) => void
  ] = useState(getDefaultVisibleFields(allFieldConfigs))

  const inputHelper = new InputHelper(inputs, setInputs, language)
  const form = new Form(language, inputHelper, visibleFields)
  const errorsAsAlerts = ['legalStatus', 'everLivedSocialCountry']
  const keyStepMap: { [x in Steps]: CardConfig } = getKeyStepMap(
    tsln,
    allFieldConfigs
  )

  const [cardsValid, setCardsValid] = useState(
    getStepValidity(keyStepMap, form, inputs)
  )

  const [incomeLabel, setIncomeLabel] = useState(tsln.incomeLabel)
  const [partnerIncomeLabel, setPartnerIncomeLabel] = useState(
    tsln.partnerIncomeLabel
  )
  const [incomeHintTitle, setIncomeHintTitle] = useState(tsln.incomeHintTitle)
  const [incomeHintText, setIncomeHintText] = useState(tsln.incomeHintText)
  const [partnerIncomeHintTitle, setPartnerIncomeHintTitle] = useState(
    tsln.partnerIncomeHintTitle
  )
  const [partnerIncomeHintText, setPartnerIncomeHintText] = useState(
    tsln.partnerIncomeHintText
  )
  const [receiveOAS, setReceiveOAS] = useState(false)

  const incomeTooltip = {
    moreinfo: incomeHintTitle,
    text: incomeHintText,
  }
  const partnerIncomeTooltip = {
    moreinfo: partnerIncomeHintTitle,
    text: partnerIncomeHintText,
  }

  useEffect(() => {
    const incomeLabel = receiveOAS
      ? tsln.incomeLabelReceiveOAS
      : tsln.incomeLabel
    const partnerIncomeLabel = receiveOAS
      ? tsln.partnerIncomeLabelReceiveOAS
      : tsln.partnerIncomeLabel
    const incomeHintTitle = receiveOAS
      ? tsln.incomeHintTitleReceiveOAS
      : tsln.incomeHintTitle
    const incomeHintText = receiveOAS
      ? tsln.incomeHintTextReceiveOAS
      : tsln.incomeHintText
    const partnerIncomeHintTitle = receiveOAS
      ? tsln.partnerIncomeHintTitleReceiveOAS
      : tsln.partnerIncomeHintTitle
    const partnerIncomeHintText = receiveOAS
      ? tsln.partnerIncomeHintTextReceiveOAS
      : tsln.partnerIncomeHintText
    setIncomeLabel(incomeLabel)
    setPartnerIncomeLabel(partnerIncomeLabel)
    setIncomeHintTitle(incomeHintTitle)
    setIncomeHintText(incomeHintText)
    setPartnerIncomeHintTitle(partnerIncomeHintTitle)
    setPartnerIncomeHintText(partnerIncomeHintText)
  }, [receiveOAS, tsln])

  // On mobile only, captures enter keypress, does NOT submit form, and blur (hide) keyboard
  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (isMobile && event.key == 'Enter') {
        const el = document.activeElement as HTMLInputElement
        el.blur()
      }
    })
  }, [isMobile])

  useEffect(() => {
    const el = document.getElementById('mainForm')
    if (el) {
      el.setAttribute(
        'data-gc-analytics-formname',
        'ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form'
      )
    }
  }, [])

  /**
   * On every change to a field, this will check the validity of all fields.
   */
  function handleOnChange(field: FormField, newValue: string): void {
    let newVal = newValue
    const key: String = field.config.key

    // Required to pass on to the Duration component that needs the exact birth month, not just age as float
    if (key === 'age') {
      newVal = JSON.parse(newValue).value
      const ageDate = JSON.parse(newValue).date
      setAgeDate(ageDate)
    }

    if (key === 'partnerAge') {
      newVal = JSON.parse(newValue).value
    }

    if (key === 'receiveOAS') {
      const receiveOAS = newValue === 'true'
      setReceiveOAS(receiveOAS)
    }

    const step = Object.keys(keyStepMap).find((step) =>
      keyStepMap[step].keys.includes(key)
    )

    field.value = newVal
    inputHelper.setInputByKey(field.key, newVal)
    form.update(inputHelper)

    setCardsValid(getStepValidity(keyStepMap, form, inputs))

    if (nextForStepClicked[step]) {
      setErrorsVisible({
        ...errorsVisible,
        ...getVisisbleErrorsForStep(step, keyStepMap, visibleFields),
      })
    }
  }

  /**
   * Generates the raw HTML for each field (aka. child).
   */
  function generateChildren(stepKeys: FieldKey[]): CardChildren {
    const fields = form.visibleFields.filter((field) =>
      stepKeys.includes(field.key)
    )

    console.log('------ Generate Children ------')
    return fields.map((field: FormField) => {
      const [formError, alertError] = getErrorForField(
        field,
        errorsVisible,
        receiveOAS,
        tsln
      )
      return (
        <div key={field.key}>
          <div className="pb-4" id={field.key}>
            {field.config.type === FieldType.DATE && (
              <MonthAndYear
                name={field.key}
                age={field.value}
                label={field.config.label}
                helpText={field.config.helpText}
                baseOnChange={(newValue) => handleOnChange(field, newValue)}
                requiredText={tsln.required}
                error={formError}
              />
            )}
            {field.config.type === FieldType.DURATION && (
              <Duration
                name={field.key}
                age={inputs.age}
                ageDate={ageDate}
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
                label={
                  field.key === 'income'
                    ? incomeLabel
                    : field.key === 'partnerIncome'
                    ? partnerIncomeLabel
                    : field.config.label
                }
                onChange={debounce(
                  (e) => handleOnChange(field, e.target.value),
                  100
                )}
                placeholder={field.config.placeholder ?? ''}
                value={
                  field.key === FieldKey.INCOME_WORK ||
                  field.key === FieldKey.PARTNER_INCOME_WORK
                    ? field.config.default
                    : field.value
                }
                helpText={field.config.helpText}
                requiredText={
                  field.key === FieldKey.INCOME ||
                  field.key === FieldKey.PARTNER_INCOME
                    ? tsln.required
                    : ''
                }
                error={formError}
                dynamicContent={
                  field.key === 'income'
                    ? incomeTooltip
                    : field.key === 'partnerIncome'
                    ? partnerIncomeTooltip
                    : undefined
                }
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
                iconId={field.key}
                iconAltText={tsln.warningText}
                type={'warning'}
                heading={tsln.unableToProceed}
                body={field.error}
                asHtml
              />
            </div>
          )}
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

  /**
   * Submits the form, saves inputs, and navigates to the results page.
   * This happens only when all fields are filled, and there are no errors.
   */
  function submitForm(e) {
    e.preventDefault()
    if (form.isValid) {
      language === 'en' ? router.push('/results') : router.push('/resultats')
    } else {
      document
        .getElementById('errorField')
        .scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleButtonOnChange(step) {
    setErrorsVisible({
      ...errorsVisible,
      ...getVisisbleErrorsForStep(step, keyStepMap, visibleFields),
    })
    setNextForStepClicked({ ...nextForStepClicked, [step]: true })
  }

  /**
   * Generates the card configuration.
   * Each card will contain children. Each child represents a field and contains its HTML.
   */
  function generateCards(): Card[] {
    return Object.keys(keyStepMap).map((step: Steps, index) => {
      const cardConfig: CardConfig = keyStepMap[step]
      const children = generateChildren(cardConfig.keys)
      const card: Card = {
        id: step,
        title: cardConfig.title,
        buttonLabel: cardConfig.buttonLabel,
        buttonAttributes: cardConfig.buttonAttributes,
        children,
        buttonOnChange: () => {
          handleButtonOnChange(step)
        },
      }

      const keysLength = Object.keys(keyStepMap).length
      const processingLastCard = index === keysLength - 1
      if (processingLastCard) {
        return {
          ...card,
          buttonOnChange: (e) => {
            handleButtonOnChange(`step${keysLength}`)
            submitForm(e)
          },
        }
      }
      return card
    })
  }

  form.update(inputHelper)

  return (
    <>
      <div>
        <p>TESTING DYNAMIC LINKS TO REVIEW RESULTS PAGE PR</p>
        <ErrorsSummary
          errorFields={form.visibleFields.filter(
            (field) =>
              field.error &&
              errorsVisible[field.key] &&
              (!errorsAsAlerts.includes(field.key) || field.value === undefined)
          )}
          receiveOAS={receiveOAS}
        />
      </div>
      <div
        className="md:w-2/3"
        data-gc-analytics-formname="ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form"
        // data-gc-analytics-collect='[{"value":"input,select","emptyField":"N/A"}]'
      >
        <AccordionForm
          id="mainForm"
          cardsState={cardsValid}
          cards={generateCards()}
          lang={language}
        />
      </div>
    </>
  )
}

