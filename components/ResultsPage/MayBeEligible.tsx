import Image from 'next/image'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'

export const MayBeEligible: React.VFC<{
  resultsEligible: BenefitResult[]
}> = ({ resultsEligible }) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)

  return (
    <>
      <h2 id="eligible" className="h2 mt-8">
        <Image
          src="/eligible.png"
          alt={apiTrans.result.eligible}
          width={30}
          height={30}
        />{' '}
        {tsln.resultsPage.youMayBeEligible}
      </h2>
      <div className="pl-12">
        {tsln.resultsPage.basedOnYourInfo}
        <ul className="pl-5 list-disc text-content font-semibold">
          {resultsEligible.map((benefit) => (
            <li key={benefit.benefitKey}>
              {apiTrans.benefit[benefit.benefitKey]}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
