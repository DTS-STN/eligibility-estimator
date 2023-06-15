import {
  Header,
  Heading,
  ContextualAlert as Message,
} from '@dts-stn/service-canada-design-system'
import { useRouter } from 'next/router'
import React from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { Footer } from './Footer'
import { Head } from './Head'
import { TestBanner } from './TestBanner'
import { CTA } from '../ResultsPage/CTA'

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
    {
      text: tsln.breadcrumb3Title,
      link: tsln.breadcrumb3URL,
    },
    {
      text: tsln.breadcrumb4Title,
      link: tsln.breadcrumb4URL,
    },
    {
      text: tsln.breadcrumb5Title,
      link: tsln.breadcrumb5URL,
    },
  ]

  const handleOnClick = () => {
    const link = `https://retraite-retirement.service.canada.ca/${router.locale}/home`
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
            isAuthenticated={true}
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
          <div className="mb-6">
            <Message
              id={'wip'}
              alert_icon_id={'testkey'}
              alert_icon_alt_text={tsln.warningText}
              type={'info'}
              message_heading={tsln.workInProgress}
              message_body={tsln.workInProgressBody}
              whiteBG={true}
              asHtml={true}
            />
          </div>
          {children}
        </div>

        {router.pathname === '/results' && (
          <div id="cta-feedback" className="mb-8">
            <CTA
              heading={tsln.resultsPage.CTATitle}
              body={tsln.resultsPage.CTABody}
              containerClass="xs:container"
              ButtonProps={{
                text: tsln.resultsPage.CTAButton,
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
