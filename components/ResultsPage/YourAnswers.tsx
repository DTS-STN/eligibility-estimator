import React, { useState } from 'react'
import { FieldInput } from '../../client-state/InputHelper'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { FieldsHandler } from '../../utils/api/fieldsHandler'
import { FieldConfig, FieldType } from '../../utils/api/definitions/fields'
import { useTranslation } from '../Hooks'
import Link from 'next/link'
import { MonthsYears } from '../../utils/api/definitions/types'
import { Accordion } from '../Forms/Accordion'
import { fieldDefinitions } from '../../utils/api/definitions/fields'
import { FieldCategory } from '../../utils/api/definitions/enums'
import { useSessionStorage } from 'react-use'
import { keyToStepMap } from '../QuestionsPage/utils'
import { Router, useRouter } from 'next/router'

type CategorizedInputs = {
  [category in FieldCategory]?: FieldInput[]
}

export const YourAnswers: React.VFC<{
  title: string
  inputs: FieldInput[]
}> = ({ title, inputs }) => {
  const tsln = useTranslation<WebTranslations>()
  const router = useRouter()
  // allFieldData is the full configuration for ALL fields - not only the visible ones.
  const allFieldData: FieldConfig[] = FieldsHandler.getAllFieldData(
    tsln._language
  )

  // State for handling individual accordion
  const [accordionStates, setAccordionStates] = useState(() => {
    const initialState = {}
    Object.keys(FieldCategory).forEach((categoryKey) => {
      initialState[categoryKey] = false
    })
    return initialState
  })
  const [_activeStep, setActiveStep] = useSessionStorage('step')

  const toggleAccordion = (category) => {
    setAccordionStates((prevStates) => ({
      ...prevStates,
      [category]: !prevStates[category],
    }))
  }

  /**
   * This is needed to display deduction income value.
   */
  function salaryExemption(income: number): number {
    if (income <= 5000) {
      return income
    } else if (income <= 15000) {
      return 5000 + (income - 5000) * 0.5
    } else {
      return 10000
    }
  }

  const handlePageChange = (key: string) => (e) => {
    e.preventDefault()
    setActiveStep(keyToStepMap[key] || 0)
    router.push(`/questions#${key}`)
  }

  /**
   * shouldDisplay
   *    Returns  False  when IncomeAvailable is Yes
   *    Returns  True   for any other scenario
   */
  function shouldDisplay(input: FieldInput): boolean {
    const exceptions: String[] = ['incomeAvailable', 'partnerIncomeAvailable']
    return (
      !exceptions.includes(input.key) ||
      (exceptions.includes(input.key) && input.value === 'false')
    )
  }

  /**
   * Generates the main content. If no answers are found, we display that.
   * Otherwise, the content will be built.
   */
  function getMainContent(): JSX.Element {
    if (inputs.length === 0)
      return <div className="py-4">{tsln.resultsPage.noAnswersFound}</div>
    return (
      <>
        {inputs.map((input, index) => {
          const showBorder = index != inputs.length - 1
          const borderStyle = showBorder
            ? 'py-4 border-b border-info-border'
            : 'py-4'
          return shouldDisplay(input) ? (
            <div key={input.key} className={borderStyle}>
              <div>{tsln.resultsQuestions[input.key]}</div>
              <div className="grid gap-0 grid-cols-3">
                <div className="col-span-2">
                  <strong
                    dangerouslySetInnerHTML={{
                      __html: getDisplayValue(input),
                    }}
                  />
                </div>
                <div className="justify-self-end self-end">
                  <Link href={`questions#${input.key}`}>
                    <a
                      onClick={handlePageChange(input.key)}
                      className="ds-underline ds-text-multi-blue-blue70b ds-font-body ds-text-browserh5 ds-leading-33px hover:ds-text-multi-blue-blue50b"
                      aria-label={tsln.resultsEditAriaLabels[input.key]}
                    >
                      {tsln.resultsPage.edit}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            ''
          )
        })}
      </>
    )
  }

  function getMainContentMobile(): JSX.Element {
    if (inputs.length === 0) {
      return <div className="py-4">{tsln.resultsPage.noAnswersFound}</div>
    }

    // Group inputs by category
    const categorizedInputs: CategorizedInputs = inputs.reduce((acc, input) => {
      const categoryKey = fieldDefinitions[input.key]?.category?.key
      if (categoryKey && shouldDisplay(input)) {
        acc[categoryKey] = acc[categoryKey] || []
        acc[categoryKey].push(input)
      }
      return acc
    }, {})

    return (
      <>
        {Object.entries(categorizedInputs).map(
          ([categoryKey, categoryInputs]) => {
            if (!categoryInputs) return null
            const translatedCategory = tsln.category[categoryKey]
            if (!translatedCategory) return null

            return (
              <Accordion
                key={categoryKey}
                title={
                  <span
                    dangerouslySetInnerHTML={{ __html: translatedCategory }}
                  />
                }
                isOpen={accordionStates[categoryKey]}
                onClick={() => toggleAccordion(categoryKey)}
              >
                {categoryInputs.map((input) => (
                  <div
                    key={input.key}
                    className="py-4 border-t border-info-border"
                  >
                    <div>{tsln.resultsQuestions[input.key]}</div>
                    <div className="grid gap-0 grid-cols-3">
                      <div className="col-span-2">
                        <strong
                          dangerouslySetInnerHTML={{
                            __html: getDisplayValue(input),
                          }}
                        />
                      </div>
                      <div className="justify-self-end self-end">
                        <Link href={`questions#${input.key}`}>
                          <a
                            onClick={handlePageChange(input.key)}
                            className="ds-underline ds-text-multi-blue-blue70b ds-font-body ds-text-browserh5 ds-leading-33px hover:ds-text-multi-blue-blue50b"
                            aria-label={tsln.resultsEditAriaLabels[input.key]}
                          >
                            {tsln.resultsPage.edit}
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Accordion>
            )
          }
        )}
      </>
    )
  }

  /**
   * Accepts an "input object" (a two-item array with the FieldKey and the user's input),
   * and returns the string that should be displayed in the UI.
   */
  function getDisplayValue(input: FieldInput): string {
    let deferral: MonthsYears
    let deferralVal: number

    const fieldData: FieldConfig = allFieldData.find(
      (fieldData) => fieldData.key === input.key
    )

    const fieldType: FieldType = fieldData.type

    if (input.key === 'incomeWork' || input.key === 'partnerIncomeWork') {
      return numberToStringCurrency(
        salaryExemption(Number(input.value)),
        tsln._language,
        {
          rounding: 2,
        }
      )
    }

    switch (fieldType) {
      case FieldType.NUMBER:
        return input.key === 'oasAge'
          ? `${tsln.resultsEditAriaLabels[input.key]} ${input.value}&nbsp;${
              tsln._language === 'en' ? '' : 'ans'
            }`
          : input.value

      case FieldType.STRING:
        return input.value // no processing needed, display as-is

      case FieldType.CURRENCY:
        return numberToStringCurrency(Number(input.value), tsln._language, {
          rounding: 2,
        })

      case FieldType.DATE:
        // this will display the DATE fields as a NUMBER - i.e. the Month/Year will display as AGE!
        return String(Math.floor(Number(input.value)))

      case FieldType.DROPDOWN:
      case FieldType.DROPDOWN_SEARCHABLE:
        if ('values' in fieldData)
          return fieldData.values.find((value) => value.key === input.value)
            .text
        throw new Error(`values not found for field: ${input.key}`)

      case FieldType.RADIO:
        if (fieldData.type === FieldType.RADIO && 'values' in fieldData) {
          return fieldData.values.find((value) => value.key === input.value)
            .shortText
        }
        throw new Error(`values not found for field: ${input.key}`)

      case FieldType.DURATION:
        deferral = JSON.parse(input.value)
        deferralVal = deferral?.years * 12 + deferral?.months
        return deferralVal === 0
          ? `${tsln.no}`
          : deferralVal > 1
          ? `<div>${deferralVal} ${tsln.duration.months.toLowerCase()}<div>`
          : `<div>${deferralVal} ${tsln.resultsPage.month}</div>`
      default:
        throw new Error(`field type not supported in YourAnswers: ${fieldType}`)
    }
  }

  return (
    <div className="fz-10">
      <div className="py-8 sm:p-8 sm:bg-emphasis rounded mt-8 md:mt-0 md:max-w-[360px]">
        <h3 className="h3" id="answers">
          {title}
        </h3>
        <div className="sm:hidden">{getMainContentMobile()}</div>
        <div className="hidden sm:block">{getMainContent()}</div>
      </div>
    </div>
  )
}
