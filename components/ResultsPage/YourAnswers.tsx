import { Link as DSLink } from '@dts-stn/decd-design-system'
import { FieldInput } from '../../client-state/InputHelper'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { FieldConfig, FieldType } from '../../utils/api/definitions/fields'
import { useTranslation } from '../Hooks'

export const YourAnswers: React.VFC<{
  title: string
  inputs: FieldInput[]
}> = ({ title, inputs }) => {
  const tsln = useTranslation<WebTranslations>()

  // allFieldData is the full configuration for ALL fields - not only the visible ones.
  const allFieldData: FieldConfig[] = BenefitHandler.getAllFieldData(
    tsln._language
  )

  /**
   * Generates the main content. If no answers are found, we display that.
   * Otherwise, the content will be built.
   */
  function getMainContent(): JSX.Element {
    if (inputs.length === 0)
      return <div className="py-4">{tsln.resultsPage.noAnswersFound}</div>
    return (
      <>
        {inputs.map((input) => {
          return (
            <div key={input.key} className="py-4 border-b-2 border-info-border">
              {tsln.resultsQuestions[input.key]} <br />
              <strong>{getDisplayValue(input)}</strong> &nbsp;
              <DSLink
                id={`edit-${input.key}`}
                href={`/eligibility#${input.key}`}
                text="Edit"
                target="_self"
              />
            </div>
          )
        })}
      </>
    )
  }

  /**
   * Accepts an "input object" (a two-item array with the FieldKey and the user's input),
   * and returns the string that should be displayed in the UI.
   */
  function getDisplayValue(input: FieldInput): string {
    const fieldData: FieldConfig = allFieldData.find(
      (fieldData) => fieldData.key === input.key
    )
    const fieldType: FieldType = fieldData.type
    switch (fieldType) {
      case FieldType.NUMBER:
      case FieldType.STRING:
        return input.value // no processing needed, display as-is
      case FieldType.CURRENCY:
        return numberToStringCurrency(Number(input.value), tsln._language, {
          rounding: 0,
        })
      case FieldType.DROPDOWN:
      case FieldType.DROPDOWN_SEARCHABLE:
      case FieldType.RADIO:
        if ('values' in fieldData)
          return fieldData.values.find((value) => value.key === input.value)
            .text
        throw new Error(`values not found for field: ${input.key}`)
      default:
        throw new Error(`field type not supported in YourAnswers: ${fieldType}`)
    }
  }

  return (
    <div className="fz-10">
      <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 md:max-w-[380px]">
        <h3 className="h3">{title}</h3>
        {getMainContent()}
      </div>
    </div>
  )
}
