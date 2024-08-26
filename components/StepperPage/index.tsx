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
import { Language } from '../../utils/api/definitions/enums'
import { FieldConfig, FieldKey } from '../../utils/api/definitions/fields'
import { FieldsHandler } from '../../utils/api/fieldsHandler'
import { VisibleFieldsObject } from '../../utils/web/types'
import FieldFactory from '../FieldFactory'
import { useTranslation } from '../Hooks'
import {
  getBirthMonthAndYear,
  getDefaultInputs,
  getDefaultVisibleFields,
  getErrorVisibility,
} from '../QuestionsPage/utils'
import { Stepper } from '../Stepper'
import { ContextualAlert as Message } from '../Forms/ContextualAlert'

const StepperPage: React.FC = () => {
  const langx = useRouter().locale as Language
  const language =
    langx === Language.EN || langx === Language.FR ? langx : Language.EN

  const tsln = useTranslation<WebTranslations>()

  const allFieldConfigs: FieldConfig[] = FieldsHandler.getAllFieldData(language)
  console.log('allFieldConfigs', allFieldConfigs)
  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))
  const [ageDate, setAgeDate] = useState(
    inputs.age
      ? getBirthMonthAndYear(inputs.age)
      : { month: 1, year: undefined }
  )
  console.log('ageDate', ageDate)
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

  console.log('visibleFields', visibleFields)
  console.log('inputs', inputs)

  // for each step we need to take "visibleFields" and filter by which fields are relevant for a given step.

  const inputHelper = new InputHelper(inputs, setInputs, language)
  const form = new Form(language, inputHelper, visibleFields)

  console.log('form', form)

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
      acc[key] = false
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
  const [visibleErrors, setVisibleErrors]: [
    ErrorsVisibleObject,
    (value: ErrorsVisibleObject) => void
  ] = useSessionStorage('visibleErrors', getStepErrorVisibility(activeStep))
  const [fieldsMetaData, setFieldsMetaData] = useState(
    getFieldsMetaData(activeStep)
  )

  useEffect(() => {
    if (activeStep === totalSteps) {
      setIsLastStep(true)
    } else {
      setIsLastStep(false)
    }
    setStepComponents(getComponentForStep())
    setVisibleErrors(getStepErrorVisibility(activeStep))
    window.scrollTo(0, 0)
  }, [activeStep])

  useEffect(() => {
    setVisibleErrors(getStepErrorVisibility(activeStep))
    setFieldsMetaData(getFieldsMetaData(activeStep))
  }, [JSON.stringify(visibleFields)])

  useEffect(() => {
    setStepComponents(getComponentForStep())
  }, [fieldsMetaData])

  // useEffect(() => {

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
    getStepErrorVisibility(activeStep)
  }

  // this does not work
  // useEffect(() => {
  //   console.log('language changed')
  //   setSteps((prev) => {
  //     return { ...prev, ...getSteps() }
  //   })
  // }, [tsln])

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

  const getErrorForField = (field: FormField, visibleErrors: any) => {
    return [field.error, 'also an error message here']
  }

  const getComponentForStep = () => {
    const fields = form.visibleFields.filter((field) =>
      steps[activeStep].keys.includes(field.key)
    )

    const partnerFields = form.visibleFields.filter((field) =>
      steps[activeStep].partnerKeys?.includes(field.key)
    )

    const isPartnered = partnerFields.length > 0

    console.log(activeStep)
    console.log('fields', fields)
    console.log('partnerFields', partnerFields)
    console.log('visibleFields', visibleFields)

    return (
      <>
        {isPartnered && (
          <h2 className="text-h2 font-header-gc mb-6 font-bold font-700">
            {tsln.stepper.yourInfo}
          </h2>
        )}
        {fields.map((field: FormField, index: number) => {
          const [formError, alertError] = getErrorForField(field, visibleErrors)

          return (
            <div
              key={field.key}
              className={!(index === fields.length - 1) ? 'mb-8' : ''}
            >
              <div id={field.key}>
                <FieldFactory
                  field={field}
                  metaData={fieldsMetaData}
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
              visibleErrors
            )
            return (
              <div
                key={field.key}
                className={!(index === partnerFields.length - 1) ? 'mb-8' : ''}
              >
                <div id={field.key}>
                  <FieldFactory
                    field={field}
                    metaData={fieldsMetaData}
                    tsln={tsln}
                    handleOnChange={handleOnChange}
                    formError={formError}
                  />
                </div>
              </div>
            )
          })}
      </>
    )
  }

  const handleOnNextClick = () => {
    // check if all required fields are filled out
    // every field has an "error" property when empty - which is the case when the page is first loaded
    // we have to check against visible fields (filter visible fields for the particular step)
    // if visibleFields[maritalStatus] is true, and has error (empty or invalid), then set visibleErrors[maritalStatus] = true

    // useEffect when page loads should give visibleErrors all false: {maritalStatus: false}

    // if no errors, proceed to next step, if errors, scroll up to top of page with error summary
    setActiveStep(activeStep + 1)
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
            if (isLastStep) {
              console.log('ESTIMATE MY BENEFITS')
            } else {
              handleOnNextClick()
            }
          },
        }}
      >
        {stepComponents}
      </Stepper>
    </div>
  )
}

export default StepperPage

// Make a mock page where we have a bare bones stepper with hardcoded content that you can step through and see the content change
