import { Button } from '@dts-stn/decd-design-system'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from '../components/Hooks'
import { Layout } from '../components/Layout'
import { WebTranslations } from '../i18n/web'
import { sendAnalyticsRequest } from '../utils/web/helpers/utils'

const Home: NextPage = () => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    // only run on mount on the client
    if (typeof window !== undefined) {
      const win = window as Window &
        typeof globalThis & { adobeDataLayer: any; _satellite: any }
      const lang = tsln.langLong
      const creator = tsln.creator
      const title = lang + '-sc labs-eligibility estimator-home'

      sendAnalyticsRequest(lang, title, creator, win)
    }
  })

  return (
    <>
      <Layout>
        <div className="mt-18">
          <p
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP1 }}
          />
          <h2 className="h2 mt-8 mb-2">{tsln.homePageHeader1}</h2>
          <h3 className="h3 mt-6 mb-2">{tsln.oas}</h3>
          <p
            className="my-6"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP3 }}
          />
          <h3 className="h3 mt-6 mb-2">{tsln.gis}</h3>
          <p
            className="my-6"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP4 }}
          />
          <h3 className="h3 mt-6 mb-2">{tsln.alw}</h3>
          <p
            className="my-6"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP5 }}
          />
          <h3 className="h3 mt-6 mb-2">{tsln.afs}</h3>
          <p
            className="my-6"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP6 }}
          />
          <h2 className="h2 mt-8 mb-2">{tsln.disclaimerTitle}</h2>
          <p
            className="summary-link mt-6"
            dangerouslySetInnerHTML={{ __html: tsln.disclaimer }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            text={tsln.next}
            styling="primary"
            onClick={(e) => router.push('/eligibility')}
            className="my-8 w-28 justify-center"
          />
        </div>
      </Layout>
    </>
  )
}

export default Home
