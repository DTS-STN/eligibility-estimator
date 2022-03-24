import { observer } from 'mobx-react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { HeadDoc } from '../../components/Document'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { useStorage, useStore, useTranslation } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { WebTranslations } from '../../i18n/web'
import { Language } from '../../utils/api/definitions/enums'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { sendAnalyticsRequest } from '../../utils/web/helpers/utils'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  console.log('rendering main eligibility using', props)
  const root = useStore()
  const [storeFromSession] = useStorage('session', 'store', {})
  root.bootstrapStoreState(storeFromSession)
  const locale = useRouter().locale as Language
  root.setLangBrowser(locale)

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

  return (
    <>
      <HeadDoc />
      <Layout>
        <ComponentFactory />
      </Layout>
    </>
  )
}

export default observer(Eligibility)
