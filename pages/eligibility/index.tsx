import { NextPage } from 'next'
import { EligibilityPage } from '../../components/EligibilityPage'
import { Layout } from '../../components/Layout'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  return (
    <>
      <Layout>
        <EligibilityPage />
      </Layout>
    </>
  )
}

export default Eligibility
