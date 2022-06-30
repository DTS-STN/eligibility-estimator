import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { getTooltipTranslations, TooltipTranslation } from '../../i18n/tooltips'
import { Language } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Tooltip: React.FC<{
  field: string
  size?: number
}> = ({ field, size }) => {
  const router = useRouter()
  const [show, setShow] = useState<boolean>(false)
  const wrapperRef = useRef(null)
  const tsln = useTranslation<WebTranslations>()

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

  const handleClick = () => {
    setShow(!show)
  }

  if (!tooltipData) return <></>

  return (
    <div
      className="relative inline-block mb-2 cursor-pointer "
      ref={wrapperRef}
      data-testid="tooltip"
    >
      <div className="flex items-center gap-x-[10px]" onClick={handleClick}>
        <div className={`triangle ${show && 'origin-center rotate-90'} `} />
        <a className="underline text-default-text text-[16px]">
          {tsln.tooltip.moreInformation}
        </a>
      </div>
      <div className={`${!show && 'hidden'} mx-[5px] py-1`} tabIndex={-1}>
        <div
          className={`w-full xs:w-auto s:max-w-md sm:max-w-[80%] border-l-[2px]`}
        >
          <p
            className="font-normal text-[16px] leading-5 px-5 overflow-y-auto max-h-[75vh] md:max-h-[100%] md:overflow-y-hidden"
            dangerouslySetInnerHTML={{ __html: tooltipData.text }}
          />
        </div>
      </div>
    </div>
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
