import { observer } from 'mobx-react'
import { GetStaticProps, NextPage } from 'next'
import { useEffect } from 'react'
import { HeadDoc } from '../../components/Document'
import { useStore, useTranslation } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { Tabs } from '../../components/Tabs'
import { WebTranslations } from '../../i18n/web'
import { Language } from '../../utils/api/definitions/enums'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { sendAnalyticsRequest } from '../../utils/web/helpers/utils'
import { mockPartialGetRequest } from '../../__tests__/pages/api/factory'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    if (process.browser) {
      const win = window as Window &
        typeof globalThis & { adobeDataLayer: any; _satellite: any }
      const lang = tsln.langLong
      const creator = tsln.creator
      const title =
        lang +
        '-sc labs-eligibility estimator-' +
        root.getTabNameForAnalytics(0)

      sendAnalyticsRequest(lang, title, creator, win)
    }
  })

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
