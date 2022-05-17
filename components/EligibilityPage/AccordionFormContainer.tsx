import { debounce } from 'lodash'
import type { Instance } from 'mobx-state-tree'
import React, { useState } from 'react'
import type { FormField } from '../../client-state/models/FormField'
import { WebTranslations } from '../../i18n/web'
import { FieldType } from '../../utils/api/definitions/fields'
import { useTranslation } from '../Hooks'
import { CurrencyField } from '../Forms/CurrencyField'
import { NumberField } from '../Forms/NumberField'
import { Radio } from '../Forms/Radio'
import { FormSelect } from '../Forms/Select'
import { TextField } from '../Forms/TextField'
// import { AccordionForm, Message } from '@dts-stn/decd-design-system'
import { AccordionForm, Message } from '@solosphere/decd-design-system'

export const AccordionFormContainer: React.VFC<any> = ({
  data,
  handleOnChange,
}) => {
  const tsln = useTranslation<WebTranslations>()

  const keyStepMap = {
    step1: {
      title: tsln.category.age,
      buttonLabel: tsln.category.incomeDetails,
      keys: ['age'],
    },
    step2: {
      title: tsln.category.incomeDetails,
      buttonLabel: tsln.category.legalStatus,
      keys: ['income', 'skipIncome'],
    },
    step3: {
      title: tsln.category.legalStatus,
      buttonLabel: tsln.category.residence,
      keys: ['legalStatus'],
    },
    step4: {
      title: tsln.category.residence,
      buttonLabel: tsln.category.marital,
      keys: [
        'livingCountry',
        'canadaWholeLife',
        'yearsInCanadaSince18',
        'everLivedSocialCountry',
      ],
    },
    step5: {
      title: tsln.category.marital,
      buttonLabel: tsln.results,
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

  const onChange = (step, field, e) => {
    console.log(`step`, step)
    console.log(`field`, field)
    console.log(`event`, e.target.value)

    handleOnChange(step, field, e)
  }

  const generateCards = () => {
    const generateChildren = (step, keys) => {
      const fields = data['fieldData'].filter((field) =>
        keys.includes(field.key)
      )
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
                  onChange={debounce((e) => onChange(step, field, e), 500)}
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
                  // onChange={debounce(
                  //   (e) => handleOnChange(step, field, e),
                  //   500
                  // )}
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
                      : field.values
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

  const [cardsValid, setCardsValid] = useState({
    step1: { isValid: true },
    step2: { isValid: true },
    step3: { isValid: true },
    step4: { isValid: true },
    step5: { isValid: true },
  })

  return (
    <div className="md:w-2/3">
      {/* <p>{test.label}</p>
      <p>{data['fieldData'].find((field) => field.key === 'age').label}</p> */}

      {/* {generateTestLabels()} */}

      {data && (
        <AccordionForm
          id="mainForm"
          cardsState={cardsValid}
          cards={generateCards()}
        />
      )}
    </div>
  )
}

const getPlaceholderForSelect = (
  field: Instance<typeof FormField>,
  tsln: WebTranslations
) => {
  let text = tsln.selectText[field.key]
  return text ? text : tsln.selectText.default
}
