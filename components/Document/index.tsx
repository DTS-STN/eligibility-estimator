import Head from 'next/head'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const HeadDoc = () => {
  const tsln = useTranslation<WebTranslations>()

  return (
    <Head>
      <title>{tsln.title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@700&family=Noto+Sans&family=Patua+One&display=swap"
        rel="stylesheet"
        crossOrigin="anonymous"
      ></link>
      <script src="//assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js"></script>
    </Head>
  )
}
