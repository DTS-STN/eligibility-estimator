import { AccordionForm, Message } from '@dts-stn/service-canada-design-system'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import { useSessionStorage } from 'react-use'
import { Form } from '../../client-state/Form'
import { FormField } from '../../client-state/FormField'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { FieldCategory, Language } from '../../utils/api/definitions/enums'
import {
  FieldConfig,
  FieldKey,
  FieldType,
} from '../../utils/api/definitions/fields'
import MainHandler from '../../utils/api/mainHandler'
import { CurrencyField } from '../Forms/CurrencyField'
import { MonthAndYear } from '../Forms/MonthAndYear'
import { NumberField } from '../Forms/NumberField'
import { Radio } from '../Forms/Radio'
import { FormSelect } from '../Forms/Select'
import { TextField } from '../Forms/TextField'
import { useMediaQuery, useTranslation } from '../Hooks'

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 */
export const EligibilityPage: React.VFC = ({}) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)
  const language = useRouter().locale as Language
  const allFieldConfigs: FieldConfig[] =
    BenefitHandler.getAllFieldData(language)

  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))

  const [visibleFields]: [
    VisibleFieldsObject,
    (value: VisibleFieldsObject) => void
  ] = useState(getDefaultVisibleFields(allFieldConfigs))

  const inputHelper = new InputHelper(inputs, setInputs, language)
  const form = new Form(language, inputHelper, visibleFields)

  const connection = tsln._language === Language.EN ? '-' : ':'

  // on mobile only, captures enter keypress, does NOT submit form, and blur (hide) keyboard
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
      el.setAttribute(
        'data-gc-analytics-collect',
        '[{"value":"input,select","emptyField":"N/A"}]'
      )
    }

    const button = document.querySelector(
      '#mainForm > fieldset#step5 > div > div.cardContent > div > button'
    )

    if (button) {
      button.setAttribute('type', 'submit')
      button.setAttribute('data-gc-analytics-formsubmit', 'submit')
    }
  }, [])

  form.update(inputHelper)

  function getKeysByCategory(category: FieldCategory): FieldKey[] {
    return allFieldConfigs
      .filter((value) => value.category.key === category)
      .map((value) => value.key)
  }

  const keyStepMap: { [x in Steps]: CardConfig } = {
    [Steps.STEP_1]: {
      title: tsln.category.age,
      buttonLabel: `${tsln.nextStep} ${connection} ${tsln.category.income}`,
      keys: getKeysByCategory(FieldCategory.AGE),
    },
    [Steps.STEP_2]: {
      title: tsln.category.income,
      buttonLabel: `${tsln.nextStep} ${connection} ${tsln.category.legal}`,
      keys: getKeysByCategory(FieldCategory.INCOME),
    },
    [Steps.STEP_3]: {
      title: tsln.category.legal,
      buttonLabel: `${tsln.nextStep} ${connection} ${tsln.category.residence}`,
      keys: getKeysByCategory(FieldCategory.LEGAL),
    },
    [Steps.STEP_4]: {
      title: tsln.category.residence,
      buttonLabel: `${tsln.nextStep} ${connection} ${tsln.category.marital}`,
      keys: getKeysByCategory(FieldCategory.RESIDENCE),
    },
    [Steps.STEP_5]: {
      title: tsln.category.marital,
      buttonLabel: tsln.getEstimate,
      keys: getKeysByCategory(FieldCategory.MARITAL),
    },
  }

  /**
   * Checks the validity of all steps.
   * If a step has an error or is missing a field, it will be invalid.
   */
  function getStepValidity(): StepValidity {
    return Object.keys(keyStepMap).reduce((result, step: Steps, index) => {
      const stepKeys: FieldKey[] = keyStepMap[step].keys // all keys for a step, including keys that are not visible!
      const visibleKeys: FieldKey[] = form.visibleFieldKeys // all keys that are visible (ie. exist in the form)
      const visibleStepKeys: FieldKey[] = stepKeys.filter(
        (value) => visibleKeys.includes(value) // all keys for a step that are visible
      )
      const allFieldsFilled: boolean = visibleStepKeys.every(
        (key) => inputs[key]
      )
      const visibleStepFields: FormField[] = form.visibleFields.filter(
        (field) => visibleStepKeys.includes(field.key)
      )
      const allFieldsNoError: boolean = visibleStepFields.every(
        (field) => field.valid
      )
      const previousStep: { isValid: boolean } = result[`step${index}`]
      const previousStepExists: boolean = previousStep !== undefined
      const previousStepValid: boolean = previousStep?.isValid
      const isValid: boolean =
        allFieldsFilled &&
        allFieldsNoError &&
        (!previousStepExists || previousStepValid)
      result[step] = { isValid }
      return result
    }, {})
  }

  const [cardsValid, setCardsValid] = useState(getStepValidity())

  /**
   * On every change to a field, this will check the validity of all fields.
   */
  function handleOnChange(field: FormField, newValue: string): void {
    field.value = newValue
    inputHelper.setInputByKey(field.key, newValue)
    form.update(inputHelper)
    setCardsValid(getStepValidity())
  }

  /**
   * Generates the raw HTML for each field (aka. child).
   */
  function generateChildren(step: Steps, stepKeys: FieldKey[]): CardChildren {
    const fields = form.visibleFields.filter((field) =>
      stepKeys.includes(field.key)
    )
    return fields.map((field: FormField) => {
      return (
        <div key={field.key}>
          <div className="pb-4" id={field.key}>
            {field.config.type === FieldType.DATE && (
              <MonthAndYear
                name={field.key}
                label={field.config.label}
                helpText={field.config.helpText}
                baseOnChange={(newValue) => handleOnChange(field, newValue)}
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
              />
            )}
          </div>
          {field.error && (
            <div className="mt-6 md:pr-12">
              <Message
                id={field.key}
                alert_icon_id={field.key}
                alert_icon_alt_text={tsln.warningText}
                type="warning"
                message_heading={tsln.unableToProceed}
                message_body={field.error}
                asHtml={true}
                whiteBG={true}
              />
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
      router.push('/results')
    }
  }

  /**
   * Generates the card configuration.
   * Each card will contain children. Each child represents a field and contains its HTML.
   */
  function generateCards(): Card[] {
    return Object.keys(keyStepMap).map((step: Steps, index) => {
      const cardConfig: CardConfig = keyStepMap[step]
      const children = generateChildren(step, cardConfig.keys)
      const card: Card = {
        id: step,
        title: cardConfig.title,
        buttonLabel: cardConfig.buttonLabel,
        children,
      }

      const processingLastCard = index === Object.keys(keyStepMap).length - 1
      if (processingLastCard) {
        return {
          ...card,
          buttonOnChange: submitForm,
        }
      }
      return card
    })
  }

  return (
    <>
      {
        <div
          className="md:w-2/3"
          data-gc-analytics-formname="ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form"
          data-gc-analytics-collect='[{"value":"input,select","emptyField":"N/A"}]'
        >
          <AccordionForm
            id="mainForm"
            cardsState={cardsValid}
            cards={generateCards()}
            lang={language}
          />
        </div>
      }
    </>
  )
}

/**
 * Builds the object representing the default inputs object.
 */
function getDefaultInputs(allFieldConfigs: FieldConfig[]): FieldInputsObject {
  return allFieldConfigs.reduce((result, value) => {
    if ('default' in value && value.default) {
      result[value.key] =
        typeof value.default === 'string' ? value.default : value.default.key
    }
    return result
  }, {})
}

export type VisibleFieldsObject = {
  [key in FieldKey]?: boolean
}

/**
 * Builds the object representing the default set of visible fields.
 */
function getDefaultVisibleFields(
  allFieldConfigs: FieldConfig[]
): VisibleFieldsObject {
  const defaultData = new MainHandler({}).results
  if ('visibleFields' in defaultData) {
    return allFieldConfigs.reduce((result, value) => {
      result[value.key] = defaultData.visibleFields.includes(value.key)
      return result
    }, {})
  }
}

function getPlaceholderForSelect(
  field: FormField,
  tsln: WebTranslations
): string {
  const text: string = tsln.selectText[field.key]
  return text ?? tsln.selectText.default
}

type CardConfig = { title: string; buttonLabel: string; keys: FieldKey[] }

type Card = {
  children: CardChildren
  id: string
  title: string
  buttonLabel: string
  buttonOnChange?: (e) => void
}

type CardChildren = JSX.Element[]

type StepValidity = { [x in Steps]?: { isValid: boolean } }

enum Steps {
  STEP_1 = 'step1',
  STEP_2 = 'step2',
  STEP_3 = 'step3',
  STEP_4 = 'step4',
  STEP_5 = 'step5',
}
