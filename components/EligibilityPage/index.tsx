import { AccordionForm } from '@dts-stn/service-canada-design-system'
import router, { useRouter } from 'next/router'
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
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { Language, Steps } from '../../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../../utils/api/definitions/fields'
import {
  CardChildren,
  NextClickedObject,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { ErrorsSummary } from '../Forms/ErrorsSummary'
import { useMediaQuery, useTranslation } from '../Hooks'
import MainForm from './MainForm'
import {
  ERRORS_AS_ALERTS,
  getKeyStepMap,
  getNextClickedObj,
  getStepValidity,
  getVisisbleErrorsForStep,
} from './utils'
import { generateCards } from './utils/generateCards'

export const EligibilityPage: React.VFC = ({}) => {
  const isMobile = useMediaQuery(992)
  const tsln = useTranslation<WebTranslations>()
  const language = router.locale as Language
  const keyStepMap = getKeyStepMap(tsln, language)
  const allFieldConfigs: FieldConfig[] =
    BenefitHandler.getAllFieldData(language)

  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))

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

  const [cardsValid, setCardsValid] = useState(
    getStepValidity(form, inputs, keyStepMap)
  )

  // On mobile only, captures enter keypress, does NOT submit form, and blurs (hides) keyboard
  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (isMobile && event.key == 'Enter') {
        const el = document.activeElement as HTMLInputElement
        el.blur()
      }
    })
  }, [isMobile])

  useEffect(() => {
    console.log('FORM CHANGED')
  }, [])

  useEffect(() => {
    const el = document.getElementById('mainForm')
    if (el) {
      el.setAttribute(
        'data-gc-analytics-formname',
        'ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form'
      )
    }
  }, [])

  const [nextForStepClicked, setNextForStepClicked]: [
    NextClickedObject,
    (value: NextClickedObject) => void
  ] = useSessionStorage('next-clicked', getNextClickedObj())

  // Controls press of "Next" on each card
  const handleButtonOnChange = (step) => {
    setErrorsVisible({
      ...errorsVisible,
      ...getVisisbleErrorsForStep(step, visibleFields, keyStepMap),
    })
    setNextForStepClicked({ ...nextForStepClicked, [step]: true })
  }

  // Controls change of inputs
  const handleOnChange = (field: FormField, newValue: string): void => {
    const key: String = field.config.key
    const step = Object.keys(keyStepMap).find((step) =>
      keyStepMap[step].keys.includes(key)
    )

    field.value = newValue
    inputHelper.setInputByKey(field.key, newValue)
    form.update(inputHelper)
    setCardsValid(getStepValidity(form, inputs, keyStepMap))

    if (nextForStepClicked[step]) {
      setErrorsVisible({
        ...errorsVisible,
        ...getVisisbleErrorsForStep(step, visibleFields, keyStepMap),
      })
    }
  }

  // If form is valid, simply push to /results since the results object is already calculated
  const submitForm = (e) => {
    e.preventDefault()
    if (form.isValid) {
      router.push('/results')
    }
  }

  const getCards = () => {
    console.log('inside get carsd')
    return generateCards(
      form,
      handleButtonOnChange,
      handleOnChange,
      submitForm,
      errorsVisible,
      keyStepMap,
      tsln
    )
  }

  return (
    <>
      <div>
        <ErrorsSummary
          errorFields={form.visibleFields.filter(
            (field) =>
              field.error &&
              errorsVisible[field.key] &&
              (!ERRORS_AS_ALERTS.includes(field.key) ||
                field.value === undefined)
          )}
        />
      </div>
      <div
        className="md:w-2/3"
        data-gc-analytics-formname="ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form"
      >
        <AccordionForm
          id="mainForm"
          cardsState={cardsValid}
          cards={getCards()}
          lang={language}
        />
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
