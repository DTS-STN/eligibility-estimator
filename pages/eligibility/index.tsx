import { NextPage } from 'next'
import { useEffect } from 'react'
import { HeadDoc } from '../../components/Document'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { useTranslation } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { WebTranslations } from '../../i18n/web'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { sendAnalyticsRequest } from '../../utils/web/helpers/utils'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    if (typeof window !== undefined) {
      const win = window as Window &
        typeof globalThis & { adobeDataLayer: any; _satellite: any }
      const lang = tsln.langLong
      const creator = tsln.creator
      const title = lang + '-sc labs-eligibility estimator-'

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

export default Eligibility
