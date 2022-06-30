import { ErrorPage } from '@dts-stn/decd-design-system'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FieldInput } from '../../client-state/types'
import { useStorage, useStore } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { ResultsPage } from '../../components/ResultsPage'
import { FieldKey } from '../../utils/api/definitions/fields'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'

const Results: NextPage = (props) => {
  const router = useRouter()
  const root = useStore()

  const [storeFromSession] = useStorage('session', 'store', {})
  root.bootstrapStoreState(storeFromSession)

  const [inputsObj, setInputsObj] = useState({})
  useEffect(() => setInputsObj(root.getInputObject()), [root])

  const fieldInputsArray: FieldInput[] = Object.values(FieldKey)
    .map((key: FieldKey) => ({
      key,
      value: inputsObj[key],
    }))
    .filter((input) => input.value)

  const mainHandler = new MainHandler(inputsObj)
  const response: ResponseSuccess | ResponseError = mainHandler.results

  return (
    <Layout>
      {'results' in response ? (
        <ResultsPage
          inputs={fieldInputsArray}
          results={response.results}
          summary={response.summary}
        />
      ) : (
        <ErrorPage lang={router.locale} errType="500" isAuth={false} />
      )}
    </Layout>
  )
}

export default Results
