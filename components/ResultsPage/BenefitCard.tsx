import { Link as DSLink } from '@dts-stn/service-canada-design-system'
import Image from 'next/image'
import React from 'react'
import { NextStepText } from '../../utils/api/definitions/types'
import { CustomCollapse } from './CustomCollapse'

const AA_BUTTON_CLICK_ATTRIBUTE =
  'ESDC-EDSC:Canadian OAS Benefits Est. Result card link click'

export const BenefitCard: React.VFC<{
  benefitKey: string
  benefitName: string
  isEligible: boolean
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
  eligibleText,
  collapsedDetails,
  children,
  nextStepText,
  links,
}) => {
  // the green/yellow eligible/notEligible
  const eligibleFlag: JSX.Element = (
    <span
      className={`px-2 py-1 ml-2 border-left border-l-4 font-semibold text-[15px] ${
        isEligible
          ? ' border-success bg-[#D8EECA] '
          : ' border-[#EE7100] bg-[#F9F4D4] '
      }`}
    >
      {eligibleText}
    </span>
  )

  return (
    <div className="my-6 py-6 px-8 border border-[#6F6F6F] rounded">
      <div className="inline">
        <h2 id={benefitKey} className="inline align-sub h2">
          {benefitName}
        </h2>
        {eligibleFlag}
      </div>

      <div className={`py-1`}>{children}</div>

      {collapsedDetails &&
        collapsedDetails.map((detail, index) => (
          <CustomCollapse
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

      {nextStepText && (
        <div>
          <p className="mb-2 mt-6  font-bold text-[24px]">
            {nextStepText.nextStepTitle}
          </p>
          <p
            dangerouslySetInnerHTML={{ __html: nextStepText.nextStepContent }}
          />
        </div>
      )}

      <div className="mt-4">
        {links &&
          links.map(({ text, url, icon, alt, action }, index) => (
            <div key={index} className="flex items-center py-4 text-content">
              <div>
                <Image src={`/${icon}.png`} alt={alt} width="30" height="44" />
              </div>
              <div className="pl-5 w-full">
                <span
                  data-gc-analytics-customclick={`${AA_BUTTON_CLICK_ATTRIBUTE}:${action}`}
                >
                  <DSLink
                    id={`${benefitKey}Link${index}`}
                    href={url}
                    text={text}
                    target="_blank"
                  />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
