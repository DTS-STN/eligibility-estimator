import React, { useContext } from 'react'
import { Breadcrumbs } from '../Breadcrumbs'
import { Footer } from './Footer'
import { Header } from './Header'
import Head from 'next/head'
import { SCLabsTestHeader } from '../SCLabsTestHeader'
import { useRouter } from 'next/router'
import { useTranslation } from '../Hooks'

export const Layout: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const router = useRouter()
  const oppositeLocale = router.locales.find((l) => l !== router.locale)
  const tsln = useTranslation()

  return (
    <>
      <Head>
        <title>{tsln.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
            <h1 className="h1 mt-8 mb-10 border-b border-header-rule">
              {tsln.title}
            </h1>
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
