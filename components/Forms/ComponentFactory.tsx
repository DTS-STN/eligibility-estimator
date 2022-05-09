import { FileWriter } from 'csv-writer/src/lib/file-writer'
import { debounce } from 'lodash'
import { observer } from 'mobx-react'
import type { Instance } from 'mobx-state-tree'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback } from 'react'
import type { Form } from '../../client-state/models/Form'
import type { FormField } from '../../client-state/models/FormField'
import { RootStore } from '../../client-state/store'
import { WebTranslations } from '../../i18n/web'
import { FieldCategory, Language } from '../../utils/api/definitions/enums'
import { FieldType } from '../../utils/api/definitions/fields'
import MainHandler from '../../utils/api/mainHandler'
import { FAQ } from '../FAQ'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import { NeedHelp } from '../NeedHelp'
import { CurrencyField } from './CurrencyField'
import { FormButtons } from './FormButtons'
import { NumberField } from './NumberField'
import { Radio } from './Radio'
import { FormSelect } from './Select'
import { TextField } from './TextField'
import { AccordionForm, Message } from '@dts-stn/decd-design-system'

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 */
export const ComponentFactory: React.VFC = observer(({}) => {
  console.log('rendering factory ')
  let lastCategory = null

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
    step1: { title: 'Age', buttonLabel: 'Income', keys: ['age'] },
    step2: {
      title: 'Income',
      buttonLabel: 'Legal Status',
      keys: ['income', 'skipIncome'],
    },
    step3: {
      title: 'Legal status',
      buttonLabel: 'Residence history',
      keys: ['legalStatus'],
    },
    step4: {
      title: 'Residence history',
      buttonLabel: 'Marital status',
      keys: [
        'livingCountry',
        'canadaWholeLife',
        'yearsInCanadaSince18',
        'everLivedSocialCountry',
      ],
    },
    step5: {
      title: 'Marital status',
      buttonLabel: 'Submit',
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

  const [cardsValid, setCardsValid] = useState({
    step1: { isValid: true },
    step2: { isValid: true },
    step3: { isValid: true },
    step4: { isValid: true },
    step5: { isValid: true },
  })

  const handleOnChange = (step, field, event) => {
    console.log(`event.target.value`, event.target.value)

    if (event.target.value === 23) {
      setCardsValid((currentCardsData) => {
        const updatedCardsData = { ...currentCardsData }
        updatedCardsData['step1'].isValid = true
        return updatedCardsData
      })
    }

    // if (event.target.value === '23') {
    //   console.log('INSIDE SUCCESS')
    //   setCardsValid((currentCardsData) => {
    //     const updatedCardsData = { ...currentCardsData }
    //     updatedCardsData[step].isValid = true
    //     return updatedCardsData
    //   })
    // } else {
    //   setCardsValid((currentCardsData) => {
    //     const updatedCardsData = { ...currentCardsData }
    //     updatedCardsData[step].isValid = false
    //     return updatedCardsData
    //   })
    // }

    field.handleChange(event)
  }

  const generateCards = (formFields) => {
    const generateChildren = (step, keys) => {
      const fields = form.fields.filter((field) => keys.includes(field.key))

      const children = fields.map((field) => {
        console.log(`${field.key} - ${field.value}`)
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
                  onChange={debounce(field.handleChange, 300)}
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
                  onChange={field.handleChange}
                  required
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
                  message_body="I need to get the message body for this warning from Figma and add to en/fr tarnslation docs"
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
                  message_body="I need to get the message body for this info from Figma and add to en/fr tarnslation docs"
                />
              </div>
            )}
          </div>
        )
      })

      return { [step]: children }
    }

    const cards = Object.keys(keyStepMap).map((step) => {
      const cardMeta = keyStepMap[step]
      const children = generateChildren(step, cardMeta.keys) // ex. ("step1", ["age"])

      return {
        id: step,
        title: cardMeta.title,
        buttonLabel: cardMeta.buttonLabel,
        children: children[step],
      }
    })

    return cards
  }

  const generateCardsValid = (formFields) => {
    const cardsValid = {}
    Object.keys(keyStepMap).forEach((step) => {
      const stepKeys = keyStepMap[step].keys
      const fields = formFields.filter((field) => stepKeys.includes(field.key))
      const isValid = !fields.some((field) => field.error)

      cardsValid[step] = { isValid }
    })

    console.log(cardsValid)
    return cardsValid
  }

  const renderAccordionForm = (formFields) => {
    console.log('INSIDE RENDER ACCORDION FORM')
    const cards = generateCards(formFields)
    // const cardsValid = generateCardsValid(formFields)
    const ObservedAccordionForm = observer(AccordionForm)

    console.log(`cardsValid`, cardsValid)
    return (
      <div className="md:w-2/3">
        <ObservedAccordionForm
          id="mainForm"
          cardsState={cardsValid}
          cards={cards}
        />
      </div>
    )
  }

  return (
    <>
      {renderAccordionForm(form.fields)}

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 mt-10">
        <form
          name="ee-form"
          data-testid="ee-form"
          action="../../pages/eligibility"
          onSubmit={(e) => e.preventDefault()}
          className="col-span-2"
          noValidate
        >
          <input
            type="hidden"
            name="_language"
            id="_language"
            value={router.locale == 'en' ? Language.EN : Language.FR}
          />

          <FormButtons />
        </form>
      </div>
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
