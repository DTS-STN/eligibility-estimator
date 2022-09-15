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
  const isEligible: boolean = resultsEligible.length > 0

  return (
    <>
      <h2 id="eligible" className="h2 mt-8">
        <Image
          src={isEligible ? '/green-check-mark.svg' : '/info.svg'}
          alt=""
          width={30}
          height={30}
        />{' '}
        {isEligible
          ? tsln.resultsPage.youMayBeEligible
          : tsln.resultsPage.youAreNotEligible}
      </h2>
      <div className="pl-[35px]">
        <p
          dangerouslySetInnerHTML={{
            __html: isEligible
              ? tsln.resultsPage.basedOnYourInfoEligible
              : tsln.resultsPage.basedOnYourInfoNotEligible,
          }}
        />
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
