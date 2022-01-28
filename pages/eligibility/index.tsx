import { Layout } from '../../components/Layout'
import { observer } from 'mobx-react'
import { GetServerSideProps, NextPage } from 'next'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { Tabs } from '../../components/Tabs'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  if ('error' in props) {
    return (
      <Layout>
        <div>{props.error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Tabs {...props} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query

  const host = context.req.headers.host

  const params = Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&')

  const path = `http://${host}/api/calculateEligibility?${params}`

  const res = await fetch(path)
  const data = await res.json()

  return {
    props: {
      ...data,
    },
  }
}

export default observer(Eligibility)
