import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { getTranslations } from '../../i18n/api'
import { Locale } from '../../utils/api/definitions/enums'
import { useStore, useTranslation } from '../Hooks'
import { ResultsTableRow } from './ResultsTableRow'
import { MessageBox } from './MessageBox'

export const ResultsBoxes = observer(() => {
  const root = useStore()
  const answers = root.getInputObject()

  const tsln = useTranslation<WebTranslations>()
  const trans = getTranslations(answers._language)

  const currentLocale = useRouter().locale
  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR

  // Didn't find a enum for the current benefits
  const benefits = ['oas', 'gis', 'allowance', 'afs']

  const eligibleBenefits = benefits.filter(
    (x) => root[x]?.eligibility?.result === trans.result.eligible.toLowerCase()
  )
  const nonEligibleBenefits = benefits.filter(
    (x) => root[x]?.eligibility?.result !== trans.result.eligible.toLowerCase()
  )

  // Display the details and eligibility results separately, then create a new column
  return (
    <div>
      {/* Your may be eligible */}

      <h2 id="eligible" className="h2 mt-8">
        <Image
          src="/eligible.png"
          alt={trans.result.eligible}
          width={30}
          height={30}
        />{' '}
        {tsln.resultsPage.youMayBeEligible}
      </h2>

      <div className="pl-12">
        {tsln.resultsPage.basedOnYourInfo}

        <ul className="pl-5 list-disc text-content font-semibold">
          {eligibleBenefits.map((benefit) => (
            <li key={root[benefit]}>{tsln[benefit]}</li>
          ))}
        </ul>
      </div>

      {/* Your estimated monthly total */}

      <h2 id="estimated" className="h2 mt-12">
        <Image
          src="/money.png"
          alt={tsln.resultsPage.dollarSign}
          width={30}
          height={30}
        />{' '}
        {tsln.resultsPage.yourEstimatedTotal}{' '}
        {numberToStringCurrency(root.summary.entitlementSum, locale)}
      </h2>

      <div className="pl-12">
        {tsln.resultsPage.basedOnYourInfoTotal}{' '}
        {numberToStringCurrency(root.summary.entitlementSum, locale)}
        <h3 className="my-6 font-semibold">{tsln.resultsPage.header}</h3>
        <table className="hidden md:block text-left">
          <thead className="font-bold border border-[#DDDDDD] bg-[#EEEEEE]">
            <tr>
              <th>{tsln.resultsPage.tableHeader1}</th>
              <th>{tsln.resultsPage.tableHeader2}</th>
            </tr>
          </thead>

          <tbody className="align-top">
            {eligibleBenefits.map((benefit, index) => (
              <ResultsTableRow
                key={index}
                heading={tsln[benefit]}
                data={root[benefit]}
                locale={locale}
                showEntitlement={!root.summary.zeroEntitlements}
              />
            ))}
            {!root.summary.zeroEntitlements && (
              <tr className="border border-[#DDDDDD]">
                <td>{tsln.resultsPage.tableTotalAmount}</td>
                <td className="text-right min-w-[68px]">
                  {numberToStringCurrency(root.summary.entitlementSum, locale)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <hr className="my-12 border border-[#BBBFC5]" />

      {/* Next steps for benefits you may be eligible */}

      {eligibleBenefits.length >= 0 && (
        <>
          <h2 id="next" className="h2 mt-5">
            {tsln.resultsPage.nextSteps}
          </h2>

          {eligibleBenefits.map((benefit) => (
            <>
              <MessageBox
                title={tsln[benefit]}
                eligible={true}
                eligibleText={trans.result.eligible}
                links={
                  benefit == 'oas'
                    ? [
                        {
                          icon: 'info',
                          alt: tsln.resultsPage.info,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                      ]
                    : benefit == 'gis'
                    ? [
                        {
                          icon: 'info',
                          alt: tsln.resultsPage.info,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                        {
                          icon: 'link',
                          alt: tsln.resultsPage.link,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                      ]
                    : [
                        {
                          icon: 'info',
                          alt: tsln.resultsPage.info,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                        {
                          icon: 'note',
                          alt: tsln.resultsPage.note,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                      ]
                }
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: tsln.resultsPage[benefit].Message,
                  }}
                ></span>
              </MessageBox>
            </>
          ))}
        </>
      )}

      {/* Benefits you may not be eligible */}

      {nonEligibleBenefits.length >= 0 && (
        <>
          <h2 id="next" className="h2 mt-12">
            {tsln.resultsPage.youMayNotBeEligible}
          </h2>

          {nonEligibleBenefits.map((benefit) => (
            <>
              <MessageBox
                title={tsln[benefit]}
                eligible={false}
                eligibleText={trans.result.ineligible}
                links={
                  benefit == 'oas'
                    ? [
                        {
                          icon: 'info',
                          alt: tsln.resultsPage.info,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                      ]
                    : benefit == 'gis'
                    ? [
                        {
                          icon: 'info',
                          alt: tsln.resultsPage.info,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                        {
                          icon: 'link',
                          alt: tsln.resultsPage.link,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                      ]
                    : [
                        {
                          icon: 'info',
                          alt: tsln.resultsPage.info,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                        {
                          icon: 'note',
                          alt: tsln.resultsPage.note,
                          url: tsln.resultsPage[benefit].InfoUrl,
                          text: tsln.resultsPage[benefit].InfoText,
                        },
                      ]
                }
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: tsln.resultsPage[benefit].Message,
                  }}
                ></span>
              </MessageBox>
            </>
          ))}
        </>
      )}
    </div>
  )
})
