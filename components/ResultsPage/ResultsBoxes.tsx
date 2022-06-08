import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import React from 'react'
import { numberToStringCurrency } from '../../i18n/api'
import { WebTranslations } from '../../i18n/web'
import { Locale } from '../../utils/api/definitions/enums'
import { useStore, useTranslation } from '../Hooks'
import { ResultsTableRow } from './ResultsTableRow'
import { MessageBox } from './MessageBox'

export const ResultsBoxes = observer(() => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()
  const currentLocale = useRouter().locale

  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR

  // Send the details and eligibility results separately and create a new column
  return (
    <div>

      {/* Your may be eligible */}

      <h2 id="eligible" className="h2 mt-5"><Image src="/eligible.png" alt="Eligible" width={30} height={30} />&nbsp; {tsln.resultsPage.youMayBeEligible}</h2>

      <div className='pl-12'>
        {tsln.resultsPage.basedOnYourInfo}

        <ul className="pl-5 list-disc text-content font-semibold">
          {root.oas?.eligibility?.detail.split('\n')[0] === ('Eligible' || 'Admissible') ? <li key={root.oas}>{tsln.oas}</li> : ''}
          {root.gis?.eligibility?.detail.split('\n')[0] === ('Eligible' || 'Admissible') ? <li key={root.gis}>{tsln.gis}</li> : ''}
          {root.allowance?.eligibility?.detail.split('\n')[0] === ('Eligible' || 'Admissible') ? <li key={root.allowance}>{tsln.alw}</li> : ''}
          {root.afs?.eligibility?.detail.split('\n')[0] === ('Eligible' || 'Admissible') ? <li key={root.afs}>{tsln.afs}</li> : ''}
        </ul>
      </div>

      {/* Your estimated monthly total */}

      <h2 id="estimated" className="h2 mt-5"><Image src="/money.png" alt="dollar sign" width={30} height={30} />&nbsp; {tsln.resultsPage.yourEstimatedTotal} {numberToStringCurrency(root.summary.entitlementSum, locale)}</h2>

      <div className='pl-12'>
        {tsln.resultsPage.basedOnYourInfoTotal} {numberToStringCurrency(root.summary.entitlementSum, locale)}

        <h3 className='my-6 font-semibold'>{tsln.resultsPage.header}</h3>

        <table className="hidden md:block text-left">
          <thead className="font-bold border border-[#DDDDDD] bg-[#EEEEEE]">
            <tr>
              <th>{tsln.resultsPage.tableHeader1}</th>
              <th>{tsln.resultsPage.tableHeader2}</th>
            </tr>
          </thead>

          <tbody className="align-top">
            <ResultsTableRow
              heading={tsln.oas}
              data={root.oas}
              locale={locale}
              showEntitlement={!root.summary.zeroEntitlements}
            />
            <ResultsTableRow
              heading={tsln.gis}
              data={root.gis}
              locale={locale}
              showEntitlement={!root.summary.zeroEntitlements}
            />
            <ResultsTableRow
              heading={tsln.alw}
              data={root.allowance}
              locale={locale}
              showEntitlement={!root.summary.zeroEntitlements}
            />
            <ResultsTableRow
              heading={tsln.afs}
              data={root.afs}
              locale={locale}
              showEntitlement={!root.summary.zeroEntitlements}
            />
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

      {/* Next steps for benefits you may be eligible */}

      <hr className='my-12 border border-[#BBBFC5]' />

      <h2 id="next" className="h2 mt-5">{tsln.resultsPage.nextSteps}</h2>

      <MessageBox title={tsln.oas} eligible={true} eligibleText="Eligible" links={[{icon:'info', url:'canada.ca', alt:'info', text:"Learn more about OAS" }]}> Based en what you told us <strong>you do not need to apply</strong> You will ...</MessageBox>
      <MessageBox title={tsln.gis} eligible={true} eligibleText="Eligible" links={[{icon:'info', url:'canada.ca', alt:'info', text:"Learn more about GIS" }, {icon:'link', url:'canada.ca', alt:'link', text:"Determine if you need to apply to GIS" }]}> Based en what you told us <strong>you may have to apply</strong> for this benefit ...</MessageBox>
      
      {/* Benefits you may not be eligible */}

      <h2 id="next" className="h2 mt-12">{tsln.resultsPage.youMayNotBeEligible}</h2>
      
      <MessageBox title={tsln.alw} eligible={false} eligibleText="Not eligible" links={[{icon:'info', url:'canada.ca', alt:'info', text:"Learn more about Allowance benefit" }, , {icon:'note', url:'canada.ca', alt:'note', text:"View the full eligibility criteria for the allowance benefit" }]}> The allowance benefit is for indivuduals between the ages of 60 and 64 </MessageBox>
      <MessageBox title={tsln.afs} eligible={false} eligibleText="Not eligible" links={[{icon:'info', url:'canada.ca', alt:'info', text:"Learn more about the Allowance for the survivor benefit" }, {icon:'note', url:'canada.ca', alt:'note', text:"View the full eligibity critera for AFS" }]}> The allowance for the survivor is for individuals between ...</MessageBox>

      
      {/* desktop only */}
      {/* <table className="hidden md:block text-left">
        <thead className="font-bold border-b border-content">
          <tr>
            <th>{tsln.resultsPage.tableHeader1}</th>
            <th>{tsln.resultsPage.tableHeader2}</th>
            <th>{tsln.resultsPage.tableHeader2}</th>
            {!root.summary.zeroEntitlements && (
              <th className="text-right min-w-[68px]">
                {tsln.resultsPage.tableHeader2}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="align-top">
          <ResultsTableRowDesktop
            heading={tsln.oas}
            data={root.oas}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={false}
          />
          <ResultsTableRowDesktop
            heading={tsln.gis}
            data={root.gis}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={true}
          />
          <ResultsTableRowDesktop
            heading={tsln.alw}
            data={root.allowance}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={false}
          />
          <ResultsTableRowDesktop
            heading={tsln.afs}
            data={root.afs}
            locale={locale}
            showEntitlement={!root.summary.zeroEntitlements}
            tintedBackground={true}
          />
          {!root.summary.zeroEntitlements && (
            <tr className="border-t border-content font-bold">
              <td colSpan={3}>{tsln.resultsPage.tableTotalAmount}</td>
              <td className="text-right min-w-[68px]">
                {numberToStringCurrency(root.summary.entitlementSum, locale)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* mobile only */}

      {/* 
      <div className="block md:hidden">
        <ResultsTableRowMobile
          heading={tsln.oas}
          tsln={tsln}
          data={root.oas}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        <ResultsTableRowMobile
          heading={tsln.gis}
          tsln={tsln}
          data={root.gis}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        <ResultsTableRowMobile
          heading={tsln.alw}
          tsln={tsln}
          data={root.allowance}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        <ResultsTableRowMobile
          heading={tsln.afs}
          tsln={tsln}
          data={root.afs}
          locale={locale}
          showEntitlement={!root.summary.zeroEntitlements}
        />
        {!root.summary.zeroEntitlements && (
          <div className="mb-4">
            <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-muted">
              {tsln.resultsPage.tableTotalAmount}
            </p>
            <p className="px-1.5 py-1.5 font-bold">
              {numberToStringCurrency(root.summary.entitlementSum, locale)}
            </p>
          </div>
        )}
      </div> 
       */}
    </div>
  )
})
