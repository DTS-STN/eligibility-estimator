import { NextPage } from 'next'
import { EligibilityPage } from '../../components/EligibilityPage'
import { Layout } from '../../components/Layout'
import { useTranslation } from '../../components/Hooks'
import { WebTranslations } from '../../i18n/web'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <Layout title={tsln.questionPageTitle}>
        <EligibilityPage />
      </Layout>
    </>
  )
}

export default Eligibility
