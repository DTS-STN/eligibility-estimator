import { ErrorPage } from '@dts-stn/service-canada-design-system'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Layout } from '../components/Layout'
import { useTranslation } from '../components/Hooks'
import { WebTranslations } from '../i18n/web'

const Custom404: NextPage = () => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <Layout title={tsln.pageNotFound}>
        <ErrorPage lang={router.locale} errType="404" isAuth={false} />
      </Layout>
    </>
  )
}

export default Custom404
