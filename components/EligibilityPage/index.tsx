import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSessionStorage } from 'react-use'
import { Form } from '../../client-state/Form'
import {
  ErrorsVisibleObject,
  FieldInputsObject,
  InputHelper,
} from '../../client-state/InputHelper'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { Language, Steps } from '../../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../../utils/api/definitions/fields'
import { CardChildren } from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { ErrorsSummary } from '../Forms/ErrorsSummary'
import { useMediaQuery } from '../Hooks'
import MainForm from './MainForm'

export const EligibilityPage: React.VFC = ({}) => {
  const isMobile = useMediaQuery(992)
  const language = useRouter().locale as Language
  const allFieldConfigs: FieldConfig[] =
    BenefitHandler.getAllFieldData(language)
  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))

  const [errorsVisible, _setErrorsVisible]: [
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
    }
  }, [])

  return (
    <>
      <div>
        <ErrorsSummary
          errorFields={form.visibleFields.filter(
            (field) =>
              field.error &&
              errorsVisible[field.key] &&
              (!errorsAsAlerts.includes(field.key) || field.value === undefined)
          )}
        />
      </div>
      <div
        className="md:w-2/3"
        data-gc-analytics-formname="ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form"
        // data-gc-analytics-collect='[{"value":"input,select","emptyField":"N/A"}]'
      >
        <MainForm form={form} />
      </div>
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

/**
 * Builds the object representing the default visibility of errors.
 */
function getErrorVisibility(fieldConfigs): VisibleFieldsObject {
  return fieldConfigs.reduce((result, value) => {
    result[value.key] = false
    return result
  }, {})
}

function getNextClickedObj(): NextClickedObject {
  const result = {}
  for (const step in Steps) {
    result[Steps[step]] = false
  }
  return result
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

type CardConfig = {
  title: string
  buttonLabel: string
  keys: FieldKey[]
  buttonAttributes: Object
}

type Card = {
  children: CardChildren
  id: string
  title: string
  buttonLabel: string
  buttonAttributes: Object
  buttonOnChange?: (e) => void
}

type StepValidity = { [x in Steps]?: { isValid: boolean } }

type NextClickedObject = {
  [x in Steps]?: boolean
}
