import { ErrorPage } from '@dts-stn/service-canada-design-system'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useSessionStorage } from 'react-use'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
import { Layout } from '../../components/Layout'
import { ResultsPage } from '../../components/ResultsPage'
import { Language } from '../../utils/api/definitions/enums'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'

const Results: NextPage = (props) => {
  const [inputs, setInputs]: [
    FieldInputsObject,
    (value: FieldInputsObject) => void
  ] = useSessionStorage('inputs', {})

  const language = useRouter().locale as Language

  const inputHelper = new InputHelper(inputs, setInputs, language)

  const mainHandler = new MainHandler(inputHelper.asObjectWithLanguage)
  const response: ResponseSuccess | ResponseError = mainHandler.results

  return (
    <Layout>
      {'results' in response ? (
        <ResultsPage
          inputs={inputHelper.asArray}
          results={response.results}
          summary={response.summary}
        />
      ) : (
        <ErrorPage lang={language} errType="500" isAuth={false} />
      )}
    </Layout>
  )
}

export default Results
