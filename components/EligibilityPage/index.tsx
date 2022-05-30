import { debounce } from 'lodash'
import { observer } from 'mobx-react'
import type { Instance } from 'mobx-state-tree'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import type { Form } from '../../client-state/models/Form'
import type { FormField } from '../../client-state/models/FormField'
import { RootStore } from '../../client-state/store'
import { WebTranslations } from '../../i18n/web'
import { FieldType } from '../../utils/api/definitions/fields'
import MainHandler from '../../utils/api/mainHandler'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import { CurrencyField } from '../Forms/CurrencyField'
import { NumberField } from '../Forms/NumberField'
import { Radio } from '../Forms/Radio'
import { FormSelect } from '../Forms/Select'
import { TextField } from '../Forms/TextField'
import { AccordionForm, Message } from '@dts-stn/decd-design-system'

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 */
export const EligibilityPage: React.VFC = observer(({}) => {
  console.log('rendering factory ')

  const router = useRouter()
  const locale = router.locale
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)

  const root: Instance<typeof RootStore> = useStore()
  const form: Instance<typeof Form> = root.form

  const input = root.getInputObject()
  input._language = locale
  const data = new MainHandler(input).results

  // on mobile only, captures enter keypress, does NOT submit form, and blur (hide) keyboard
  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (isMobile && event.key == 'Enter') {
        const el = document.activeElement as HTMLInputElement
        el.blur()
      }
    })
  }, [isMobile])

  if ('error' in data) {
    // typeof data == ResponseError
    // TODO: when error, the form does not update. Repro: set age to 200, change marital from single to married, notice partner questions don't show
    console.log('Data update resulted in error:', data)
  }

  if ('fieldData' in data) {
    // typeof data == ResponseSuccess
    form.setupForm(data.fieldData)
    root.setSummary(data.summary)
  }

  const keyStepMap = {
    step1: {
      title: tsln.category.age,
      buttonLabel: `${tsln.nextStep} - ${tsln.category.incomeDetails}`,
      keys: ['age', 'oasAge'],
    },
    step2: {
      title: tsln.category.incomeDetails,
      buttonLabel: `${tsln.nextStep} - ${tsln.category.legalStatus}`,
      keys: ['income', 'skipIncome'],
    },
    step3: {
      title: tsln.category.legalStatus,
      buttonLabel: `${tsln.nextStep} - ${tsln.category.residence}`,
      keys: ['legalStatus'],
    },
    step4: {
      title: tsln.category.residence,
      buttonLabel: `${tsln.nextStep} - ${tsln.category.marital}`,
      keys: [
        'livingCountry',
        'canadaWholeLife',
        'yearsInCanadaSince18',
        'everLivedSocialCountry',
      ],
    },
    step5: {
      title: tsln.category.marital,
      buttonLabel: tsln.getEstimate,
      keys: [
        'maritalStatus',
        'partnerBenefitStatus',
        'partnerAge',
        'partnerLivingCountry',
        'partnerLegalStatus',
        'partnerCanadaWholeLife',
        'partnerYearsInCanadaSince18',
        'partnerIncome',
      ],
    },
  }

  const [cardsValid, setCardsValid] = useState(null)

  const generateCardsValid = () => {
    const inputs = root.getInputObject()
    const cardsValidObj = {}
    Object.keys(keyStepMap).forEach((step, index) => {
      const stepKeys = keyStepMap[step].keys
      const someKeysPresent = stepKeys.some((key) => inputs[key])
      const previousStep = cardsValidObj[`step${index}`]
      const previousTrue = previousStep?.isValid

      const isValid = someKeysPresent && (!previousStep || previousTrue)
      cardsValidObj[step] = { isValid }
    })

    return cardsValidObj
  }

  useEffect(() => {
    setCardsValid(generateCardsValid())
  }, [])

  const handleOnChange = (step, field, event) => {
    field.handleChange(event)
    const inputs = root.getInputObject()
    const isValid = inputs[field.key] && !field.error

    setCardsValid((currentCardsData) => {
      const updatedCardsData = { ...currentCardsData }
      updatedCardsData[step].isValid = isValid
      return updatedCardsData
    })
  }

  const generateCards = () => {
    const generateChildren = (step, keys) => {
      const fields = form.fields.filter((field) => keys.includes(field.key))
      const children = fields.map((field) => {
        return (
          <div key={field.key}>
            {field.type === FieldType.NUMBER && (
              <div className="pb-4">
                <NumberField
                  type={field.type}
                  name={field.key}
                  label={field.label}
                  placeholder={field.placeholder ?? ''}
                  onChange={debounce(
                    (e) => handleOnChange(step, field, e),
                    500
                  )}
                  value={field.value}
                  helpText={field.helpText}
                  required
                />
              </div>
            )}
            {field.type == FieldType.CURRENCY && (
              <div className="pb-4">
                <CurrencyField
                  type={field.type}
                  name={field.key}
                  label={field.label}
                  onChange={debounce(
                    (e) => handleOnChange(step, field, e),
                    500
                  )}
                  placeholder={field.placeholder ?? ''}
                  value={field.value}
                  helpText={field.helpText}
                  required
                />
              </div>
            )}
            {field.type == FieldType.STRING && (
              <div className="pb-4">
                <TextField
                  type={field.type}
                  name={field.key}
                  label={field.label}
                  placeholder={field.placeholder ?? ''}
                  onChange={debounce(
                    (e) => handleOnChange(step, field, e),
                    500
                  )}
                  value={field.value}
                  error={field.error}
                  required
                />
              </div>
            )}
            {(field.type == FieldType.DROPDOWN ||
              field.type == FieldType.DROPDOWN_SEARCHABLE) && (
              <div className="pb-4">
                <FormSelect
                  name={field.key}
                  field={field}
                  placeholder={getPlaceholderForSelect(field, tsln)}
                  value={null}
                />
              </div>
            )}
            {(field.type == FieldType.RADIO ||
              field.type == FieldType.BOOLEAN) && (
              <div className="pb-4">
                <Radio
                  name={field.key}
                  checkedValue={field.value}
                  values={
                    field.type == 'boolean'
                      ? [
                          {
                            key: 'true',
                            text: tsln.yes,
                          },
                          {
                            key: 'false',
                            text: tsln.no,
                          },
                        ]
                      : field.options
                  }
                  keyforid={field.key}
                  label={field.label}
                  onChange={(e) => handleOnChange(step, field, e)}
                  required
                  showTooltip={['legalStatus', 'maritalStatus'].includes(
                    field.key
                  )}
                />
              </div>
            )}
            {field.error && (
              <div className="mt-6 md:pr-12">
                <Message
                  id={field.key}
                  alert_icon_id={field.key}
                  alert_icon_alt_text="warning icon"
                  type="warning"
                  message_heading={field.error}
                  message_body={field.error}
                />
              </div>
            )}
            {field.info && (
              <div className="mt-6 md:pr-12">
                <Message
                  id={field.key}
                  alert_icon_id={field.key}
                  alert_icon_alt_text="info icon"
                  type="info"
                  message_heading={field.info}
                  message_body={field.info}
                />
              </div>
            )}
          </div>
        )
      })

      return { [step]: children }
    }

    return Object.keys(keyStepMap).map((step, index) => {
      const cardMeta = keyStepMap[step]
      const children = generateChildren(step, cardMeta.keys) // ex. ("step1", ["age"])

      const card = {
        id: step,
        title: cardMeta.title,
        buttonLabel: cardMeta.buttonLabel,
        children: children[step],
      }

      if (index === Object.keys(keyStepMap).length - 1) {
        return {
          ...card,
          buttonOnChange: (e) => {
            e.preventDefault()
            if (
              !form.validateAgainstEmptyFields(router.locale) &&
              !form.hasErrors
            ) {
              root.saveStoreState()
              router.push('/results')
            }
          },
        }
      }

      return card
    })
  }

  return (
    <>
      {cardsValid && (
        <div className="md:w-2/3">
          <AccordionForm
            id="mainForm"
            cardsState={cardsValid}
            cards={generateCards()}
          />
        </div>
      )}
    </>
  )
})

const getPlaceholderForSelect = (
  field: Instance<typeof FormField>,
  tsln: WebTranslations
) => {
  let text = tsln.selectText[field.key]
  return text ? text : tsln.selectText.default
}
