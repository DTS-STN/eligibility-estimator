import { Header, Heading } from '@dts-stn/decd-design-system'
import { useRouter } from 'next/router'
import React from 'react'
import { WebTranslations } from '../../i18n/web'
import { HeadDoc } from '../Document'
import { useTranslation } from '../Hooks'
import { Footer } from './Footer'
import { SCLabsTestHeader } from './ScTestHeader'

export const Layout: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter()
  const oppositeLocale = router.locales.find((l) => l !== router.locale)
  const langToggleLink =
    oppositeLocale === 'fr'
      ? `${oppositeLocale}/${router.asPath}`
      : `${router.asPath}`

  const tsln = useTranslation<WebTranslations>()

  const menuProps = {
    onSignOut: () => {},
    isAuthenticated: true,
    signOutPath: '/',
    dashboardPath: '/',
    securityPath: '/',
    profilePath: '/',
    craPath: '/',
    hasNoMenu: true,
  }

  const topnavProps = {
    skipToMainPath: '#applicationTitle',
    skipToAboutPath: '#footer-info',
    switchToBasicPath: '',
    displayAlternateLink: false,
  }

  const searchProps = {
    onChange: () => {},
    onSubmit: () => {},
  }

  const breadcrumbs = [
    {
      text: tsln.breadcrumb1Title,
      link: tsln.breadcrumb1URL,
    },
    {
      text: tsln.breadcrumb2Title,
      link: tsln.breadcrumb2URL,
    },
  ]

  return (
    <>
      <HeadDoc />
      <SCLabsTestHeader />
      <main className="mainContent">
        <Header
          id="mainHeader"
          lang={router.locale}
          linkPath={langToggleLink}
          isAuthenticated={false}
          menuProps={menuProps}
          topnavProps={topnavProps}
          searchProps={searchProps}
          breadCrumbItems={breadcrumbs}
        />
        <div className="ds-container flex flex-col mb-16 mt-8">
          <Heading
            id="applicationTitle"
            title={tsln.title}
            className="mb-8 mt-4 sm:mt-12 sm:w-8/12"
          />
          {children}
        </div>

        <Footer />
      </main>
    </>
  )
}
