import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { HeadDoc } from '../components/Document'
import { useTranslation } from '../components/Hooks'
import { Layout } from '../components/Layout'
import { WebTranslations } from '../i18n/web'
import { sendAnalyticsRequest } from '../utils/web/helpers/utils'

const Home: NextPage = (props) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    // only run on mount on the client
    if (process.browser) {
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
      <HeadDoc />
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
          <h2 className="h2 mt-8 mb-2">{tsln.privacyDiscTitle}</h2>
          <p
            className="summary-link mt-6"
            dangerouslySetInnerHTML={{ __html: tsln.privacyDisc }}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="btn btn-primary w-28 my-8"
            onClick={(e) => router.push('/eligibility')}
          >
            {tsln.next}
          </button>
        </div>
      </Layout>
    </>
  )
}

export default Home
