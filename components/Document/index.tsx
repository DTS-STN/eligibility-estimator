import Head from 'next/head'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const HeadDoc = () => {
  const tsln = useTranslation<WebTranslations>()

  return (
    <Head>
      <title>{tsln.title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <script src="https://assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js" />
    </Head>
  )
}
