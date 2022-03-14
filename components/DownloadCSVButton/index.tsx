import Link from 'next/link'
import { WebTranslations } from '../../i18n/web'
import { useStore, useTranslation } from '../Hooks'

export const DownloadCSVButton = () => {
  const form = useStore().form
  // const disabled = form.emptyFields.length > 0
  const disabled = true // force disable for now
  const saveToCsv = useTranslation<WebTranslations>('saveToCsv')

  if (disabled) {
    return <div></div>
  }

  return (
    <Link
      href={`/api/exportCsv?${form.buildQueryStringWithFormData()}`}
      passHref
    >
      <a
        className="bg-[#26374A] rounded text-white border border-[#2572B4] px-4 py-3 text-left md:text-center flex justify-center w-40"
        download
      >
        {saveToCsv}
      </a>
    </Link>
  )
}
