import { observer } from 'mobx-react'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { HeadDoc } from '../../components/Document'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { useStorage, useStore, useTranslation } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { WebTranslations } from '../../i18n/web'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'
import { sendAnalyticsRequest } from '../../utils/web/helpers/utils'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  const root = useStore()
  const [storeFromSession] = useStorage('session', 'store', {})
  root.bootstrapStoreState(storeFromSession)

  /*
   This will ensure that the internal state of the results matches the internal state of the form inputs.
   This is especially important when changing languages, as a language change requires the internal state to update its translated strings.
  */
  root.form.sendAPIRequest()

  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    if (typeof window !== undefined) {
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

  const data = new MainHandler({ _language: tsln._language }).results

  if ('error' in data) {
    return (
      <Layout>
        <div>{data.error}</div>
      </Layout>
    )
  }

  return (
    <>
      <HeadDoc />
      <Layout>
        <ComponentFactory data={data} />
      </Layout>
    </>
  )
}

export default observer(Eligibility)
