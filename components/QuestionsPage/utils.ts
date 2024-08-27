import { FormField } from '../../client-state/FormField'
import { FieldInputsObject } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import {
  FieldCategory,
  Language,
  ValidationErrors,
} from '../../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../../utils/api/definitions/fields'
import {
  CardConfig,
  NextClickedObject,
  Steps,
  StepValidity,
  VisibleFieldsObject,
} from '../../utils/web/types'
import MainHandler from '../../utils/api/mainHandler'

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
 * Gets the placeholder for the select component - either a default value attached to the field or currently selected option.
 */
export function getPlaceholderForSelect(
  field: FormField,
  tsln: WebTranslations
): string {
  const text: string = tsln.selectText[field.key]
  return text ?? tsln.selectText.default
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
 * Builds the object representing the default visibility of errors.
 */
export function getErrorVisibility(fieldConfigs): VisibleFieldsObject {
  return fieldConfigs.reduce((result, value) => {
    result[value.key] = false
    return result
  }, {})
}

/**
 * Builds an object that represents whether the card's "Next" button has been pressed. Initially all the cards are set to "false"
 */
export function getNextClickedObj(): NextClickedObject {
  const result = {}
  for (const step in Steps) {
    result[Steps[step]] = false
  }
  return result
}

/**
 * Builds a keyStepMap object that defines parameters for a given card such as card title, button label, the question keys associated with
 * that card as well as button attributes that are required by Adobe Analytics
 */
export function getKeyStepMap(
  tsln,
  allFieldConfigs
): { [x in Steps]: CardConfig } {
  const connection = tsln._language === Language.EN ? ':' : ' :'
  const AA_CUSTOMCLICK = 'data-gc-analytics-customclick'
  const AA_BUTTON_CLICK_ATTRIBUTE =
    'ESDC-EDSC:Canadian OAS Benefits Est. Next Step Click'
  const AA_FROM_SUBMIT_ATTRIBUTE = 'data-gc-analytics-formsubmit'
  const AA_FORM_SUBMIT_ACTION = 'submit'

  function getKeysByCategory(category: FieldCategory): FieldKey[] {
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
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}: ${tsln.getEstimate}`,
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
export function getStepValidity(keyStepMap, form, inputs): StepValidity {
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

/**
 * Get error text for each field. Some fields show up as alerts while some are regular form errors
 */
export function getErrorForField(field, errorsVisible, receiveOAS, tsln) {
  const errorsAsAlerts = ['legalStatus', 'everLivedSocialCountry']
  let formError = ''
  let alertError = ''

  if (field.value === undefined || !errorsAsAlerts.includes(field.key)) {
    if (field.key === 'income' || field.key === 'partnerIncome') {
      const errorKey =
        field.key === 'income'
          ? receiveOAS
            ? ValidationErrors.incomeEmptyReceiveOAS
            : ValidationErrors.incomeEmpty
          : receiveOAS
          ? ValidationErrors.partnerIncomeEmptyReceiveOAS
          : ValidationErrors.partnerIncomeEmpty

      formError =
        field.value === undefined && errorsVisible[field.key]
          ? tsln.validationErrors[errorKey] || ''
          : ''
    } else {
      formError = errorsVisible[field.key] ? field.error : ''
    }
  } else if (errorsVisible[field.key] && errorsAsAlerts.includes(field.key)) {
    alertError = field.error
  }

  return [formError, alertError]
}

/**
 * Returns an object that determines whether errors for a given step (card) are visible or not. If a key is visible in a step,
 * the error if it exists will also be visible.
 */
export function getVisisbleErrorsForStep(step, keyStepMap, visibleFields) {
  const stepKeys = keyStepMap[step].keys
  const allVisibleKeys = Object.keys(visibleFields).filter((key) => key)

  const visibleKeysForStep = stepKeys.filter((key) =>
    allVisibleKeys.includes(key)
  )

  const stepErrorsVisible = {}
  visibleKeysForStep.forEach((key) => (stepErrorsVisible[key] = true))
  return stepErrorsVisible
}

export function getVisisbleErrorsForActiveStep(stepKeys, visibleFields) {
  // filter stepKeys to only include those that are visible.
  const visibleKeysForStep = stepKeys.filter((key) => visibleFields[key])

  // const visibleKeysForStep = stepKeys.filter((key) =>
  //   allVisibleKeys.includes(key)
  // )

  const stepErrorsVisible = {}
  visibleKeysForStep.forEach((key) => (stepErrorsVisible[key] = true))
  return stepErrorsVisible
}

export function getBirthMonthAndYear(age) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  let birthYear = currentYear - Math.floor(age)
  const months = Math.round((age - Math.floor(age)) * 12)
  let birthMonth = currentMonth + 1 - months

  if (birthMonth < 1) {
    birthYear--
    birthMonth = birthMonth + 12 // adjust birthMonth because it can be negative
  }

  return { year: birthYear, month: birthMonth }
}
