import { ErrorPage } from '@dts-stn/service-canada-design-system'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { Layout } from '../components/Layout'

const Custom404: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <Layout>
        <ErrorPage lang={router.locale} errType="404" isAuth={false} />
      </Layout>
    </>
  )
}

export default Custom404
