import { useRouter } from 'next/router'
import { getTranslations } from '../i18n/api'
import { WebTranslations } from '../i18n/web'
import { useTranslation } from './Hooks'

export type TableData = {
  age: number
  amount: number
}

export interface TableProps {
  data: TableData[]
}

const Table: React.FC<TableProps> = ({ data }) => {
  const tsln = useTranslation<WebTranslations>()
  const locale = useRouter().locale
  const apiTsln = getTranslations(tsln._language)

  const localizedIncome = (amount) => {
    return new Intl.NumberFormat(`${locale}-CA`, {
      style: 'currency',
      currency: 'CAD',
    })
      .format(amount)
      .replace('.00', '')
      .replace(/,00\s/, '\xa0')
  }

  return (
    <table className="mt-8 mb-8 text-center w-full md:w-8/12 table-fixed">
      <caption className="mb-3 font-bold">
        {apiTsln.oasDeferralTable.title}
      </caption>
      <thead>
        <tr className="text-sm">
          <th className="border border-gray-200 bg-gray-100 p-4">
            {apiTsln.oasDeferralTable.headingAge}
          </th>
          <th className="border border-gray-200 bg-gray-100">
            {apiTsln.oasDeferralTable.headingAmount}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ age, amount }, index) => (
          <tr key={index}>
            <td className="border border-gray-200 p-0">
              {age.toLocaleString() + (locale === 'fr' ? ' ans' : '')}
            </td>
            <td className="border border-gray-200 p-0">
              {localizedIncome(amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
