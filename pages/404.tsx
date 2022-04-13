import { ErrorPage } from '@dts-stn/decd-design-system'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HeadDoc } from '../components/Document'
import { useMediaQuery, useTranslation } from '../components/Hooks'
import { Footer } from '../components/Layout/Footer'
import { Header } from '../components/Layout/Header'
import { SCLabsTestHeader } from '../components/Layout/ScTestHeader'
import { WebTranslations } from '../i18n/web'

const Custom404: NextPage = (props) => {
  const router = useRouter()
  const isMobile = useMediaQuery(400)
  const oppositeLocale = router.locales.find((l) => l !== router.locale)
  const tsln = useTranslation<WebTranslations>()
  return (
    <>
      <HeadDoc />
      <>
        <SCLabsTestHeader />
        <main>
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
              <ErrorPage lang={router.locale} errType="404" isAuth={false} />
            </div>
          </div>
          <Footer />
        </main>
      </>
    </>
  )
}

export default Custom404
