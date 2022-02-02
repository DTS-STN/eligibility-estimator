import type { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Alert } from '../components/Alert'
import { useTranslation } from '../components/Hooks'
import { Layout } from '../components/Layout'
import { WebTranslations } from '../i18n/web'
import { EstimationSummaryState } from '../utils/api/definitions/enums'

const Home: NextPage = (props) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  return (
    <Layout>
      <div className="mt-18 text-content">
        <p className="mb-4 text-content">{tsln.homePageP1}</p>
        <p className="mb-4 text-content">{tsln.homePageP2}</p>
        <p className="mb-4 text-content">{tsln.homePageP3}</p>
        <p className="mb-4 text-content">{tsln.homePageP4}</p>
        <p className="mb-4 text-content">{tsln.homePageP5}</p>
        <p className="mb-4 text-content">{tsln.homePageP6}</p>
      </div>

      <Alert
        title={tsln.disclaimerTitle}
        type={EstimationSummaryState.UNAVAILABLE}
        insertHTML
      >
        {tsln.disclaimer}
      </Alert>

      <button
        className="btn btn-primary w-28 mt-8"
        onClick={(e) => router.push('/eligibility')}
      >
        {tsln.next}
      </button>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}

export default Home
