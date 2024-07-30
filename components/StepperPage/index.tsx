import { TextField } from '@dts-stn/service-canada-design-system'
import { use } from 'chai'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSessionStorage } from 'react-use'
import { Form } from '../../client-state/Form'
import { FormField } from '../../client-state/FormField'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { Language, MaritalStatus } from '../../utils/api/definitions/enums'
import {
  FieldConfig,
  FieldKey,
  FieldType,
} from '../../utils/api/definitions/fields'
import { FieldsHandler } from '../../utils/api/fieldsHandler'
import { VisibleFieldsObject } from '../../utils/web/types'
import FieldFactory from '../FieldFactory'
import { CurrencyField } from '../Forms/CurrencyField'
import Duration from '../Forms/Duration'
import { MonthAndYear } from '../Forms/MonthAndYear'
import { NumberField } from '../Forms/NumberField'
import { Radio } from '../Forms/Radio'
import { FormSelect } from '../Forms/Select'
import { useTranslation } from '../Hooks'
import {
  getDefaultInputs,
  getBirthMonthAndYear,
  getDefaultVisibleFields,
  getPlaceholderForSelect,
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

  useEffect(() => {
    setStepComponents(getComponentForStep())
    form.update(inputHelper)
  }, [])

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

  const [steps, setSteps] = useState({
    1: {
      title: 'Marital Status',
      keys: ['maritalStatus', 'invSeparated'],
    },
    2: {
      title: 'Age',
      keys: ['age', 'receiveOAS', 'oasDeferDuration', 'oasDefer', 'oasAge'],
      partnerKeys: ['partnerAge', 'partnerBenefitStatus'],
    },
    3: {
      title: 'Income',
      keys: ['incomeAvailable', 'income', 'incomeWork'],
      partnerKeys: [
        'partnerIncomeAvailable',
        'partnerIncome',
        'partnerIncomeWork',
      ],
    },
    4: {
      title: 'Residence',
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
  })
  const totalSteps = Object.keys(steps).length
  const [activeStep, setActiveStep] = useState(1)
  const [isLastStep, setIsLastStep] = useState(false)

  useEffect(() => {
    if (activeStep === totalSteps) {
      setIsLastStep(true)
    } else {
      setIsLastStep(false)
    }
  }, [activeStep])

  useEffect(() => {
    // setSteps((prev) => {
    //   return {
    //     ...prev,
    //     [activeStep]: {
    //       ...prev[activeStep],
    //       component: <>CHANGED</>,
    //     },
    //   }
    // })
    setStepComponents(getComponentForStep())
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

    // if (key === 'receiveOAS') {
    //   const receiveOAS = newValue === 'true'
    //   setReceiveOAS(receiveOAS)
    // }

    field.value = newVal
    inputHelper.setInputByKey(field.key, newVal)
    form.update(inputHelper)

    setStepComponents(getComponentForStep())
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

    return (
      <>
        {isPartnered && <h1>Your information:</h1>}
        {fields.map((field: FormField) => {
          return (
            <div key={field.key}>
              <div className="pb-4" id={field.key}>
                <FieldFactory
                  field={field}
                  tsln={tsln}
                  handleOnChange={handleOnChange}
                />
              </div>
            </div>
          )
        })}
        {isPartnered && <h1>Partner&apos;s information:</h1>}
        {isPartnered &&
          partnerFields.map((field: FormField) => {
            return (
              <div key={field.key}>
                <div className="pb-4" id={field.key}>
                  <FieldFactory
                    field={field}
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

  console.log('isLastStep', isLastStep)

  return (
    <div className="my-14 ml-1">
      <Stepper
        id="stepper123"
        name="Old Age Security Benefits Estimator"
        activeStep={activeStep}
        totalSteps={totalSteps}
        heading={steps[activeStep].title}
        previousProps={{
          id: 'previous',
          text: 'Previous',
          onClick: () => setActiveStep(Math.max(activeStep - 1, 1)),
        }}
        nextProps={{
          id: 'next',
          text: isLastStep ? 'Estimate my benefits' : 'Next',
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

// or have StepperForm component that takes props for active step and content for each step? Or generate content inside the stepper based on what step we're on?

// const steps = useMemo(() => {
//   factory: () => [
//     {
//       label: 'Step 1',
//       value: 1,
//       component: <StepOne />,
//     },
//     {
//       label: 'Step 2',
//       value: 2,
//       component: <StepTwo />,
//     },
//     {
//       label: 'Step 3',
//       value: 3,
//       component: <StepThree />,
//     },
//   ]
// }, [])

export default StepperPage

// Make a mock page where we have a bare bones stepper with hardcoded content that you can step through and see the content change
