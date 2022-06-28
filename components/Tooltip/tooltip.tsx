import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { getTooltipTranslations, TooltipTranslation } from '../../i18n/tooltips'
import { Language } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import { useMediaQuery } from '../Hooks'
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

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShow(false)
    }
  }

  const handleEscPress = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }

  useEffect(() => {
    // stop the main content from scrolling when the tooltip is open
    const body = document.getElementsByTagName('body')[0]
    if (isMobile) body.style.overflowY = show ? 'hidden' : 'auto'

    // handles closing tooltip via Esc or ClickOutside
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keyup', handleEscPress)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keyup', handleEscPress)
    }
  })

  const isMobile = useMediaQuery(992)

  const tooltipData = getTooltipTranslationByField(
    router.locale == 'en' ? Language.EN : Language.FR,
    field
  )
  if (!tooltipData) return <></>

  return (
    <div
      className="relative inline-block mb-2 cursor-pointer"
      ref={wrapperRef}
      data-testid="tooltip"
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        className="cursor-pointer z-20"
        onClick={(e) => setShow(true)}
      >
        <path
          d="M12.5 0C5.597 0 0 5.599 0 12.5 0 19.405 5.597 25 12.5 25S25 19.405 25 12.5C25 5.599 19.403 0 12.5 0Zm0 5.544a2.117 2.117 0 1 1 0 4.234 2.117 2.117 0 0 1 0-4.234Zm2.823 12.803c0 .334-.271.605-.605.605h-4.436a.605.605 0 0 1-.605-.605v-1.21c0-.334.271-.605.605-.605h.605v-3.226h-.605a.605.605 0 0 1-.605-.604v-1.21c0-.334.271-.605.605-.605h3.226c.334 0 .605.27.605.605v5.04h.605c.334 0 .605.271.605.605v1.21Z"
          className="text-primary fill-info"
        />
      </svg> */}
      <a
        className="underline text-default-text text-[16px]"
        onClick={(e) => setShow(true)}
      >
        {tsln.tooltip.moreInformation}
      </a>
      <div
        className={`${
          show
            ? isMobile
              ? 'fixed inset-0 flex items-center justify-center'
              : ''
            : 'hidden'
        } z-50 m-2.5`}
        tabIndex={-1}
      >
        <div
          className={`w-full md:w-auto max-w-[440px] shadow-xl rounded-xl border border-[#C7CFEF] bg-white ${
            isMobile ? '' : 'relative -top-4'
          } z-40`}
        >
          <header className="flex items-center justify-between gap-x-4 bg-primary text-white rounded-t-xl px-5 py-3">
            <div className="flex gap-x-4 items-center">
              <svg
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                width={`${size ? size : 25}`}
                height={`${size ? size : 25}`}
                className="inline-block"
              >
                <path
                  d="M12.5 0C5.597 0 0 5.599 0 12.5 0 19.405 5.597 25 12.5 25S25 19.405 25 12.5C25 5.599 19.403 0 12.5 0Zm0 5.544a2.117 2.117 0 1 1 0 4.234 2.117 2.117 0 0 1 0-4.234Zm2.823 12.803c0 .334-.271.605-.605.605h-4.436a.605.605 0 0 1-.605-.605v-1.21c0-.334.271-.605.605-.605h.605v-3.226h-.605a.605.605 0 0 1-.605-.604v-1.21c0-.334.271-.605.605-.605h3.226c.334 0 .605.27.605.605v5.04h.605c.334 0 .605.271.605.605v1.21Z"
                  className="text-white fill-current"
                />
              </svg>
              <h4>{tooltipData.heading}</h4>
            </div>
            <div className="cursor-pointer" onClick={(e) => setShow(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </header>

          <p
            className="font-normal p-5 overflow-y-auto max-h-[75vh] md:max-h-[100%] md:overflow-y-hidden"
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
