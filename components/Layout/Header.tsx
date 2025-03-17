import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'
import { useRouter } from 'next/router'

interface HeaderProps {
  id: string
  locale: string
  langUrl: string
  topNavProps: {
    skipToMain: string
    skipToMainPath: string
    skipToFormPath: string
    skipToAbout: string
    skipToAboutPath: string
    switchToBasic: string
    switchToBasicPath: string
    displayAlternateLink: boolean
  }
  headerText: {
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
  topNavProps,
  headerText,
  breadcrumbItems = [],
}: HeaderProps) {
  const language = locale === 'en' ? 'fr' : 'en'
  const languageText = language === 'en' ? 'English' : 'Français'
  const shortLanguageText = language === 'en' ? 'EN' : 'FR'
  const router = useRouter()

  const handleAutoScroll =
    (target: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      let targetId
      if (target === 'main') {
        targetId =
          router.pathname === '/'
            ? topNavProps.skipToMainPath
            : router.pathname === '/results' || router.pathname === '/resultats'
            ? topNavProps.skipToMainPath
            : topNavProps.skipToFormPath
      } else {
        targetId = target
      }

      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }

      targetElement.setAttribute('tabindex', '-1')
      targetElement.focus({ preventScroll: true })
    }

  return (
    <>
      <nav id={id} role="navigation" aria-label="topNavigation">
        <ul id="TopNavLinks" className="skip-main">
          <li className="absolute inset-0 text-center opacity-0 pointer-events-none focus-within:opacity-100 focus-within:pointer-events-auto">
            <a
              id="skipToMain"
              className="font-[700] text-[24px] p-1 text-white visited:text-white focus:bg-[#26374A]"
              href="#"
              onClick={handleAutoScroll('main')}
              data-cy-button="skip-Content"
              draggable="false"
            >
              {topNavProps.skipToMain}
            </a>
          </li>
          <li className="absolute inset-0 text-center opacity-0 pointer-events-none focus-within:opacity-100 focus-within:pointer-events-auto">
            <a
              id="skipToAboutGov"
              className="font-[700] text-[24px] p-1 text-white visited:text-white focus:bg-[#26374A]"
              href="#"
              onClick={handleAutoScroll('footer')}
              data-cy-button="skip-About"
              draggable="false"
            >
              {topNavProps.skipToAbout}
            </a>
          </li>
          <li className="absolute inset-0 text-center opacity-0 pointer-events-none focus-within:opacity-100 focus-within:pointer-events-auto">
            {topNavProps.displayAlternateLink ? (
              <a
                id=""
                className="font-[700] text-[24px] p-1 text-white visited:text-white focus:bg-[#26374A]"
                href={topNavProps.switchToBasicPath}
                rel="alternate"
              >
                {topNavProps.switchToBasic}
              </a>
            ) : (
              ''
            )}
          </li>
        </ul>
      </nav>
      <header>
        <h2 className="sr-only">{headerText.globalHeader}</h2>
        <h3 className="sr-only">{headerText.testSiteNotice}</h3>
        <div className="flex-col flex lg:flex lg:flex-row justify-between mb-4">
          <div
            className="w-full flex flex-row justify-between items-start"
            aria-labelledby="officialSiteNav"
          >
            <h3 className="sr-only" id="officialSiteNav">
              {headerText.officialSiteNavigation}
            </h3>
            <a
              href={`https://www.canada.ca/${language === 'en' ? 'fr' : 'en'}`}
            >
              <Image
                src={language === 'en' ? '/sig-blk-fr.svg' : '/sig-blk-en.svg'}
                alt={headerText.logoAltText}
                width="375"
                height="35"
              />
              <span className="hidden">
                {' '}
                /{' '}
                <span lang={`${language === 'en' ? 'en' : 'fr'}`}>
                  {`${
                    language === 'en'
                      ? 'Government of Canada'
                      : 'Gouvernement du Canada'
                  }`}
                </span>
              </span>
            </a>
            <h3 className="sr-only">{headerText.languageSelection}</h3>
            <Link href={langUrl} locale={language}>
              <a
                lang={language}
                className="ml-6 sm:ml-16 -mt-1 underline font-lato text-[16px] leading-[23px] text-[#295376] hover:text-[#0535D2]"
              >
                <span className="md:hidden font-bold">{shortLanguageText}</span>
                <span className="hidden md:inline font-[400]" data-cy="lang1">
                  {languageText}
                </span>
              </a>
            </Link>
          </div>
        </div>
        <hr className="absolute left-0 border-b-3 border-[#38414D] w-screen w-full" />
        <Breadcrumb items={breadcrumbItems} locale={locale} />
      </header>
    </>
  )
}
