import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useSessionStorage } from 'react-use'
import { Form } from '../../client-state/Form'
import { FormField } from '../../client-state/FormField'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
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
} from '../QuestionsPage/utils'
import { Stepper } from '../Stepper'

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

  const [visibleFields]: [
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
          'legalStatus',
          'livingCountry',
          'livedOnlyInCanada',
          'yearsInCanadaSince18',
          'yearsInCanadaSinceOAS',
          'everLivedSocialCountry',
        ], // we actually dont want to show legalStatus question but to default to YES behind the scenes
        partnerKeys: [
          'partnerLegalStatus',
          'partnerLivingCountry',
          'partnerLivedOnlyInCanada',
          'partnerYearsInCanadaSince18',
        ],
      },
    }
  }

  const [steps, setSteps] = useState(getSteps())
  const totalSteps = Object.keys(steps).length
  const [activeStep, setActiveStep] = useState(1)
  const [isLastStep, setIsLastStep] = useState(false)

  useEffect(() => {
    if (activeStep === totalSteps) {
      setIsLastStep(true)
    } else {
      setIsLastStep(false)
    }
    setStepComponents(getComponentForStep())
    window.scrollTo(0, 0)
  }, [activeStep])

  useEffect(() => {
    console.log('visibleFields HAS CHANGED')
    // when a question is answered that triggers visibility of other questions, we need to update the visibleFields object.
    // I think using this strategy we can render the components dynamically
  }, [visibleFields])

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

    // if (key === 'receiveOAS') {
    //   const receiveOAS = newValue === 'true'
    //   setReceiveOAS(receiveOAS)
    // }

    field.value = newVal
    inputHelper.setInputByKey(field.key, newVal)
    form.update(inputHelper)

    setStepComponents(getComponentForStep())
  }

  const getMetaDataForField = (key: FieldKey) => {
    if (
      key === 'age' ||
      key === 'partnerAge' ||
      key === 'oasAge' ||
      key === 'oasDeferDuration'
    ) {
      return { ageDate }
    }

    if (key === 'income' || key === 'partnerIncome' || key === 'incomeWork') {
      return {
        incomeLabel,
        partnerIncomeLabel,
        incomeTooltip,
        partnerIncomeTooltip,
      }
    }

    return {}
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
  ])

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

    return (
      <>
        {isPartnered && (
          <h2 className="text-h2 font-header-gc mb-6 font-bold font-700">
            {tsln.stepper.yourInfo}
          </h2>
        )}
        {fields.map((field: FormField, index: number) => {
          return (
            <div
              key={field.key}
              className={!(index === fields.length - 1) ? 'mb-8' : ''}
            >
              <div id={field.key}>
                <FieldFactory
                  field={field}
                  metaData={getMetaDataForField(field.key)}
                  tsln={tsln}
                  handleOnChange={handleOnChange}
                />
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
            return (
              <div
                key={field.key}
                className={!(index === partnerFields.length - 1) ? 'mb-8' : ''}
              >
                <div className="pb-4" id={field.key}>
                  <FieldFactory
                    field={field}
                    metaData={getMetaDataForField(field.key)}
                    tsln={tsln}
                    handleOnChange={handleOnChange}
                  />
                </div>
              </div>
            )
          })}
      </>
    )
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
              setActiveStep(activeStep + 1)
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
