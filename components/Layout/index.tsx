import React, { useContext } from 'react'
import { Breadcrumbs } from '../Breadcrumbs'
import { LanguageContext } from '../Contexts'
import { useInternationalization } from '../Hooks'
import { Footer } from './Footer'
import { Header } from './Header'
import Head from 'next/head'

export const Layout: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const otherLang = useInternationalization('otherLang')
  const otherLangFull = useInternationalization('otherLangFull')

  const { userLanguageChange } = useContext(LanguageContext)

  return (
    <>
      <Head>
        <title>Benefits Eligibility Estimator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
              <h3 className="text-h3 py-3 text-white font-bold">
                Service Canada
              </h3>
              <p></p>
            </div>
          </div>
          <div className="sm:container mx-auto flex flex-col mb-16">
            <Breadcrumbs
              items={['Canada.ca', 'Service Canada', 'Eligibility Estimator']}
            />
            <h1 className="h1 mt-8 mb-10 border-b border-header-rule">
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
