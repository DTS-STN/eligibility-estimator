import { NextPage } from 'next'
import { HeadDoc } from '../../components/Document'
import { useStorage, useStore } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { ResultsPage } from '../../components/ResultsPage'

const Results: NextPage = (props) => {
  const root = useStore()
  const [storeFromSession] = useStorage('session', 'store', {})
  if (process.browser) {
    root.bootstrapStoreState(storeFromSession)
  }
  return (
    <>
      <HeadDoc />
      <Layout>
        <ResultsPage />
      </Layout>
    </>
  )
}

export default Results
