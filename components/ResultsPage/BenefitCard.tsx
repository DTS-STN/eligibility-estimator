import { Button } from '../Forms/Button'
import Image from 'next/image'
import React from 'react'
import { NextStepText } from '../../utils/api/definitions/types'
import { CustomCollapse } from './CustomCollapse'
import { Router, useRouter } from 'next/router'

const AA_BUTTON_CLICK_ATTRIBUTE =
  'ESDC-EDSC:Canadian OAS Benefits Est. Result card link click'

export const BenefitCard: React.VFC<{
  benefitKey: string
  benefitName: string
  isEligible: boolean
  future: boolean
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
      className={`px-2 py-1 ml-2 border-left border-l-4 font-semibold text-[15px] ${
        isEligible || future
          ? ' border-success bg-[#D8EECA] '
          : ' border-[#EE7100] bg-[#F9F4D4] '
      }`}
    >
      {eligibleText}
    </span>
  )

  const router = useRouter()

  return (
    <div
      className="my-6 py-6 px-8 border border-[#6F6F6F] rounded"
      data-cy={benefitKey}
    >
      {/* 
      
      TO-DO:
      - flex-wrap


      */}
      <div className="flex h-auto w-full justify-between items-center mb-2">
        <h2
          data-cy="benefit-title"
          id={benefitKey}
          className="ss:inline block align-sub h2 mb-0"
        >
          {benefitName}
        </h2>
        {eligibleFlag}
      </div>

      <div data-cy="benefit-detail" className={`py-1`}>
        {children}
      </div>
      {collapsedDetails &&
        collapsedDetails.map((detail, index) => (
          <CustomCollapse
            datacy={`collapse-${benefitKey}-${index}`}
            key={`collapse-${benefitName}-${index}`}
            id={`collapse-${benefitName}-${index}`}
            title={detail.heading}
          >
            <p
              className="leading-[26px]"
              dangerouslySetInnerHTML={{ __html: detail.text }}
            />
          </CustomCollapse>
        ))}

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
                  {/* GET WHITE PNG */}
                  <Button
                    style={icon == 'info' ? 'secondary' : 'primary'}
                    custom="ds-my-3"
                    type="button"
                    text={text}
                    imgHref={`/openNewTab.svg`}
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
