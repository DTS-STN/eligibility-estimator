import { ErrorPage } from '@dts-stn/decd-design-system'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { HeadDoc } from '../components/Document'
import { Layout } from '../components/Layout'

const Custom404: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <HeadDoc />
      <Layout>
        <ErrorPage lang={router.locale} errType="404" isAuth={false} />
      </Layout>
    </>
  )
}

export default Custom404
