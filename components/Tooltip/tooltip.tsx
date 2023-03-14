import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { getTooltipTranslations, TooltipTranslation } from '../../i18n/tooltips'
import { Language } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Tooltip: React.FC<{
  field: string
}> = ({ field }) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const tooltipData = getTooltipTranslationByField(
    router.locale == 'en' ? Language.EN : Language.FR,
    field
  )

  if (!tooltipData) return <></>

  return (
    <details className="my-2 text-h6 " data-testid={`tooltip-${field}`}>
      <summary
        key={`summary-${field}`}
        className="border-none pl-0 ds-text-multi-blue-blue70b mb-[15px] ds-cursor-pointer ds-select-none"
      >
        <span
          className="ds-underline"
          dangerouslySetInnerHTML={{ __html: tsln.tooltip.moreInformation }}
        />
      </summary>
      <div
        className="ds-rounded ds-z-1 ds-font-body text-base leading-7 ds-text-multi-neutrals-grey100  ds-bg-specific-cyan-cyan5 ds-border ds-border-specific-cyan-cyan50 px-6 pt-4"
        data-testid="tooltip-text"
        id={`helpText-${field}`}
        dangerouslySetInnerHTML={{ __html: tooltipData.text }}
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
