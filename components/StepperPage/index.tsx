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
import { useTranslation } from '../Hooks'
import {
  firstInvalidFieldId,
  getBirthMonthAndYear,
  getDefaultInputs,
  getDefaultVisibleFields,
  getErrorForField,
  getIsStepValid,
  getStepErrorVisibility,
  getSteps,
  getStepTitle,
  getVisisbleErrorsForActiveStep,
} from './utils'
import { Stepper } from '../Stepper'
import Warning from '../Forms/Warning'

interface StepperPageProps {
  setPageTitle: (title: string) => void
}

const defaultStep = 'marital'
const formSteps = ['marital', 'age', 'income', 'residence']

const StepperPage: React.FC<StepperPageProps> = ({ setPageTitle }) => {
  const router = useRouter()
  const langx = useRouter().locale as Language
  const language =
    langx === Language.EN || langx === Language.FR ? langx : Language.EN
  const tsln = useTranslation<WebTranslations>()

  const { step } = router.query

  useEffect(() => {
    // Redirect to the default step if no step is specified or the step is invalid
    if (
      !step ||
      typeof step !== 'string' ||
      !Object.values(formSteps).includes(step)
    ) {
      router.replace(`/questions?step=${defaultStep}`)
    }
  }, [])

  const allFieldConfigs: FieldConfig[] = FieldsHandler.getAllFieldData(language)

  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))

  const savedResults = JSON.parse(sessionStorage.getItem('resultPageInputs'))

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
  const [incomeHelpText, setIncomeHelpText] = useState(tsln.incomeHelpText)
  const [partnerIncomeHelpText, setPartnerIncomeHelpText] = useState(
    tsln.partnerIncomeHelpText
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

  // Get savedResults, overwite inputs with it.
  useEffect(() => {
    if (savedResults !== null) {
      if ('inputs' in savedResults) {
        for (const [key, value] of Object.entries(savedResults.inputs)) {
          inputs[key] = value
        }
      }
    }
  }, [savedResults])

  const today = new Date()
  const currYear =
    today.getMonth() + 1 <= 6
      ? today.getFullYear() - 2
      : today.getFullYear() - 1

  useEffect(() => {
    setSteps(getSteps(tsln))
    setStepComponents(getComponentForStep())
  }, [tsln, language])

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
        acc['incomeHelpText'] = incomeHelpText
        acc['partnerIncomeHelpText'] = partnerIncomeHelpText
      }

      return acc
    }, {})
  }

  const [steps, setSteps] = useState(getSteps(tsln))
  const totalSteps = Object.keys(steps).length
  const [activeStep, setActiveStep] = useState(
    formSteps.indexOf(step as string) + 1
  )
  const [isLastStep, setIsLastStep] = useState(false)

  const [stepTitle, setStepTitle] = useState('')

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
    setActiveStep(formSteps.indexOf(step as string) + 1)
  }, [step])

  useEffect(() => {
    const topElement = document.getElementById('topOfPageFocus')
    if (topElement) {
      topElement.focus()
    }

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

    // TODO: we should have visibleErrors (in session storage) be based on the visibile fields. Meaning, if a field is not visible, it should not be in visibleErrors
    // Try to remove the field from visibleErorrs on onChange (or maybe a useEffect that runs when visibleFields changes)

    // Required to pass on to the Duration component that needs the exact birth month, not just age as float
    if (key === 'age') {
      newVal = JSON.parse(newValue).value
      const newAgeDate = JSON.parse(newValue).date
      setAgeDate(newAgeDate)
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
      ? `${tsln.incomeLabelReceiveOAS} ${currYear}?`
      : tsln.incomeLabel
    const partnerIncomeLabel = receiveOAS
      ? `${tsln.partnerIncomeLabelReceiveOAS} ${currYear}?`
      : tsln.partnerIncomeLabel
    const incomeHintTitle = receiveOAS
      ? tsln.incomeHintTitleReceiveOAS
      : tsln.incomeHintTitle
    const incomeHintText = receiveOAS
      ? tsln.incomeHintTextReceiveOAS
      : tsln.incomeHintText
    const incomeHelpText = receiveOAS
      ? tsln.incomeHelpTextReceiveOAS
      : tsln.incomeHelpText
    const partnerIncomeHintTitle = receiveOAS
      ? tsln.partnerIncomeHintTitleReceiveOAS
      : tsln.partnerIncomeHintTitle
    const partnerIncomeHintText = receiveOAS
      ? tsln.partnerIncomeHintTextReceiveOAS
      : tsln.partnerIncomeHintText
    const partnerIncomeHelpText = receiveOAS
      ? tsln.partnerIncomeHelpTextReceiveOAS
      : tsln.partnerIncomeHelpText

    setIncomeLabel(incomeLabel)
    setPartnerIncomeLabel(partnerIncomeLabel)
    setIncomeHintTitle(incomeHintTitle)
    setIncomeHintText(incomeHintText)
    setIncomeHelpText(incomeHelpText)
    setPartnerIncomeHintTitle(partnerIncomeHintTitle)
    setPartnerIncomeHintText(partnerIncomeHintText)
    setPartnerIncomeHelpText(partnerIncomeHelpText)
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
    incomeHelpText,
    partnerIncomeHelpText,
  ])

  useEffect(() => {
    const title = getStepTitle(tsln, language, activeStep, totalSteps, steps)
    setStepTitle(title)
  }, [activeStep, totalSteps, language, setPageTitle])

  useEffect(() => {
    setPageTitle(stepTitle)
  }, [stepTitle])

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
          <h2 className="text-[32px] leading-[36px] sm:text-h2 font-header-gc mb-6 font-bold font-700">
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
                  <div className="mt-6">
                    <Warning
                      id={field.key}
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
            <h2 className="text-[32px] leading-[36px] sm:text-h2 font-header-gc mb-6 font-bold font-700">
              {tsln.stepper.partnerInfo}
            </h2>
            {activeStep === 2 && (
              <p className="mb-8">{tsln.stepper.partnerInfoHelp}</p>
            )}
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
                    <div className="mt-6">
                      <Warning
                        id={field.key}
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

    const visibleErrorsForActiveStep = getVisisbleErrorsForActiveStep(
      stepKeys,
      visibleFields
    )

    setErrorsVisible({
      ...errorsVisible,
      ...visibleErrorsForActiveStep,
    })

    function submitForm() {
      if (form.isValid) {
        form.writeToSessionStorage()
        language === 'en' ? router.push('/results') : router.push('/resultats')
      }
    }

    const stepValid = getIsStepValid(
      steps,
      activeStep,
      form.visibleFields,
      inputs
    )

    const firstInvalidStep = firstInvalidFieldId(
      steps,
      activeStep,
      form.visibleFields
    )

    if (stepValid) {
      if (isLastStep) {
        submitForm()
      } else {
        const nextStep = formSteps[activeStep]
        router.push(`/questions?step=${nextStep}`)
        setActiveStep(activeStep + 1)
      }
    } else {
      if (firstInvalidStep) {
        document
          .getElementById(firstInvalidStep)
          ?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  form.update(inputHelper)
  return (
    <div
      id="stepperForm"
      className="sm:w-4/5 md:w-4/6 w-full mt-8"
      data-gc-analytics-formname="ESDC|EDSC:CanadaOldAgeSecurityBenefitsEstimator-Form"
    >
      <Stepper
        id="stepper123"
        name={tsln.introPageTitle}
        activeStep={activeStep}
        title={stepTitle}
        previousProps={{
          id: 'previous',
          text: tsln.stepper.previousStep,
          onClick: () => {
            if (activeStep > 1) {
              router.push(`/questions?step=${formSteps[activeStep - 2]}`)
              setActiveStep(Math.max(activeStep - 1, 1))
            }
          },
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
