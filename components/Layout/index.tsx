import { Header, Heading } from '@dts-stn/service-canada-design-system'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { Footer } from './Footer'
import { Head } from './Head'
import { SCLabsTestHeader } from './ScTestHeader'

export const Layout: React.VFC<{
  children: React.ReactNode
  title: string
  adobeAnalyticsUrl: string
}> = ({ children, title, adobeAnalyticsUrl }) => {
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

  useEffect(() => {
    if (adobeAnalyticsUrl) {
      window.adobeDataLayer = window.adobeDataLayer || []
      window.adobeDataLayer.push({ event: 'pageLoad' })
    }
  }, [])

  return (
    <>
      <Head title={title} adobeAnalyticsUrl="test....."></Head>
      <SCLabsTestHeader />

      <main className="mainContent">
        <div className="xs:container s:container md:container lg:container mx-0 flex flex-col mb-16 mt-8">
          <Header
            id="mainHeader"
            lang={router.locale}
            linkPath={langToggleLink}
            isAuthenticated={false}
            menuProps={menuProps}
            topnavProps={topnavProps}
            searchProps={searchProps}
            breadCrumbItems={breadcrumbs}
            useParentContainer={true}
          />
          <Heading
            id="applicationTitle"
            title={title}
            className="mb-8 mt-4 sm:mt-12 sm:w-[100%]"
          />
          {children}
        </div>

        <Footer />
      </main>
    </>
  )
}
