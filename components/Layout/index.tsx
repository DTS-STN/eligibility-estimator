import { Breadcrumb, Heading } from '@dts-stn/decd-design-system'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { WebTranslations } from '../../i18n/web'
import { HeadDoc } from '../Document'
import { useMediaQuery, useTranslation } from '../Hooks'
import { Footer } from './Footer'
import { Header } from './Header'
import { SCLabsTestHeader } from './ScTestHeader'

export const Layout: React.VFC<{
  children: React.ReactNode
  hideBreadcrumbHeader?: boolean
}> = ({ children, hideBreadcrumbHeader = false }) => {
  const router = useRouter()
  const isMobile = useMediaQuery(400)
  const oppositeLocale = router.locales.find((l) => l !== router.locale)
  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <HeadDoc />
      <SCLabsTestHeader />
      <main className="mainContent">
        <div className="mx-4 min-h-screen">
          <div className="sm:container mx-auto">
            <div className="flex justify-end my-4">
              <Link href={router.asPath} locale={oppositeLocale} passHref>
                <button className="btn-link btn underline">
                  {isMobile ? tsln.otherLangCode : tsln.otherLang}
                </button>
              </Link>
            </div>
          </div>
          <Header />
          <div className="bg-primary -mx-4">
            <div className="flex flex-row justify-between items-center sm:container mx-auto">
              <h3 className="text-h3 py-3 text-white font-bold px-4 md:px-0">
                {tsln.menuTitle}
              </h3>
              <p />
            </div>
          </div>
          <div className="sm:container mx-auto flex flex-col mb-16 mt-8">
            {hideBreadcrumbHeader || (
              <>
                <Breadcrumb
                  id="navBreadcrumb"
                  items={[
                    { text: tsln.breadcrumb1Title, link: '#' },
                    { text: tsln.breadcrumb2Title, link: '#' },
                  ]}
                />
                <Heading
                  id="oldAgeTitle"
                  title={tsln.title}
                  className="mt-10 mb-8"
                />
              </>
            )}
            {children}
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
