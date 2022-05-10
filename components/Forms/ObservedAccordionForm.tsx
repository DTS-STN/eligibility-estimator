import React, { useState, useEffect, useCallback } from 'react'
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

// this component is meant as a playground to experiment and test AccordionForm component and mobx-state-tree
export const ObservedAccordionForm: React.VFC<any> = observer(({ form }) => {
  const tsln = useTranslation<WebTranslations>()

  const [cardsValid, setCardsValid] = useState({
    step1: { isValid: true },
    step2: { isValid: true },
    step3: { isValid: true },
    step4: { isValid: true },
  })

  const getNewTestChildren = () => {
    return <p>CHILDREN HAVE CHANGED</p>
  }

  const onInputChange = (fieldKey, value) => {
    if (fieldKey === 'income') {
      value = value.replace(/\D/g, '')
    }

    console.log(`value`, value)
    console.log(`fieldKey`, fieldKey)

    // if (value === '25') {
    //   console.log('inside card is VALID')
    //   setCardsValid((currentCardsData) => {
    //     const updatedCardsData = { ...currentCardsData }
    //     updatedCardsData['step1'].isValid = true
    //     return updatedCardsData
    //   })
    // } else {
    //   setCardsValid((currentCardsData) => {
    //     const updatedCardsData = { ...currentCardsData }
    //     updatedCardsData['step1'].isValid = false
    //     return updatedCardsData
    //   })
    // }

    // setting local state and using it to show values in components
    if (fieldKey === 'age' || fieldKey === 'income') {
      const allButKey = formState.filter((field) => field.key !== fieldKey)
      const foundField = formState.find((field) => field.key === fieldKey)
      setFormState([...allButKey, { ...foundField, fieldValue: value }])
    }

    // or changing the cards directly
    if (fieldKey === 'legalStatus') {
      const findCard = cards.find((card) => card.id === 'step3')
      const newChildren = getNewTestChildren()
      const newCard = { ...findCard, children: [newChildren] }
      setCards(cards.map((card) => (card.id === findCard.id ? newCard : card)))
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
          type: field.type,
          label: field.label,
          value: field.value,
          placeholder: field.placeholder,
          error: field.error,
          handleChange: field.handleChange,
          options: field.options,
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
    // step4: {
    //   title: 'Residence history',
    //   buttonLabel: 'Marital status',
    //   keys: [
    //     'livingCountry',
    //     'canadaWholeLife',
    //     'yearsInCanadaSince18',
    //     'everLivedSocialCountry',
    //   ],
    // },
    // step5: {
    //   title: 'Marital status',
    //   buttonLabel: 'Submit',
    //   keys: [
    //     'maritalStatus',
    //     'partnerBenefitStatus',
    //     'partnerAge',
    //     'partnerLivingCountry',
    //     'partnerLegalStatus',
    //     'partnerCanadaWholeLife',
    //     'partnerYearsInCanadaSince18',
    //     'partnerIncome',
    //   ],
    // },
  }

  const getValue = (fieldKey) => {
    const foundField = formState.find((field) => field.key === fieldKey)
    // console.log('FOUND FIELD', foundField)
    return foundField.value
  }

  const generateCards = () => {
    const generateChildren = (step, keys) => {
      const fields = form.fields.filter((field) => keys.includes(field.key))
      const children = fields.map((field) => {
        console.log(field.key)
        return (
          <div key={field.key}>
            {field.type === FieldType.NUMBER && (
              <NumberField
                type={field.type}
                name={field.key}
                label={field.label}
                placeholder={field.placeholder ?? ''}
                onChange={(e) =>
                  onInputChange(field.key, e.currentTarget.value)
                }
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
                  onChange={(e) =>
                    onInputChange(field.key, e.currentTarget.value)
                  }
                  placeholder={field.placeholder ?? ''}
                  value={field.value}
                  error={field.error}
                  required
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
                  onChange={(e) =>
                    onInputChange(field.key, e.currentTarget.value)
                  }
                  required
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

      // card with all form fields from the Result object that pertaining to a given section
      return {
        id: step,
        title: cardMeta.title,
        buttonLabel: cardMeta.buttonLabel,
        children: children[step],
      }
    })

    return cards
  }

  const [formState, setFormState] = useState(getFormState())
  const [cards, setCards] = useState(generateCards())

  useEffect(() => {
    console.log('CARDS', cards)
  }, [cards])

  useEffect(() => {
    console.log('CHANGED FORM STATE', formState)
    // setCards(generateCards(useLocalState))
  }, [formState])

  return (
    <div>
      <AccordionForm id="mainForm" cardsState={cardsValid} cards={cards} />
    </div>
  )
})

const getPlaceholderForSelect = (
  field: Instance<typeof FormField>,
  tsln: WebTranslations
) => {
  let text = tsln.selectText[field.key]
  return text ? text : tsln.selectText.default
}
