import { ErrorPage } from '@dts-stn/decd-design-system'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSessionStorage } from 'react-use'
import { FieldInputsObject, InputHelper } from '../../client-state/InputHelper'
import { Layout } from '../../components/Layout'
import { Language } from '../../utils/api/definitions/enums'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'

/*
 It appears that the Design System components and/or dangerouslySetInnerHTML does not properly support SSR,
 which causes React Hydration errors. Not sure what needs to change to fix this properly, so this is
 just a workaround. Updating React seems to help, but also is stricter on these issues.
 https://nextjs.org/docs/messages/react-hydration-error
 https://nextjs.org/docs/advanced-features/dynamic-import
*/
const ResultsPage = dynamic(
  () => import('../../components/ResultsPage/index'),
  { ssr: false }
)

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
