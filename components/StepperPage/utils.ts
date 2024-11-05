import { FormField } from '../../client-state/FormField'
import { FieldInputsObject } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { ValidationErrors } from '../../utils/api/definitions/enums'
import { FieldConfig } from '../../utils/api/definitions/fields'
import MainHandler from '../../utils/api/mainHandler'
import { VisibleFieldsObject } from '../../utils/web/types'

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

export function getVisisbleErrorsForActiveStep(stepKeys, visibleFields) {
  // filter stepKeys to only include those that are visible.
  const visibleKeysForStep = stepKeys.filter((key) => visibleFields[key])

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

export const getStepErrorVisibility = (steps, step: number, visibleFields) => {
  // Initially no errors are shown
  const allStepKeys = [...steps[step].keys, ...steps[step].partnerKeys].filter(
    (key) => visibleFields[key]
  )

  return allStepKeys.reduce((acc, key) => {
    acc[key] = false
    return acc
  }, {})
}

export const getSteps = (tsln) => {
  const AA_CUSTOMCLICK = 'data-gc-analytics-customclick'
  const AA_BUTTON_CLICK_ATTRIBUTE =
    'ESDC-EDSC:Canadian OAS Benefits Est. Next Step Click'
  const AA_FROM_SUBMIT_ATTRIBUTE = 'data-gc-analytics-formsubmit'
  const AA_FORM_SUBMIT_ACTION = 'submit'
  return {
    1: {
      title: tsln.category.marital,
      keys: ['maritalStatus', 'invSeparated'],
      partnerKeys: [],
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.category.age}`,
      },
    },
    2: {
      title: tsln.category.age,
      keys: ['age', 'receiveOAS', 'oasDeferDuration', 'oasDefer', 'oasAge'],
      partnerKeys: ['partnerAge', 'partnerBenefitStatus'],
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.category.income}`,
      },
    },
    3: {
      title: tsln.category.income,
      keys: ['incomeAvailable', 'income', 'incomeWork'],
      partnerKeys: [
        'partnerIncomeAvailable',
        'partnerIncome',
        'partnerIncomeWork',
      ],
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.category.residence}`,
      },
    },
    4: {
      title: tsln.category.residence,
      keys: [
        'livingCountry',
        'livedOnlyInCanada',
        'yearsInCanadaSince18',
        'yearsInCanadaSinceOAS',
        'everLivedSocialCountry',
      ], // we actually dont want to show legalStatus question but to default to YES behind the scenes
      partnerKeys: [
        'partnerLivingCountry',
        'partnerLivedOnlyInCanada',
        'partnerYearsInCanadaSince18',
      ],
      buttonAttributes: {
        [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.getEstimate}`,
        [AA_FROM_SUBMIT_ATTRIBUTE]: AA_FORM_SUBMIT_ACTION,
        type: AA_FORM_SUBMIT_ACTION,
      },
    },
  }
}

export const firstInvalidFieldId = (
  steps,
  step: number,
  visibleFields: FormField[]
) => {
  const stepKeys = steps[step].keys.concat(steps[step].partnerKeys)

  const stepVisibleKeys = stepKeys.filter(
    (value) => visibleFields.map((field) => field.key).includes(value) // all keys for a step that are visible
  )

  const visibleStepFields: FormField[] = visibleFields.filter((field) =>
    stepVisibleKeys.includes(field.key)
  )

  return visibleStepFields.find((field) => !field.valid)?.config.key
}

export const getIsStepValid = (
  steps,
  step: number,
  visibleFields: FormField[],
  inputs: FieldInputsObject
) => {
  const stepKeys = steps[step].keys.concat(steps[step].partnerKeys)

  const stepVisibleKeys = stepKeys.filter(
    (value) => visibleFields.map((field) => field.key).includes(value) // all keys for a step that are visible
  )

  const allFieldsFilled: boolean = stepVisibleKeys.every((key) => inputs[key])

  const visibleStepFields: FormField[] = visibleFields.filter((field) =>
    stepVisibleKeys.includes(field.key)
  )

  const allFieldsNoError: boolean = visibleStepFields.every(
    (field) => field.valid
  )

  const stepIsValid = allFieldsFilled && allFieldsNoError
  return stepIsValid
}

export const getStepTitle = (
  language: string,
  activeStep: number,
  totalSteps: number,
  steps: Object
) => {
  const title =
    language === 'en'
      ? `Step ${activeStep} of ${totalSteps}: ${steps[activeStep].title}`
      : `Étape ${activeStep} de ${totalSteps} : ${steps[activeStep].title}`
  return title
}

export const keyToStepMap = {
  maritalStatus: 1,
  invSeparated: 1,
  age: 2,
  receiveOAS: 2,
  oasDeferDuration: 2,
  oasDefer: 2,
  oasAge: 2,
  partnerAge: 2,
  partnerBenefitStatus: 2,
  incomeAvailable: 3,
  income: 3,
  incomeWork: 3,
  partnerIncomeAvailable: 3,
  partnerIncome: 3,
  partnerIncomeWork: 3,
  livingCountry: 4,
  livedOnlyInCanada: 4,
  yearsInCanadaSince18: 4,
  yearsInCanadaSinceOAS: 4,
  everLivedSocialCountry: 4,
  partnerLivingCountry: 4,
  partnerLivedOnlyInCanada: 4,
  partnerYearsInCanadaSince18: 4,
}
