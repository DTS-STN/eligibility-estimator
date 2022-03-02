import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Alert } from '../components/Alert'
import { HeadDoc } from '../components/Document'
import { useTranslation } from '../components/Hooks'
import { Layout } from '../components/Layout'
import { WebTranslations } from '../i18n/web'
import { EstimationSummaryState } from '../utils/api/definitions/enums'
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
        <div className="mt-18 text-black">
          <p
            className="mb-4 text-black"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP1 }}
          />
          <p
            className="mb-4 text-black"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP2 }}
          />
          <ul className="list-disc">
            <li
              className="mb-4 text-black ml-6"
              dangerouslySetInnerHTML={{ __html: tsln.homePageP3 }}
            />
            <li
              className="mb-4 text-black ml-6"
              dangerouslySetInnerHTML={{ __html: tsln.homePageP4 }}
            />
            <li
              className="mb-4 text-black ml-6"
              dangerouslySetInnerHTML={{ __html: tsln.homePageP5 }}
            />
            <li
              className="mb-4 text-black ml-6"
              dangerouslySetInnerHTML={{ __html: tsln.homePageP6 }}
            />
          </ul>
        </div>

        <details className="py-4">
          <summary className="text-default-text">
            {tsln.privacyDiscTitle}
          </summary>
          <div className="p-4">
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.privacyDisc }}
            />
          </div>
        </details>

        <Alert
          title={tsln.disclaimerTitle}
          type={EstimationSummaryState.UNAVAILABLE}
          insertHTML
        >
          {tsln.disclaimer}
        </Alert>

        <button
          className="btn btn-primary w-28 my-8"
          onClick={(e) => router.push('/eligibility')}
        >
          {tsln.next}
        </button>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}

export default Home
