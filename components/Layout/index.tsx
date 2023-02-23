import { Header, Heading, CTA } from '@dts-stn/service-canada-design-system'
import { useRouter } from 'next/router'
import React from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { Footer } from './Footer'
import { Head } from './Head'
import { TestBanner } from './TestBanner'

export const Layout: React.VFC<{
  children: React.ReactNode
  title: string
}> = ({ children, title }) => {
  const router = useRouter()
  const oppositeLocale = router.locales.find((l) => l !== router.locale)
  const langToggleLink =
    oppositeLocale === 'fr'
      ? `${oppositeLocale}${router.asPath}`
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

  const handleOnClick = () => {
    const langStr = router.locale === 'en' ? 'eng' : 'fra'
    const link = `https://srv217.services.gc.ca/ihst4/Intro.aspx?cid=74938e05-8e91-42a9-8e9d-29daf79f6fe0&lc=${langStr}`
    router.push(link)
  }

  return (
    <>
      <Head title={title} />
      {/* <TestBanner /> */}
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

        {router.pathname === '/results' && (
          <div id="cta-feedback" className="mb-8">
            <CTA
              heading={tsln.resultsPage.CTAFeedbackTitle}
              body={tsln.resultsPage.CTAFeedbackBody}
              ButtonProps={{
                text: tsln.resultsPage.CTAFeedbackButton,
                onClick: handleOnClick,
              }}
            />
          </div>
        )}
        <Footer />
      </main>
    </>
  )
}
