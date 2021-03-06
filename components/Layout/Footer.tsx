import { Footer as DSFooter } from '@dts-stn/service-canada-design-system'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Footer = () => {
  const tsln = useTranslation<WebTranslations>()

  return (
    <DSFooter
      btnLink="#"
      id="footer-info"
      lang={tsln._language}
      containerClass="xs:container"
    />
  )
}
