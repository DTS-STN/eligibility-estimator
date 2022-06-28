import { Link as DSLink } from '@dts-stn/decd-design-system'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import {
  FieldData,
  FieldKey,
  FieldType,
} from '../../utils/api/definitions/fields'
import { useTranslation } from '../Hooks'

export const YourAnswers: React.VFC<{
  title: string
  inputs: Array<[FieldKey, string]>
}> = ({ title, inputs }) => {
  const tsln = useTranslation<WebTranslations>()

  // allFieldData is the full configuration for ALL fields - not only the visible ones.
  const allFieldData: FieldData[] = BenefitHandler.getAllFieldData(
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
          const fieldKey: FieldKey = input[0]
          return (
            <div key={fieldKey} className="py-4 border-b-2 border-info-border">
              {tsln.resultsQuestions[fieldKey]} <br />
              <strong>{getDisplayValue(input)}</strong> &nbsp;
              <DSLink
                id={`edit-${fieldKey}`}
                href={`/eligibility#${fieldKey}`}
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
  function getDisplayValue(input: [FieldKey, string]): string {
    const fieldKey: FieldKey = input[0]
    const fieldValue: string = input[1]
    const fieldData: FieldData = allFieldData.find(
      (fieldData) => fieldData.key === fieldKey
    )
    const fieldType: FieldType = fieldData.type
    switch (fieldType) {
      case FieldType.NUMBER:
      case FieldType.STRING:
        return fieldValue // no processing needed, display as-is
      case FieldType.CURRENCY:
        return numberToStringCurrency(Number(fieldValue), tsln._locale, {
          rounding: 0,
        })
      case FieldType.DROPDOWN:
      case FieldType.DROPDOWN_SEARCHABLE:
      case FieldType.RADIO:
      case FieldType.BOOLEAN:
        if ('values' in fieldData)
          return fieldData.values.find((value) => value.key === fieldValue).text
        throw new Error(`values not found for field: ${fieldKey}`)
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
