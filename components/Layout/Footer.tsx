/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

interface FooterProps {
  id: string
  locale: string
}

export const Footer = ({ id, locale }: FooterProps) => {
  const tsln = useTranslation<WebTranslations>()
  const landscapeLinks = tsln.landscapeLinks
  const brandLinks = tsln.brandLinks

  return (
    <footer id={id} className="bg-[#26374A]">
      <section>
        <h2 className="sr-only" id="accessibleSectionHeader1">
          {tsln.aboutGovernment}
        </h2>
        <h3 className="container text-white text-[19px] leading-[21px] font-bold pt-[24px] pb-2">
          {tsln.footerTitle}
        </h3>
        <div
          className="bg-no-repeat bg-clip-border sm:bg-right-bottom bg-bottom"
          style={{
            backgroundImage: `url('/footer_bg_img.svg')`,
          }}
        >
          <nav role="navigation" aria-labelledby="accessibleSectionHeader1">
            <ul className="container sm:grid sm:grid-cols-3 flex flex-col pb-[22px]">
              {Object.entries(landscapeLinks).map(([key, value]) => (
                <li
                  key={key}
                  className={`${
                    key === 'contacts'
                      ? 'footerLine pb-[26px] relative mb-3'
                      : ''
                  } list-none w-64 sm:w-56 lg:w-80 my-1`}
                >
                  <Link href={value.link} locale={locale}>
                    <a className="font-[400] text-white text-[14px] leading-[19px]">
                      {value.text}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <section className="bg-[#F8F8F8]">
        <div className="container min-h-[96px] flex justify-between">
          <div className="flex flex-row items-center">
            <nav role="navigation" aria-labelledby="accessibleSectionHeader2">
              <h2 className="sr-only" id="accessibleSectionHeader2">
                {tsln.aboutSite}
              </h2>
              <ul className="flex flex-col md:flex-row whitespace-nowrap py-4">
                {Object.entries(brandLinks).map(([key, value], index) => (
                  <li
                    key={key}
                    className={`${
                      index === 0 ? '' : 'md:custom-bullet'
                    } pr-4 my-1`}
                  >
                    <Link href={value.link}>
                      <a className="font-[400] text-[14px] leading-[19px] text-[#31455C]">
                        {value.text}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="items-end md:items-center min-h-[96px] flex shrink-0 mr-[5px]">
            <img
              className="h-[25px] md:h-[40px] w-[105px] md:w-[164px] my-[15px]"
              src="/wmms-blk.svg"
              alt={tsln.woodmark}
            />
          </div>
        </div>
      </section>
    </footer>
  )
}
