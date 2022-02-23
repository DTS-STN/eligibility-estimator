import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { Alert } from '../components/Alert'
import { Document } from '../components/Document'
import { useTranslation } from '../components/Hooks'
import { Layout } from '../components/Layout'
import { WebTranslations } from '../i18n/web'
import { EstimationSummaryState } from '../utils/api/definitions/enums'

const Home: NextPage = (props) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  return (
    <>
      <Document />
      <Script
        id="aa-id"
        src="//assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js"
      ></Script>
      <Script id="aa-push" src="/scripts/adobe.js"></Script>
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
          <p
            className="mb-4 text-black"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP3 }}
          />
          <p
            className="mb-4 text-black"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP4 }}
          />
          <p
            className="mb-4 text-black"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP5 }}
          />
          <p
            className="mb-4 text-black"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP6 }}
          />
        </div>

        <details className="py-4">
          <summary className="text-default-text">
            {tsln.privacyDiscTitle}
          </summary>
          <div className="p-4">
            <p>{tsln.privacyDisc}</p>
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
      <Script id="aa-body" type="text/javascript">
        _satellite.pageBottom();
      </Script>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}

export default Home
