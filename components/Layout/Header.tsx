import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

interface HeaderProps {
  id: string
  locale: string
  langUrl: string
  headerText: {
    skipToMainContent: string
    globalHeader: string
    testSiteNotice: string
    officialSiteNavigation: string
    languageSelection: string
    logoAltText: string
  }
  breadcrumbItems?: BreadcrumbItem[]
}

export function Header({
  id,
  locale,
  langUrl,
  headerText,
  breadcrumbItems = [],
}: HeaderProps) {
  const language = locale === 'en' ? 'fr' : 'en'
  const languageText = language === 'en' ? 'English' : 'Français'
  const shortLanguageText = language === 'en' ? 'EN' : 'FR'

  return (
    <>
      <nav id={id} className="skip-main">
        <a
          id="skipToMainContent"
          className="bg-white text-custom-blue-dark text-lg underline py-1 px-2 focus:outline-dark-goldenrod hover:bg-gray-dark"
          href="#pageMainTitle"
          data-cy-button="skip-Content"
          draggable="false"
        >
          {headerText.skipToMainContent}
        </a>
      </nav>
      <header>
        <h2 className="sr-only">{headerText.globalHeader}</h2>
        <h3 className="sr-only">{headerText.testSiteNotice}</h3>
        <div className="flex-col flex lg:flex lg:flex-row justify-between mb-4">
          <div
            className="w-full flex flex-row justify-between items-start"
            role="navigation"
            aria-labelledby="officialSiteNav"
          >
            <h3 className="sr-only" id="officialSiteNav">
              {headerText.officialSiteNavigation}
            </h3>
            <a href="https://www.canada.ca">
              <Image
                src={language === 'en' ? '/sig-blk-fr.svg' : '/sig-blk-en.svg'}
                alt={headerText.logoAltText}
                width="375"
                height="35"
              />
            </a>
            <h3 className="sr-only">{headerText.languageSelection}</h3>
            <Link href={langUrl} locale={language}>
              <a className="ml-6 sm:ml-16 -mt-1 underline font-lato text-[16px] leading-[23px] text-[#295376] hover:text-[#0535D2]">
                <span className="md:hidden font-bold">{shortLanguageText}</span>
                <span className="hidden md:inline font-[400]">
                  {languageText}
                </span>
              </a>
            </Link>
          </div>
        </div>
        <hr className="absolute left-0 border-b-[3px] border-[#38414D] w-screen w-full" />
        <Breadcrumb items={breadcrumbItems} locale={locale} />
      </header>
    </>
  )
}
