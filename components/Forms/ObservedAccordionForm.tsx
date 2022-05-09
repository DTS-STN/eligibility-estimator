import React, { useState, useEffect } from 'react'
import { AccordionForm } from '@dts-stn/decd-design-system'
import { debounce } from 'lodash'
import { observer } from 'mobx-react'
import type { Instance } from 'mobx-state-tree'
import { useStore, useTranslation } from '../Hooks'
import { RootStore } from '../../client-state/store'
import { WebTranslations } from '../../i18n/web'
import type { Form } from '../../client-state/models/Form'
import type { FormField } from '../../client-state/models/FormField'
import { FieldType } from '../../utils/api/definitions/fields'
import { CurrencyField } from './CurrencyField'
import { NumberField } from './NumberField'
import { Radio } from './Radio'
import { FormSelect } from './Select'
import { TextField } from './TextField'

export const ObservedAccordionForm: React.VFC<any> = observer(({}) => {
  const tsln = useTranslation<WebTranslations>()
  const root: Instance<typeof RootStore> = useStore()
  const form: Instance<typeof Form> = root.form

  const [cardsValid, setCardsValid] = useState({
    step1: { isValid: false },
    step2: { isValid: false },
    step3: { isValid: false },
    step4: { isValid: false },
  })

  const [localFormState, setLocalFormState] = useState({ a: 1, b: 2 })

  useEffect(() => {
    console.log('INSIDE USE EFFECT OF OBSERVED ACCORDION FORM')
  }, [])

  const onInputChange = (sectionId, value) => {
    if (value === 'valid') {
      setCardsValid((currentCardsData) => {
        const updatedCardsData = { ...currentCardsData }
        updatedCardsData[sectionId].isValid = true
        return updatedCardsData
      })
    } else {
      setCardsValid((currentCardsData) => {
        const updatedCardsData = { ...currentCardsData }
        updatedCardsData[sectionId].isValid = false
        return updatedCardsData
      })
    }
  }

  const cardsTEST = [
    {
      id: 'step1',
      title: 'Age',
      buttonLabel: 'Income',
      children: [
        <div key="step1">
          <p>Random text for testing purposes. Test test testest testing</p>
          <input
            type="text"
            style={{
              border: '1px solid black',
            }}
            onChange={(e) => onInputChange('step1', e.currentTarget.value)}
          />
          {true && <p>THIS IS EROR</p>}
        </div>,
      ],
    },
    {
      id: 'step2',
      title: 'Income',
      children: [
        <div key="step2">
          <input
            type="text"
            style={{
              border: '1px solid black',
            }}
            onChange={(e) => onInputChange('step2', e.currentTarget.value)}
          />
        </div>,
      ],
      buttonLabel: 'Legal status',
    },
    {
      id: 'step3',
      title: 'Legal status',
      children: [
        <div key="step3">
          <input
            type="text"
            style={{
              border: '1px solid black',
            }}
            onChange={(e) => onInputChange('step3', e.currentTarget.value)}
          />
        </div>,
      ],
      buttonLabel: 'Residence history',
    },
    {
      id: 'step4',
      title: 'Residence history',
      children: [
        <div key="step4">
          <input
            type="text"
            style={{
              border: '1px solid black',
            }}
            onChange={(e) => onInputChange('step4', e.currentTarget.value)}
          />
        </div>,
      ],
      buttonLabel: 'Marital Status',
    },
    {
      id: 'step5',
      title: 'Marital Status',
      children: [
        <div key="step5">
          <input
            type="text"
            style={{
              border: '1px solid black',
            }}
            onChange={(e) => onInputChange('step5', e.currentTarget.value)}
          />
          <p>random text</p>
        </div>,
      ],
      buttonLabel: 'Submit',
      buttonOnChange: () => {
        console.log('HI THERE') // seems that buttonOnChange only triggers on last card
      },
    },
  ]

  const getFormState = () => {
    return form.fields.map(
      (field: Instance<typeof FormField>, index: number) => {
        return {
          key: field.key,
          categoryText: field.category.text,
          fieldType: field.type,
          fieldLabel: field.label,
          fieldValue: field.value,
          fieldPlaceholder: field.placeholder,
          fieldError: field.error,
          fieldHandler: field.handleChange,
          fieldOptions: field.options,
        }
      }
    )
  }

  // need to make a key/step mapper:
  // iterate over key/step mapper and build up cards.
  // iterate over keys. Check if that key is in "currentKeys", build up the component
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

  const generateCards = (formFields) => {
    const generateChildren = (step, keys) => {
      const fields = formFields.filter((field) => keys.includes(field.key))
      return fields.map((field) => {
        return (
          <div key={step}>
            <div key={field.key}>
              {field.type === FieldType.NUMBER && (
                <NumberField
                  type={field.type}
                  name={field.key}
                  label={field.label}
                  placeholder={field.placeholder ?? ''}
                  onChange={debounce(field.handleChange, 3000)}
                  value={field.value}
                  error={field.error}
                  required
                />
              )}
              {field.type == FieldType.CURRENCY && (
                <div className="pb-10">
                  <CurrencyField
                    type={field.type}
                    name={field.key}
                    label={field.label}
                    onChange={field.handleChange}
                    placeholder={field.placeholder ?? ''}
                    value={field.value}
                    error={field.error}
                    required
                  />
                </div>
              )}
              {field.type == FieldType.STRING && (
                <div className="pb-10">
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
                <div className="pb-10">
                  <FormSelect
                    name={field.key}
                    field={field}
                    error={field.error}
                    placeholder={getPlaceholderForSelect(field, tsln)}
                    value={null}
                  />
                </div>
              )}
              {(field.type == FieldType.RADIO ||
                field.type == FieldType.BOOLEAN) && (
                <div className="pb-10">
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
                    error={field.error}
                    required
                  />
                </div>
              )}
            </div>
          </div>
        )
      })
    }

    const cards = Object.keys(keyStepMap).map((step) => {
      const cardMeta = keyStepMap[step]
      const children = generateChildren(step, cardMeta.keys) // ex. ("step1", ["age"])

      // card with all form fields from the Result object that pertaining to a given section
      return {
        id: step,
        title: cardMeta.title,
        buttonLabel: cardMeta.buttonLabel,
        children,
      }
    })

    return cards
  }

  const renderAccordionForm = (formFields) => {
    const OForm = observer(AccordionForm)
    const cards = generateCards(formFields)

    return <OForm id="mainForm" cardsState={cardsValid} cards={cards} />
  }

  return <div>{renderAccordionForm(form.fields)}</div>
})

const getPlaceholderForSelect = (
  field: Instance<typeof FormField>,
  tsln: WebTranslations
) => {
  let text = tsln.selectText[field.key]
  return text ? text : tsln.selectText.default
}
