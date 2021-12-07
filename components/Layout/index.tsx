import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { LanguageContext } from '../Contexts'
import { useInternationalization } from '../Hooks'
import { Footer } from './Footer'
import { Header } from './Header'

export const Layout: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const otherLang = useInternationalization('otherLang')
  const otherLangNameFull = useInternationalization('otherLangFull')

  const { userLanguageChange } = useContext(LanguageContext)

  return (
    <main>
      <div className="mx-4 min-h-screen">
        <div className="container mx-auto">
          <div className="flex justify-end my-4">
            <button
              className="btn-link btn underline"
              onClick={(e) => userLanguageChange(otherLang)}
            >
              {otherLangNameFull}
            </button>
          </div>
        </div>
        <Header />
        <div className="bg-primary -mx-4">
          <div className="flex flex-row justify-between items-center container mx-auto">
            <h3 className="text-h3 py-3 text-white font-bold">
              Service Canada
            </h3>
            <p className="font-bold text-white">Sign out</p>
          </div>
        </div>
        <div className="container mx-auto flex flex-col mb-16">{children}</div>
      </div>
      <Footer />
    </main>
  )
}
