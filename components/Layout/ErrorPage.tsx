/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Link from 'next/link'
import { useTranslation } from '../Hooks'
import { WebTranslations } from '../../i18n/web'

interface ErrorPageProps {
  errType: '404' | '500' | '503'
  isAuth: boolean
  homePageLink?: string
  accountPageLink?: string
  lang: string
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  isAuth,
  errType,
  homePageLink = '/',
  accountPageLink = '/',
  lang,
}) => {
  const tsln = useTranslation<WebTranslations>()

  // Use translation function to get the correct strings
  const errorHeading = tsln[`errorPageHeadingTitle${errType}`]
  const errorText = tsln[`errorPageErrorText${errType}`]
  const errorNextText = tsln.errorPageNextText
  const errorPageType = tsln.errorPageType
  const errorLinkCommon = isAuth
    ? tsln.errorAuthTextLinkCommon
    : tsln.errorTextLinkCommon
  const errorLinkCommon_2 = isAuth
    ? tsln.errorAuthTextLinkCommon_2
    : tsln.errorTextLinkCommon_2

  const errorLink =
    errType === '500'
      ? tsln.error500TextLink
      : errType === '503'
      ? tsln.error503TextLink
      : null

  const textStyle =
    'font-regular font-sans text-[20px] leading-relaxed text-[#333333]'

  return (
    <div className="container">
      <h1 id={`pageHead${errType}`} className="h1 mt-4">
        {errorHeading}
      </h1>
      <p className={textStyle}>{errorText}</p>
      <p className="font-bold text-[#333333] mt-8">{errorNextText}</p>
      <h2 className="sr-only">What's Next Links</h2>
      <ul id={`errorTypes${errType}`}>
        {errorLink && <li className={`${textStyle} pl-3`}>{errorLink}</li>}
        <li className="body pl-3">
          {errorLinkCommon}
          <Link href={isAuth ? accountPageLink : homePageLink} locale={lang}>
            <a className="underline text-[#284162] font-sans text-[20px] leading-[22px] hover:text-[#0535D2]">
              {errorLinkCommon_2}
            </a>
          </Link>
        </li>
      </ul>
      <p className="font-[700] text-[14px] leading-relaxed mt-16">
        {errorPageType} {errType}
      </p>
    </div>
  )
}
