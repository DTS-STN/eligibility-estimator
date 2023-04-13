import { VisibleFieldsObject } from '..'
import { FormField } from '../../../client-state/FormField'
import { FieldInputsObject } from '../../../client-state/InputHelper'
import { WebTranslations } from '../../../i18n/web'
import { BenefitHandler } from '../../../utils/api/benefitHandler'
import {
  FieldCategory,
  Language,
  Steps,
} from '../../../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../../../utils/api/definitions/fields'
import {
  CardConfig,
  NextClickedObject,
  StepValidity,
} from '../../../utils/api/definitions/types'
import MainHandler from '../../../utils/api/mainHandler'

export function getKeyStepMap(tsln, language): { [x in Steps]: CardConfig } {
  const connection = tsln._language === Language.EN ? ':' : ' :'
  const AA_CUSTOMCLICK = 'data-gc-analytics-customclick'
  const AA_BUTTON_CLICK_ATTRIBUTE =
    'ESDC-EDSC:Canadian OAS Benefits Est. Next Step Click'
  const AA_FROM_SUBMIT_ATTRIBUTE = 'data-gc-analytics-formsubmit'
  const AA_FORM_SUBMIT_ACTION = 'submit'

  const getKeysByCategory = (category: FieldCategory): FieldKey[] => {
    const allFieldConfigs: FieldConfig[] =
      BenefitHandler.getAllFieldData(language)

    return allFieldConfigs
      .filter((value) => value.category.key === category)
      .map((value) => value.key)
  }

  return {
    [Steps.STEP_1]: {
      title: tsln.category.age,
      buttonLabel: `${tsln.nextStep}${connection} ${tsln.category.income}`,
      keys: getKeysByCategory(FieldCategory.AGE),
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.category.income}`,
      },
    },
    [Steps.STEP_2]: {
      title: tsln.category.income,
      buttonLabel: `${tsln.nextStep}${connection} ${tsln.category.legal}`,
      keys: getKeysByCategory(FieldCategory.INCOME),
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.category.legal}`,
      },
    },
    [Steps.STEP_3]: {
      title: tsln.category.legal,
      buttonLabel: `${tsln.nextStep}${connection} ${tsln.category.residence}`,
      keys: getKeysByCategory(FieldCategory.LEGAL),
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.category.residence}`,
      },
    },
    [Steps.STEP_4]: {
      title: tsln.category.residence,
      buttonLabel: `${tsln.nextStep}${connection} ${tsln.category.marital}`,
      keys: getKeysByCategory(FieldCategory.RESIDENCE),
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.category.marital}`,
      },
    },
    [Steps.STEP_5]: {
      title: tsln.category.marital,
      buttonLabel: tsln.getEstimate,
      keys: getKeysByCategory(FieldCategory.MARITAL),
      buttonAttributes: {
        [AA_FROM_SUBMIT_ATTRIBUTE]: AA_FORM_SUBMIT_ACTION,
        type: AA_FORM_SUBMIT_ACTION,
      },
    },
  }
}

/**
 * Checks the validity of all steps.
 * If a step has an error or is missing a field, it will be invalid.
 */
export function getStepValidity(form, inputs, keyStepMap): StepValidity {
  return Object.keys(keyStepMap).reduce((result, step: Steps, index) => {
    const stepKeys: FieldKey[] = keyStepMap[step].keys // all keys for a step, including keys that are not visible!
    const visibleKeys: FieldKey[] = form.visibleFieldKeys // all keys that are visible (ie. exist in the form)
    const visibleStepKeys: FieldKey[] = stepKeys.filter(
      (value) => visibleKeys.includes(value) // all keys for a step that are visible
    )
    const allFieldsFilled: boolean = visibleStepKeys.every((key) => inputs[key])
    const visibleStepFields: FormField[] = form.visibleFields.filter((field) =>
      visibleStepKeys.includes(field.key)
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

export function getNextClickedObj(): NextClickedObject {
  const result = {}
  for (const step in Steps) {
    result[Steps[step]] = false
  }
  return result
}

export function getVisisbleErrorsForStep(step, visibleFields, keyStepMap) {
  const stepKeys = keyStepMap[step].keys
  const allVisibleKeys = Object.keys(visibleFields).filter((key) => key)

  const visibleKeysForStep = stepKeys.filter((key) =>
    allVisibleKeys.includes(key)
  )

  const stepErrorsVisible = {}
  visibleKeysForStep.forEach((key) => (stepErrorsVisible[key] = true))
  return stepErrorsVisible
}

/**
 * Builds the object representing the default visibility of errors.
 */
export function getErrorVisibility(fieldConfigs): VisibleFieldsObject {
  return fieldConfigs.reduce((result, value) => {
    result[value.key] = false
    return result
  }, {})
}

/**
 * Builds the object representing the default inputs object.
 */
export function getDefaultInputs(
  allFieldConfigs: FieldConfig[]
): FieldInputsObject {
  return allFieldConfigs.reduce((result, value) => {
    if ('default' in value && value.default) {
      result[value.key] =
        typeof value.default === 'string' ? value.default : value.default.key
    }
    return result
  }, {})
}

/**
 * Builds the object representing the default set of visible fields.
 */
export function getDefaultVisibleFields(
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

/**
 * Returns error for the form that is either an alert error or a form error (red text under input) depending on circumstance
 */
export function getErrorForField(field, errorsVisible) {
  const errorsAsAlerts = ['legalStatus', 'everLivedSocialCountry']
  let formError
  let alertError

  if (field.value === undefined || !errorsAsAlerts.includes(field.key)) {
    formError = errorsVisible[field.key] ? field.error : ''
  } else {
    alertError =
      errorsAsAlerts.includes(field.key) &&
      errorsVisible[field.key] &&
      field.error
  }

  return [formError, alertError]
}

/**
 * Returns text for a select component - either the current selection if exists, or a default
 */
export function getPlaceholderForSelect(
  field: FormField,
  tsln: WebTranslations
): string {
  const text: string = tsln.selectText[field.key]
  return text ?? tsln.selectText.default
}
