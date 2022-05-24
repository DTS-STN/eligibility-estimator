import { Footer as DSFooter } from '@dts-stn/decd-design-system'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Footer = () => {
  const tsln = useTranslation<WebTranslations>()
  const landscapeLinks = [
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink1,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink6,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink2,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink7,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink3,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink8,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink4,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink9,
    },
    {
      landscapeLink: '#',
      landscapeLinkText: tsln.footerlink5,
    },
  ]
  const brandLinks = [
    {
      brandLink: '#',
      brandLinkText: tsln.socialLink1,
    },
    {
      brandLink: '#',
      brandLinkText: tsln.socialLink2,
    },
    {
      brandLink: '#',
      brandLinkText: tsln.socialLink3,
    },
    {
      brandLink: '#',
      brandLinkText: tsln.socialLink4,
    },
    {
      brandLink: '#',
      brandLinkText: tsln.socialLink5,
    },
  ]

  return (
    <DSFooter
      id="footer"
      btnLink="#"
      landscapeLinks={landscapeLinks}
      brandLinks={brandLinks}
    />
  )
}
