import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { TableData } from '../../utils/api/definitions/types'

export const DeferralTable: React.VFC<{
  data: TableData[]
  future: boolean
}> = ({ data, future }) => {
  const tsln = useTranslation<WebTranslations>()
  const locale = useRouter().locale
  const apiTsln = getTranslations(tsln._language)

  return (
    <table
      aria-label={`${apiTsln.oasDeferralTable.title} Table`}
      aria-describedby={`${apiTsln.oasDeferralTable.title} desc`}
      className="mt-8 mb-8 text-center w-full md:w-7/12 table-fixed"
    >
      <caption
        id={`${apiTsln.oasDeferralTable.title} desc`}
        data-cy="deferral-title"
        className="mb-3 font-bold"
      >
        {apiTsln.oasDeferralTable.title}
      </caption>
      <thead data-cy="deferral-heading">
        <tr>
          <th
            scope="col"
            className="border border-gray-800 bg-gray-100 py-4 px-2"
          >
            {future
              ? apiTsln.oasDeferralTable.futureHeadingAge
              : apiTsln.oasDeferralTable.headingAge}
          </th>
          <th scope="col" className="border border-gray-800 bg-gray-100 px-2">
            {apiTsln.oasDeferralTable.headingAmount}
          </th>
        </tr>
      </thead>
      <tbody data-cy="deferral-table">
        {data.map(({ age, amount }, index) => (
          <tr key={index}>
            <td className="border border-gray-800 p-0">
              {age.toLocaleString() + (locale === 'fr' ? ' ans' : '')}
            </td>
            <td className="border border-gray-800 p-0">
              {numberToStringCurrency(amount, tsln._language)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
