import Head from 'next/head'
import React, { useContext } from 'react'
import { Breadcrumbs } from '../Breadcrumbs'
import { LanguageContext } from '../Contexts'
import { useInternationalization } from '../Hooks'
import { SCLabsTestHeader } from '../SCLabsTestHeader'
import { Footer } from './Footer'
import { Header } from './Header'

export const Layout: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const otherLang = useInternationalization('otherLang')
  const otherLangFull = useInternationalization('otherLangFull')

  const { userLanguageChange } = useContext(LanguageContext)

  return (
    <>
      <Head>
        <title>Canadian Old Age Benefits Estimator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Noto+Sans&display=swap"
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
                onClick={(e) => userLanguageChange(otherLang)}
              >
                {otherLangFull}
              </button>
            </div>
          </div>
          <Header />
          <div className="bg-primary -mx-4">
            <div className="flex flex-row justify-between items-center sm:container mx-auto">
              <h3 className="text-h3 py-3 text-white font-bold px-4 md:px-0">
                Service Canada
              </h3>
              <p></p>
            </div>
          </div>
          <div className="sm:container mx-auto flex flex-col mb-16">
            <Breadcrumbs
              items={['Canada.ca', 'Service Canada', 'Eligibility Estimator']}
            />
            <h1 className="h1 mt-8 mb-8 border-b border-header-rule">
              Canadian Old Age Benefits Estimator
            </h1>
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
