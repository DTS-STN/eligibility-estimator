import { useRouter } from 'next/router'
import React from 'react'
import { getTooltipTranslations, TooltipTranslation } from '../../i18n/tooltips'
import { Language } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'

export const Tooltip: React.FC<{
  field: string
  dynamicContent?: TooltipTranslation
}> = ({ field, dynamicContent }) => {
  const router = useRouter()
  const tooltipData = getTooltipTranslationByField(
    router.locale == 'en' ? Language.EN : Language.FR,
    field
  )
  const content = dynamicContent || tooltipData

  const AA_BUTTON_CLICK_ATTRIBUTE =
    'ESDC-EDSC:Canadian OAS Benefits Est. More information Click'

  if (!tooltipData) return <></>
  return (
    <details className="my-2 text-h5-gc" data-testid={`tooltip-${field}`}>
      <summary
        key={`summary-${field}`}
        className="border-none pl-0 text-multi-blue-blue70b mb-[15px] cursor-pointer select-none"
      >
        <span
          className="underline ml-1"
          dangerouslySetInnerHTML={{ __html: content.moreinfo }}
          data-gc-analytics-customclick={`${AA_BUTTON_CLICK_ATTRIBUTE}: ${content.moreinfo}`}
        />
      </summary>

      <div
        className="ml-[5px] pl-4 border-l-[2px] font-body text-base text-multi-neutrals-grey100 border-multi-blue-blue70b"
        data-testid="tooltip-text"
        id={`helpText-${field}`}
        dangerouslySetInnerHTML={{ __html: content.text }}
      />
    </details>
  )
}

/**
 * Given the language and field, returns a single Tooltip configuration.
 * If useDataFromKey is set, it will override text and heading.
 */
export function getTooltipTranslationByField(
  language: Language,
  field: string | FieldKey
): TooltipTranslation {
  const data: TooltipTranslation = getTooltipTranslations(language)[field]
  if (!data) return undefined
  if (data.useDataFromKey) {
    const relatedData = getTooltipTranslations(language)[data.useDataFromKey]
    data.text = relatedData.text
    data.heading = relatedData.heading
  }
  return data
}
