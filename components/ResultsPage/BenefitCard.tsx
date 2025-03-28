import { Button } from '../Forms/Button'
import React from 'react'
import { NextStepText } from '../../utils/api/definitions/types'
import { Router, useRouter } from 'next/router'
import { useTranslation } from '../Hooks'
import { WebTranslations } from '../../i18n/web'
import { BenefitKey } from '../../utils/api/definitions/enums'

const AA_BUTTON_CLICK_ATTRIBUTE =
  'ESDC-EDSC:Canadian OAS Benefits Est. Result card link click'

export const BenefitCard: React.VFC<{
  benefitKey: string
  benefitName: string
  isEligible: boolean
  future: boolean
  psdCalc: boolean
  liveInCanada: boolean
  eligibleText: string
  collapsedDetails: any
  children: React.ReactNode
  nextStepText: NextStepText
  links: Array<{
    icon: string
    url: string
    text: string
    alt: string
    action: string
  }>
}> = ({
  benefitKey,
  benefitName,
  isEligible,
  future,
  psdCalc,
  liveInCanada,
  eligibleText,
  collapsedDetails,
  children,
  nextStepText,
  links,
}) => {
  // the green/yellow eligible/notEligible
  const eligibleFlag: JSX.Element = (
    <span
      data-cy="eligibility-flag"
      className={` px-2 py-1 ml-2 h-7 flex items-center justify-center border-left border-l-4 font-semibold text-[15px] ${
        benefitKey !== BenefitKey.oas && liveInCanada
          ? 'border-[#6e6e6e] bg-[#EAEBED] '
          : isEligible || (future && !psdCalc)
          ? ' border-success bg-[#D8EECA] '
          : ' border-[#EE7100] bg-[#F9F4D4] '
      }`}
    >
      {eligibleText}
    </span>
  )

  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  return (
    <div
      className="my-6 py-6 px-8 border border-[#6F6F6F] rounded"
      data-cy={benefitKey}
    >
      <div className="flex h-auto w-full justify-between items-center mb-2">
        <h3
          data-cy="benefit-title"
          id={benefitKey}
          className="ss:inline block align-sub h3 mb-0"
        >
          {benefitName}
        </h3>
        {eligibleFlag}
      </div>

      <div data-cy="benefit-detail" className={`py-1`}>
        {children}
      </div>

      {nextStepText.nextStepTitle && (
        <div>
          <p
            data-cy="next-step-content"
            dangerouslySetInnerHTML={{ __html: nextStepText.nextStepContent }}
          />
        </div>
      )}

      <div className="mt-4" data-cy="benefit-links">
        {links &&
          links.map(({ text, url, icon, alt, action }, index) => (
            <div key={index} className="flex items-center  text-content">
              <div className="pl-1 w-full block">
                <span
                  className="ds-font-body ds-text-lg ds-leading-22px ds-font-medium ds-text-multi-neutrals-grey90a ds-mb-4"
                  data-gc-analytics-customclick={`${AA_BUTTON_CLICK_ATTRIBUTE}:${action}`}
                >
                  <Button
                    style={icon == 'info' ? 'secondary' : 'primary'}
                    custom="ds-my-3"
                    type="button"
                    text={text}
                    imgHref={
                      icon == 'info'
                        ? `/openNewTab.svg`
                        : `/openNewTabWhite.svg`
                    }
                    title={tsln.openNewTab}
                    href={url}
                  />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
