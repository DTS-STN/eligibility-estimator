import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { WebTranslations } from '../../i18n/web'
import { Breadcrumbs } from '../Breadcrumbs'
import { useTranslation } from '../Hooks'
import { SCLabsTestHeader } from '../SCLabsTestHeader'
import { Footer } from './Footer'
import { Header } from './Header'

export const Layout: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const router = useRouter()
  const oppositeLocale = router.locales.find((l) => l !== router.locale)
  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <Head>
        <title>{tsln.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@700&family=Noto+Sans&family=Patua+One&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <SCLabsTestHeader />
      <main id="elig">
        <div className="mx-4 min-h-screen">
          <div className="sm:container mx-auto">
            <div className="flex justify-end my-4">
              <button
                className="btn-link btn underline"
                onClick={(e) => {
                  router.push(router.pathname, router.pathname, {
                    locale: oppositeLocale,
                  })
                }}
              >
                {tsln.otherLang}
              </button>
            </div>
          </div>
          <Header />
          <div className="bg-primary -mx-4">
            <div className="flex flex-row justify-between items-center sm:container mx-auto">
              <h3 className="text-h3 py-3 text-white font-bold px-4 md:px-0">
                {tsln.menuTitle}
              </h3>
              <p></p>
            </div>
          </div>
          <div className="sm:container mx-auto flex flex-col mb-16">
            <Breadcrumbs
              items={[
                tsln.breadcrumb1Title,
                tsln.breadcrumb2Title,
                tsln.breadcrumb3Title,
              ]}
            />
            <h1 className="h1 mt-10 mb-8">{tsln.title}</h1>
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
