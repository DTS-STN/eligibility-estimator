import { Link as DSLink } from '@dts-stn/service-canada-design-system'
import Image from 'next/image'
import React from 'react'
import { CustomCollapse } from './CustomCollapse'

export const BenefitCard: React.VFC<{
  benefitName: string
  isEligible: boolean
  eligibleText: string
  collapsedDetails: any
  children: React.ReactNode
  links: Array<{ icon: string; url: string; text: string; alt: string }>
}> = ({
  benefitName,
  isEligible,
  eligibleText,
  collapsedDetails,
  children,
  links,
}) => {
  // the green/yellow eligible/notEligible
  const eligibleFlag: JSX.Element = (
    <span
      className={`p-1 ml-2 border-left border-l-4 font-semibold text-small ${
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
      <h3 className="h4">
        {benefitName} {eligibleFlag}
      </h3>

      <div className={`${isEligible ? '' : 'bg-[#F9F4D4] px-8'} py-1`}>
        {children}
      </div>

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

      <div className="mt-4">
        {links &&
          links.map(({ text, url, icon, alt }, index) => (
            <div
              key={index}
              className="flex items-center py-4 text-content md:w-1/2"
            >
              <div>
                <Image src={`/${icon}.png`} alt={alt} width="30" height="44" />
              </div>
              <div className="pl-5 w-full">
                <DSLink id={`link${index}`} href={url} text={text} />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
