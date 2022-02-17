import { useRouter } from 'next/router'
import { FAQE } from './index-e'
import { FAQF } from './index-f'

export const FAQ = () => {
  const locale = useRouter().locale

  if (locale == 'en') {
    return <FAQE />
  } else if (locale == 'fr') {
    return <FAQF />
  } else {
    throw new Error('unknown locale')
  }
}
