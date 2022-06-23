import { observer } from 'mobx-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { getTranslations } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Locale, ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { useStore, useTranslation } from '../Hooks'
import { BenefitCards } from './BenefitCards'
import { EstimatedTotal } from './EstimatedTotal'

export const ResultsBoxes = observer(() => {
  const root = useStore()
  const answers = root.getInputObject()

  const tsln = useTranslation<WebTranslations>()
  const apiTrans = getTranslations(answers._language)

  const currentLocale = useRouter().locale
  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR

  // Didn't find a enum for the current benefits
  const benefits = ['oas', 'gis', 'allowance', 'afs']

  const resultsArray = root
    .getResultArray()
    .map((x) => x.toJSON()) as BenefitResult[]

  const resultsEligible = resultsArray.filter(
    (result) =>
      result.eligibility?.result === ResultKey.ELIGIBLE ||
      result.eligibility?.result === ResultKey.INCOME_DEPENDENT
  )

  // Display the details and eligibility results separately, then create a new column
  return (
    <div>
      {/* You may be eligible */}

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
          {benefits
            .filter(
              (x) =>
                root[x]?.eligibility?.result ===
                apiTrans.result.eligible.toLowerCase()
            )
            .map((benefit) => (
              <li key={root[benefit]}>{tsln[benefit]}</li>
            ))}
        </ul>
      </div>

      <EstimatedTotal
        resultsEligible={resultsEligible}
        summary={root.summary}
      />

      <hr className="my-12 border border-[#BBBFC5]" />

      <BenefitCards results={resultsArray} />
    </div>
  )
})
