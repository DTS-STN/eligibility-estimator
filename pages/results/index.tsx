import { NextPage } from 'next'
import { useStorage, useStore } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { ResultsPage } from '../../components/ResultsPage'

const Results: NextPage = (props) => {
  const root = useStore()
  const [storeFromSession] = useStorage('session', 'store', {})
  root.bootstrapStoreState(storeFromSession)

  /*
   This will ensure that the internal state of the results matches the internal state of the form inputs.
   This is especially important when changing languages, as a language change requires the internal state to update its translated strings.
  */
  root.form.sendAPIRequest()

  return (
    <>
      <Layout>
        <ResultsPage />
      </Layout>
    </>
  )
}

export default Results
