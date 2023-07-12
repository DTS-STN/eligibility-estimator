import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const WillBeEligible: React.VFC<{
  futureResults: any
}> = ({ futureResults }) => {
  console.log('futureResults', futureResults)
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)

  const language = useRouter().locale as Language
  console.log('language', language)

  return (
    <>
      <h2 id={'future-estimate'} className="h2 mt-12">
        <Image src="/pg-check.svg" alt="" width={30} height={30} />
        {tsln.resultsPage.futureEligible}
      </h2>

      {futureResults.map((resultObj) => {
        const age = Object.keys(resultObj)[0]
        const text = `${language === 'en' ? 'At' : 'À'} ${age}, ${
          tsln.resultsPage.toReceive
        }:`

        const resultsArray: BenefitResult[] = Object.keys(resultObj[age]).map(
          (value) => resultObj[age][value]
        )

        const eligible = resultsArray.filter(
          (result) =>
            result.eligibility?.result === ResultKey.ELIGIBLE ||
            result.eligibility?.result === ResultKey.INCOME_DEPENDENT
        )

        return (
          <div key={age}>
            <p
              className="pl-[35px]"
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            />

            <ul className="pl-[35px] ml-[20px] my-2 list-disc text-content">
              {eligible.map((benefit) => (
                <EstimatedTotalItem
                  key={benefit.benefitKey}
                  heading={apiTrans.benefit[benefit.benefitKey]}
                  result={benefit}
                />
              ))}
            </ul>
          </div>
        )
      })}
    </>
  )
}
