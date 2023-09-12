import Image from 'next/image'
import { useRouter } from 'next/router'
import { getTranslations, numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Language, ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'
import { EstimatedTotalItem } from './EstimatedTotalItem'

export const WillBeEligible: React.VFC<{
  futureResults: any
  partner?: boolean
  partnerNoOAS: boolean
  multipleResults: boolean
  eligibleOAS: boolean
}> = ({
  futureResults,
  partner = false,
  partnerNoOAS,
  multipleResults,
  eligibleOAS,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(tsln._language)
  const language = useRouter().locale as Language

  const multipleOAS_GIS =
    futureResults.filter((obj) => !!obj[Object.keys(obj)[0]]['oas']).length > 1

  for (let i = futureResults.length - 1; i >= 0; i--) {
    if (i > 0) {
      if (
        Object.values(Object.values(Object.values(futureResults)[i])[0])
          .length != 1
      ) {
        if (
          Object.values(Object.values(futureResults[i])[0])[0]?.entitlement
            .result ==
            Object.values(Object.values(futureResults[i - 1])[0])[0]
              ?.entitlement.result &&
          Object.values(Object.values(futureResults[i])[0])[1]?.entitlement
            .result ==
            Object.values(Object.values(futureResults[i - 1])[0])[1]
              ?.entitlement.result
        ) {
          futureResults.pop()
        }
      }
    }
  }

  return (
    <>
      <h2
        id={partner ? 'future-partner-estimate' : 'future-estimate'}
        className="h2 mt-12"
      >
        <Image src="/pg-check.svg" alt="" width={30} height={30} />
        {partner
          ? tsln.resultsPage.partnerFutureEligible
          : tsln.resultsPage.futureEligible}
      </h2>

      {futureResults.map((resultObj, idx) => {
        const age = Object.keys(resultObj)[0]
        const onlyOASGIS = Object.keys(
          resultObj[Object.keys(resultObj)[0]]
        ).filter((key) => key === 'oas' || key === 'gis')

        // show if some are non zero
        const nonZeroExist = onlyOASGIS.some(
          (key) => resultObj[age][key].entitlement?.result > 0
        )

        //
        // an overcomplicated condition for useless information
        //
        const enStr =
          (multipleOAS_GIS && nonZeroExist && !multipleResults && idx > 0) ||
          (multipleOAS_GIS && nonZeroExist && multipleResults) ||
          (multipleOAS_GIS && nonZeroExist && idx > 0) ||
          eligibleOAS
            ? partner
              ? 'If your partner continues receiving at'
              : 'If you continue receiving at'
            : 'At'
        const frStr =
          (multipleOAS_GIS && nonZeroExist && !multipleResults && idx > 0) ||
          (multipleOAS_GIS && nonZeroExist && multipleResults) ||
          (multipleOAS_GIS && nonZeroExist && idx > 0) ||
          eligibleOAS
            ? partner
              ? 'Si votre conjoint continue de recevoir à'
              : 'Si vous continuez de recevoir à'
            : 'À'

        const partnerText =
          (multipleOAS_GIS && nonZeroExist && !multipleResults && idx > 0) ||
          (multipleOAS_GIS && nonZeroExist && multipleResults) ||
          (multipleOAS_GIS && nonZeroExist && idx > 0) ||
          eligibleOAS
            ? tsln.resultsPage.theyToReceive
            : tsln.resultsPage.partnerToReceive

        const text = `${language === 'en' ? enStr : frStr} ${Math.floor(
          Number(age)
        )}${language === 'en' ? ',' : ' ans,'} ${
          partner ? partnerText : tsln.resultsPage.toReceive
        }`

        const resultsArray: BenefitResult[] = Object.keys(resultObj[age]).map(
          (value) => resultObj[age][value]
        )
        let eligible = resultsArray.filter(
          (result) =>
            result.eligibility?.result === ResultKey.ELIGIBLE ||
            result.eligibility?.result === ResultKey.INCOME_DEPENDENT
        )

        // If partner answers "No" to receiving OAS, the amounts should not show
        if (partner && partnerNoOAS) {
          eligible = eligible.map((benefit) => {
            return {
              ...benefit,
              entitlement: { ...benefit.entitlement, result: 0 },
            }
          })
        }

        const eligibleTotalAmount = eligible.reduce(
          (sum, obj) => sum + obj.entitlement.result,
          0
        )

        return (
          <div
            className={idx + 1 !== futureResults.length ? 'mb-10' : ''}
            key={age}
          >
            <p
              className="pl-[35px]"
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            />

            <ul className="pl-[35px] ml-[20px] my-1 list-disc text-content">
              {eligible.map((benefit) => (
                <EstimatedTotalItem
                  key={benefit.benefitKey}
                  heading={apiTrans.benefit[benefit.benefitKey]}
                  result={benefit}
                />
              ))}
            </ul>
            {eligible.length > 1 && eligibleTotalAmount > 0 && (
              <p className="pl-[35px]">
                {partner
                  ? tsln.resultsPage.futurePartnerTotal
                  : tsln.resultsPage.futureTotal}
                <strong>
                  {numberToStringCurrency(eligibleTotalAmount, language)}
                </strong>
                .
              </p>
            )}
          </div>
        )
      })}
    </>
  )
}
