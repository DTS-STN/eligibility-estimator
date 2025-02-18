import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { WebTranslations } from '../../i18n/web'
import { ContextualAlert as Message } from '../Forms/ContextualAlert'
import { useTranslation } from '../Hooks'
import { CTA } from '../ResultsPage/CTA'
import { Date } from './Date'
import { Footer } from './Footer'
import { Head } from './Head'
import { Header } from './Header'

export const Layout: React.VFC<{
  children: React.ReactNode
  title: string
}> = ({ children, title }) => {
  const router = useRouter()
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const [prodEnv, setProdEnv] = useState(null)
  const isProduction = process.env.APP_ENV === 'production'

  useEffect(() => {
    if (isProduction) {
      setProdEnv(hostname.includes('.alpha.service') ? 'alpha' : 'beta')
    }
  }, [])

  // basically returns 'results' or 'resultats' IF, otherwise index or questions in the other locale.
  const langToggleLink =
    router.asPath === '/results' && router.locale === 'en'
      ? '/fr/resultats'
      : router.asPath === '/resultats' && router.locale === 'fr'
      ? '/en/results'
      : router.locale === 'en'
      ? `/fr${router.asPath}`
      : `/en${router.asPath}`

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
    skipToMain: tsln.skipToMain,
    skipToMainPath: 'applicationTitle',
    skipToFormPath: 'stepperForm',
    skipToAbout: tsln.skipToAbout,
    skipToAboutPath: 'footer',
    switchToBasic: tsln.switchToBasic,
    switchToBasicPath: '',
    displayAlternateLink: false,
  }

  const searchProps = {
    onChange: () => {},
    onSubmit: () => {},
  }

  const alphaBreadcrumbs = [
    {
      text: tsln.breadcrumb1aTitle,
      link: tsln.breadcrumb1aURL,
    },
    {
      text: tsln.breadcrumb2aTitle,
      link: tsln.breadcrumb2aURL,
    },
  ]

  const betaBreadcrumbs = [
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

  if (
    router.pathname === '/questions' ||
    router.pathname === '/results' ||
    router.pathname === '/resultats'
  ) {
    if (!prodEnv || prodEnv === 'alpha') {
      alphaBreadcrumbs.push({
        text: tsln.breadcrumb6Title,
        link: tsln.breadcrumb6URL,
      })
    } else {
      betaBreadcrumbs.push({
        text: tsln.breadcrumb6Title,
        link: tsln.breadcrumb6URL,
      })
    }
  }

  const handleOnClick = () => {
    const link = tsln.retirementUrl
    router.push(link)
  }

  const dateModified = process.env.NEXT_BUILD_DATE
    ? process.env.NEXT_BUILD_DATE.replaceAll('-', '')
    : '20230101'

  return (
    <>
      <Head title={title} />
      {/* <TestBanner /> */}
      <main className="mainContent">
        <div
          id="topOfPageFocus"
          tabIndex={-1}
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}
        >
          {/* Hidden focusable element */}
        </div>
        <div className="xs:container s:container md:container lg:container mx-0 flex flex-col mb-16 mt-8">
          <Header
            id="header"
            locale={router.locale}
            langUrl={langToggleLink}
            breadcrumbItems={
              !prodEnv || prodEnv === 'alpha'
                ? alphaBreadcrumbs
                : betaBreadcrumbs
            }
            topNavProps={topnavProps}
            headerText={{
              globalHeader: tsln.globalHeader,
              testSiteNotice: tsln.testSiteNotice,
              officialSiteNavigation: tsln.officialSiteNavigation,
              languageSelection: tsln.languageSelection,
              logoAltText: tsln.logoAltText,
            }}
          />
          {!router.pathname.includes('/questions') && (
            <>
              <h1 id="applicationTitle" className="h1 mt-8 mb-2">
                {title}
              </h1>
              <div>
                <div className="my-6">
                  <Message
                    id={'wip'}
                    iconId={'testkey'}
                    iconAltText={tsln.infoText}
                    type={'info'}
                    heading={tsln.workInProgress}
                    body={tsln.workInProgressBody}
                    asHtml
                  />
                </div>
              </div>
            </>
          )}

          {children}
        </div>

        {(router.pathname === '/results' ||
          router.pathname === '/resultats') && (
          <div id="cta-feedback" className="mb-8">
            <CTA
              heading={tsln.resultsPage.CTATitle}
              body={tsln.resultsPage.CTABody}
              containerClass="xs:container"
              buttonText={tsln.resultsPage.CTAButton}
              onClick={handleOnClick}
            />
          </div>
        )}

        <div className="xs:container s:container md:container lg:container my-8">
          <Date date={dateModified} label={tsln.dateModified} />
        </div>

        <Footer id="footer" locale={router.locale} />
      </main>
    </>
  )
}
