import { AccordionForm } from '@dts-stn/service-canada-design-system'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSessionStorage } from 'react-use'
import { VisibleFieldsObject } from '.'
import { Form } from '../../client-state/Form'
import { FormField } from '../../client-state/FormField'
import {
  ErrorsVisibleObject,
  FieldInputsObject,
  InputHelper,
} from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { Language } from '../../utils/api/definitions/enums'
import { FieldConfig } from '../../utils/api/definitions/fields'
import { NextClickedObject } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import {
  getDefaultInputs,
  getDefaultVisibleFields,
  getErrorVisibility,
  getNextClickedObj,
  getStepValidity,
  getVisisbleErrorsForStep,
  getKeyStepMap,
} from './utils'
import { generateCards } from './utils/generateCards'

interface MainFormProps {
  form: Form
}

const MainForm: React.FC<MainFormProps> = ({ form }) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const language = router.locale as Language
  const keyStepMap = getKeyStepMap(tsln, language)
  const allFieldConfigs: FieldConfig[] =
    BenefitHandler.getAllFieldData(language)

  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', getDefaultInputs(allFieldConfigs))

  const [visibleFields]: [
    VisibleFieldsObject,
    (value: VisibleFieldsObject) => void
  ] = useState(getDefaultVisibleFields(allFieldConfigs))

  const [errorsVisible, setErrorsVisible]: [
    ErrorsVisibleObject,
    (value: ErrorsVisibleObject) => void
  ] = useSessionStorage('errors-visible', getErrorVisibility(allFieldConfigs))

  const [nextForStepClicked, setNextForStepClicked]: [
    NextClickedObject,
    (value: NextClickedObject) => void
  ] = useSessionStorage('next-clicked', getNextClickedObj())

  const inputHelper = new InputHelper(inputs, setInputs, language)
  const [cardsValid, setCardsValid] = useState(
    getStepValidity(form, inputs, keyStepMap)
  )

  useEffect(() => {
    console.log('FORM CHANGED')
  }, [form])

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

  return (
    <AccordionForm
      id="mainForm"
      cardsState={cardsValid}
      cards={generateCards(
        form,
        handleButtonOnChange,
        handleOnChange,
        submitForm,
        errorsVisible,
        keyStepMap,
        tsln
      )}
      lang={language}
    />
  )
}

export default MainForm
