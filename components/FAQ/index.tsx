import { useRouter } from 'next/router'
import React from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { FAQE } from './index-e'
import { FAQF } from './index-f'

export const FAQ = () => {
  const locale = useRouter().locale
  const tsln = useTranslation<WebTranslations>()

  return (
    <div className="mb-8 mt-16">
      <h2 id="faqLink" className="h2 text-content">
        {tsln.faq}
      </h2>
      {locale == 'fr' ? <FAQF /> : <FAQE />}
    </div>
  )
}
