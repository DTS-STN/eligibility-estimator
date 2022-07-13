import NextHead from 'next/head'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Head = () => {
  const tsln = useTranslation<WebTranslations>()

  return (
    <NextHead>
      <title>{tsln.title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <script src="https://assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js" />
    </NextHead>
  )
}
