import { observer } from 'mobx-react'
import { GetStaticProps, NextPage } from 'next'
import Script from 'next/script'
import { HeadDoc } from '../../components/Document'
import { Layout } from '../../components/Layout'
import { Tabs } from '../../components/Tabs'
import { Language } from '../../utils/api/definitions/enums'
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
    <>
      <HeadDoc />
      <Script
        id="aa-id"
        src="//assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js"
      ></Script>

      <Layout>
        <Tabs {...props} />
      </Layout>

      <script src="/scripts/adobe.js"></script>
      <script type="text/javascript">_satellite.pageBottom()</script>
    </>
  )
}

/**
 * This function appears unused, but it is called by Next.js and then passed to the above as the props parameter.
 * Some documentation: https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation
 */
export const getStaticProps: GetStaticProps = async (context) => {
  // using mockPartialGetRequest() is simply a convenient way of calling
  // the backend function, as it expects specific request/response objects
  const data = await mockPartialGetRequest({
    _language: context.locale == 'en' ? Language.EN : Language.FR,
  })

  return {
    props: {
      ...data.body,
    },
  }
}

export default observer(Eligibility)
