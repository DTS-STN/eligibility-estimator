import { observer } from 'mobx-react'
import { GetStaticProps, NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { Tabs } from '../../components/Tabs'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { mockPartialGetRequest } from '../../__tests__/pages/api/factory'

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

/**
 * This function appears unused, but it is called by Next.js and then passed to the above as the props parameter.
 * Some documentation: https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation
 */
export const getStaticProps: GetStaticProps = async (context) => {
  // using mockPartialGetRequest() is simply a convenient way of calling
  // the backend function, as it expects specific request/response objects
  const data = await mockPartialGetRequest({})

  return {
    props: {
      ...data.body,
    },
  }
}

export default observer(Eligibility)
