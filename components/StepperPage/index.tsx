import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useSessionStorage } from 'react-use'
import { Form } from '../../client-state/Form'
import { FormField } from '../../client-state/FormField'
import {
  ErrorsVisibleObject,
  FieldInputsObject,
  InputHelper,
} from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { Language, MaritalStatus } from '../../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../../utils/api/definitions/fields'
import { FieldsHandler } from '../../utils/api/fieldsHandler'
import { VisibleFieldsObject } from '../../utils/web/types'
import FieldFactory from '../FieldFactory'
import { useTranslation } from '../Hooks'
import {
  getBirthMonthAndYear,
  getDefaultInputs,
  getDefaultVisibleFields,
  getErrorForField,
  getErrorVisibility,
  getVisisbleErrorsForActiveStep,
  getVisisbleErrorsForStep,
} from '../QuestionsPage/utils'
import { Stepper } from '../Stepper'
import { ContextualAlert as Message } from '../Forms/ContextualAlert'
import { ErrorsSummary } from '../Forms/ErrorsSummary'

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

  // useEffect(() => {
  //   setStepComponents(getComponentForStep())
  // }, [])

  useEffect(() => {
    setSteps(getSteps())
    setStepComponents(getComponentForStep())
  }, [tsln])

  const [visibleFields, setVisibleFields]: [
    VisibleFieldsObject,
    (value: VisibleFieldsObject) => void
  ] = useState(getDefaultVisibleFields(allFieldConfigs))

  // for each step we need to take "visibleFields" and filter by which fields are relevant for a given step.

  const inputHelper = new InputHelper(inputs, setInputs, language)
  const form = new Form(language, inputHelper, visibleFields)

  const getSteps = () => {
    return {
      1: {
        title: tsln.category.marital,
        keys: ['maritalStatus', 'invSeparated'],
        partnerKeys: [],
      },
      2: {
        title: tsln.category.age,
        keys: ['age', 'receiveOAS', 'oasDeferDuration', 'oasDefer', 'oasAge'],
        partnerKeys: ['partnerAge', 'partnerBenefitStatus'],
      },
      3: {
        title: tsln.category.income,
        keys: ['incomeAvailable', 'income', 'incomeWork'],
        partnerKeys: [
          'partnerIncomeAvailable',
          'partnerIncome',
          'partnerIncomeWork',
        ],
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
      },
    }
  }

  const getStepErrorVisibility = (step: number) => {
    const allStepKeys = [
      ...steps[step].keys,
      ...steps[step].partnerKeys,
    ].filter((key) => visibleFields[key])

    return allStepKeys.reduce((acc, key) => {
      acc[key] = false // set this based on what fields are currently visible.
      return acc
    }, {})
  }

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

  const [steps, setSteps] = useState(getSteps())
  const totalSteps = Object.keys(steps).length
  const [activeStep, setActiveStep] = useSessionStorage('step', 1)
  const [isLastStep, setIsLastStep] = useState(false)

  const [errorsVisible, setErrorsVisible]: [
    ErrorsVisibleObject,
    (value: ErrorsVisibleObject) => void
  ] = useSessionStorage('visibleErrors', getStepErrorVisibility(activeStep))
  const errorsAsAlerts = ['legalStatus', 'everLivedSocialCountry']

  const [fieldsMetaData, setFieldsMetaData] = useState(
    getFieldsMetaData(activeStep)
  )

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
    // setErrorsVisible(getStepErrorVisibility(activeStep))
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

    // getStepErrorVisibility(activeStep)
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
    // get error data here, whats visible and whatis not?

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

          console.log('formError', formError)
          console.log('alertError', alertError)

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

  const getIsStepValid = (step: number) => {
    const stepKeys = steps[step].keys.concat(steps[step].partnerKeys)

    const stepVisibleKeys = stepKeys.filter(
      (value) => form.visibleFieldKeys.includes(value) // all keys for a step that are visible
    )

    const allFieldsFilled: boolean = stepVisibleKeys.every((key) => inputs[key])

    const visibleStepFields: FormField[] = form.visibleFields.filter((field) =>
      stepVisibleKeys.includes(field.key)
    )
    const allFieldsNoError: boolean = visibleStepFields.every(
      (field) => field.valid
    )

    const stepIsValid = allFieldsFilled && allFieldsNoError
    return stepIsValid
  }

  const handleOnNextClick = () => {
    // check if all required fields are filled out
    // every field has an "error" property when empty - which is the case when the page is first loaded
    // we have to check against visible fields (filter visible fields for the particular step)
    // if visibleFields[maritalStatus] is true, and has error (empty or invalid), then set visibleErrors[maritalStatus] = true

    // useEffect when page loads should give visibleErrors all false: {maritalStatus: false}

    // if no errors, proceed to next step, if errors, scroll up to top of page with error summary

    // these are steps relevant to current step. ex. marital status.
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
      } else {
        console.log('FORM IS INVALID')
      }
    }

    const stepValid = getIsStepValid(activeStep)
    if (stepValid) {
      if (isLastStep) {
        // submit form
        submitForm()
      } else {
        setActiveStep(activeStep + 1)
      }
    }
  }

  form.update(inputHelper)
  return (
    <div className="my-14 ml-1 sm:w-4/5 md:w-4/6 w-full">
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
        }}
      >
        <ErrorsSummary
          errorFields={form.visibleFields.filter(
            (field) =>
              steps[activeStep].keys
                .concat(steps[activeStep].partnerKeys)
                .includes(field.key) &&
              field.error &&
              errorsVisible[field.key] &&
              (!errorsAsAlerts.includes(field.key) || field.value === undefined)
          )}
          receiveOAS={receiveOAS}
        />
        {stepComponents}
      </Stepper>
    </div>
  )
}

export default StepperPage

// Make a mock page where we have a bare bones stepper with hardcoded content that you can step through and see the content change
