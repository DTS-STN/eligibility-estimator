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
import { Language } from '../../utils/api/definitions/enums'
import { FieldConfig } from '../../utils/api/definitions/fields'
import { FieldsHandler } from '../../utils/api/fieldsHandler'
import { VisibleFieldsObject } from '../../utils/web/types'
import FieldFactory from '../FieldFactory'
import { ContextualAlert as Message } from '../Forms/ContextualAlert'
import { useTranslation } from '../Hooks'
import {
  getBirthMonthAndYear,
  getDefaultInputs,
  getDefaultVisibleFields,
  getErrorForField,
  getIsStepValid,
  getStepErrorVisibility,
  getSteps,
  getVisisbleErrorsForActiveStep,
} from './utils'
import { Stepper } from '../Stepper'

const StepperPage: React.FC = () => {
  const router = useRouter()
  const langx = useRouter().locale as Language
  const language =
    langx === Language.EN || langx === Language.FR ? langx : Language.EN

  const tsln = useTranslation<WebTranslations>()

  const allFieldConfigs: FieldConfig[] = FieldsHandler.getAllFieldData(language)
  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))
  const [ageDate, setAgeDate] = useState(
    inputs.age ? getBirthMonthAndYear(inputs.age) : null
  )
  const [stepComponents, setStepComponents] = useState<React.ReactNode>(null)

  // Income question dynamic labels and hint content
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
  const incomeTooltip = {
    moreinfo: incomeHintTitle,
    text: incomeHintText,
  }
  const partnerIncomeTooltip = {
    moreinfo: partnerIncomeHintTitle,
    text: partnerIncomeHintText,
  }
  const [receiveOAS, setReceiveOAS] = useState(false)

  useEffect(() => {
    setSteps(getSteps(tsln))
    setStepComponents(getComponentForStep())
  }, [tsln])

  const [visibleFields]: [
    VisibleFieldsObject,
    (value: VisibleFieldsObject) => void
  ] = useState(getDefaultVisibleFields(allFieldConfigs))

  const inputHelper = new InputHelper(inputs, setInputs, language)
  const form = new Form(language, inputHelper, visibleFields)

  const getFieldsMetaData = (step: number) => {
    const allStepKeys = [
      ...steps[step].keys,
      ...steps[step].partnerKeys,
    ].filter((key) => visibleFields[key])

    return allStepKeys.reduce((acc, key) => {
      if (key === 'age' || key === 'oasAge' || key === 'oasDeferDuration') {
        acc['ageDate'] = ageDate
      }

      if (key === 'income' || key === 'partnerIncome' || key === 'incomeWork') {
        acc['incomeLabel'] = incomeLabel
        acc['partnerIncomeLabel'] = partnerIncomeLabel
        acc['incomeTooltip'] = incomeTooltip
        acc['partnerIncomeTooltip'] = partnerIncomeTooltip
      }

      return acc
    }, {})
  }

  const [steps, setSteps] = useState(getSteps(tsln))
  const totalSteps = Object.keys(steps).length
  const [activeStep, setActiveStep] = useSessionStorage('step', 1)
  const [isLastStep, setIsLastStep] = useState(false)

  const [errorsVisible, setErrorsVisible]: [
    ErrorsVisibleObject,
    (value: ErrorsVisibleObject) => void
  ] = useSessionStorage(
    'visibleErrors',
    getStepErrorVisibility(steps, activeStep, visibleFields)
  )

  const [fieldsMetaData, setFieldsMetaData] = useState(
    getFieldsMetaData(activeStep)
  )

  useEffect(() => {
    // Scroll to the right question if hash is present in URL (ex. "Edit" buttons in the results page)
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    setFieldsMetaData(getFieldsMetaData(activeStep))
  }, [ageDate])

  useEffect(() => {
    if (activeStep === totalSteps) {
      setIsLastStep(true)
    } else {
      setIsLastStep(false)
    }
    setAgeDate(inputs.age ? getBirthMonthAndYear(inputs.age) : null)

    setStepComponents(getComponentForStep())
    window.scrollTo(0, 0)
  }, [activeStep])

  useEffect(() => {
    setStepComponents(getComponentForStep())
    setFieldsMetaData(getFieldsMetaData(activeStep))
  }, [JSON.stringify(visibleFields)])

  useEffect(() => {
    setStepComponents(getComponentForStep())
  }, [fieldsMetaData])

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

    field.value = newVal
    inputHelper.setInputByKey(field, newVal)
    form.update(inputHelper)

    setStepComponents(getComponentForStep())
  }

  useEffect(() => {
    setStepComponents(getComponentForStep())
  }, [JSON.stringify(errorsVisible)])

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

  useEffect(() => {
    setStepComponents(getComponentForStep())
  }, [
    incomeLabel,
    partnerIncomeLabel,
    incomeHintTitle,
    incomeHintText,
    partnerIncomeHintTitle,
    partnerIncomeHintText,
    ageDate,
  ])

  const getComponentForStep = () => {
    const metaDataForFields = getFieldsMetaData(activeStep)

    const fields = form.visibleFields.filter((field) =>
      steps[activeStep].keys.includes(field.key)
    )

    const partnerFields = form.visibleFields.filter((field) =>
      steps[activeStep].partnerKeys?.includes(field.key)
    )
    const isPartnered = partnerFields.length > 0

    return (
      <>
        {isPartnered && (
          <h2 className="text-h2 font-header-gc mb-6 font-bold font-700">
            {tsln.stepper.yourInfo}
          </h2>
        )}
        {fields.map((field: FormField, index: number) => {
          const [formError, alertError] = getErrorForField(
            field,
            errorsVisible,
            receiveOAS,
            tsln
          )

          return (
            <div
              key={field.key}
              className={!(index === fields.length - 1) ? 'mb-8' : ''}
            >
              <div id={field.key}>
                <FieldFactory
                  field={field}
                  metaData={metaDataForFields}
                  tsln={tsln}
                  handleOnChange={handleOnChange}
                  formError={formError}
                />
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
              </div>
            </div>
          )
        })}
        {isPartnered && (
          <>
            <div className="h-12 sm:h-16"></div>
            <h2 className="text-h2 font-header-gc mb-6 font-bold font-700">
              {tsln.stepper.partnerInfo}
            </h2>
          </>
        )}
        {isPartnered &&
          partnerFields.map((field: FormField, index: number) => {
            const [formError, alertError] = getErrorForField(
              field,
              errorsVisible,
              receiveOAS,
              tsln
            )
            return (
              <div
                key={field.key}
                className={!(index === partnerFields.length - 1) ? 'mb-8' : ''}
              >
                <div id={field.key}>
                  <FieldFactory
                    field={field}
                    metaData={metaDataForFields}
                    tsln={tsln}
                    handleOnChange={handleOnChange}
                    formError={formError}
                  />
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
                </div>
              </div>
            )
          })}
      </>
    )
  }

  const handleOnNextClick = () => {
    const stepKeys = steps[activeStep].keys.concat(
      steps[activeStep].partnerKeys
    )
    setErrorsVisible({
      ...errorsVisible,
      ...getVisisbleErrorsForActiveStep(stepKeys, visibleFields),
    })

    function submitForm() {
      if (form.isValid) {
        language === 'en' ? router.push('/results') : router.push('/resultats')
      }
    }

    const stepValid = getIsStepValid(
      steps,
      activeStep,
      form.visibleFields,
      inputs
    )
    if (stepValid) {
      if (isLastStep) {
        submitForm()
      } else {
        setActiveStep(activeStep + 1)
      }
    }
  }

  form.update(inputHelper)
  return (
    <div
      className="ml-1 sm:w-4/5 md:w-4/6 w-full"
      data-gc-analytics-formname="ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form"
    >
      <Stepper
        id="stepper123"
        name={tsln.introPageTitle}
        activeStep={activeStep}
        title={
          tsln._language === 'en'
            ? `Step ${activeStep} of ${totalSteps}: ${steps[activeStep].title}`
            : `Étape ${activeStep} de ${totalSteps}: ${steps[activeStep].title}`
        }
        previousProps={{
          id: 'previous',
          text: tsln.stepper.previousStep,
          onClick: () => setActiveStep(Math.max(activeStep - 1, 1)),
        }}
        nextProps={{
          id: 'next',
          text: isLastStep ? tsln.stepper.getEstimate : tsln.stepper.nextStep,
          onClick: () => {
            handleOnNextClick()
          },
          buttonAttributes: steps[activeStep].buttonAttributes,
        }}
      >
        {stepComponents}
      </Stepper>
    </div>
  )
}

export default StepperPage
