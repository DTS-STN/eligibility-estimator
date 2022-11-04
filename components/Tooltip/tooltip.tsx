import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { getTooltipTranslations, TooltipTranslation } from '../../i18n/tooltips'
import { Language } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import Image from 'next/image'

export const Tooltip: React.FC<{
  field: string
  size?: number
}> = ({ field, size }) => {
  const router = useRouter()
  const [show, setShow] = useState<boolean>(false)
  const wrapperRef = useRef(null)

  const handleEscPress = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }

  useEffect(() => {
    // handles closing tooltip via Esc
    document.addEventListener('keyup', handleEscPress)
    return () => {
      document.removeEventListener('keyup', handleEscPress)
    }
  }, [])

  const tooltipData = getTooltipTranslationByField(
    router.locale == 'en' ? Language.EN : Language.FR,
    field
  )

  if (!tooltipData) return <></>

  return (
    <>
      <div
        className="relative inline-block cursor-pointer !h-[30px]"
        ref={wrapperRef}
        data-testid="tooltip"
      >
        {tooltipData.text && (
          <Image
            tabIndex={-1}
            src={'/info.svg'}
            width="30"
            height="30"
            alt="Click on to show info"
            onClick={(e) => {
              e.preventDefault()
              setShow(!show)
            }}
          />
        )}
      </div>
      <div className={`${!show && 'hidden'}`} tabIndex={-1}>
        <div
          id={'helpText'}
          data-testid="tooltip-text"
          className="ds-rounded ds-z-1 ds-font-body text-small leading-5 ds-text-multi-neutrals-grey100  ds-bg-specific-cyan-cyan5 ds-border ds-border-specific-cyan-cyan50 ds-p-5px ds-pl-14px pb-4"
          dangerouslySetInnerHTML={{ __html: tooltipData.text }}
        />
      </div>
    </>
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
