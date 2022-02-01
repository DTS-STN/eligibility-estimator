import { observer } from 'mobx-react'
import { ResultKey } from '../../utils/api/definitions/enums'
import { useStore } from '../Hooks'
import { EligibilityDetails } from './EligibilityDetails'

export const ResultsTable = observer(() => {
  const root = useStore()
  return (
    <>
      <table className="hidden md:block text-left">
        <thead className="font-semibold text-content border-b border-content">
          <tr className=" ">
            <th>Sample Benefits</th>
            <th>Eligibility</th>
            <th>Estimated Monthly Amount (CAD)</th>
          </tr>
        </thead>
        <tbody className="align-top">
          <tr>
            <td>Old Age Security (OAS)</td>
            <td>
              <EligibilityDetails eligibilityType={root.oas} />
            </td>
            <td>${root.oas.entitlement.result}</td>
          </tr>
          <tr className="bg-[#E8F2F4]">
            <td>Guaranteed Income Supplement (GIS)</td>
            <td>
              <EligibilityDetails eligibilityType={root.gis} />
            </td>
            <td>
              {root.gis.entitlement.result !== -1
                ? `$${root.gis.entitlement.result}`
                : 'Unavailable'}
            </td>
          </tr>
          <tr>
            <td>Allowance</td>
            <td>
              <EligibilityDetails eligibilityType={root.allowance} />
            </td>
            <td>${root.allowance && root.allowance.entitlement.result}</td>
          </tr>
          <tr className="bg-[#E8F2F4]">
            <td>Allowance for Survivor</td>
            <td>
              <EligibilityDetails eligibilityType={root.afs} />
            </td>
            <td>${root.afs && root.afs.entitlement.result}</td>
          </tr>
          <tr className="border-t border-content font-semibold ">
            <td colSpan={2}>Estimated Total Monthly Benefit Amount</td>
            <td>${root.totalEntitlementInDollars}</td>
          </tr>
        </tbody>
      </table>
      <div className="block md:hidden">
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Old Age Security (OAS)
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.oas} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>$
            {root.oas.entitlement.result}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Guaranteed Income Supplement (GIS)
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.gis} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>$
            {root.gis.entitlement.result}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Allowance
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.allowance} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>$
            {root.allowance.entitlement.result}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Allowance for the Survivor
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Eligibility: </span>
            <EligibilityDetails eligibilityType={root.afs} />
          </p>
          <p className="px-1.5 py-1.5">
            <span className="font-bold">Estimated Monthly Amount (CAD): </span>$
            {root.afs.entitlement.result}
          </p>
        </div>
        <div className="mb-4">
          <p className="bg-[#E8F2F4] font-bold px-1.5 py-2 border-b border-[#111]">
            Estimated Total Monthly Benefit Amount
          </p>
          <p className="px-1.5 py-1.5 font-bold">
            ${root.totalEntitlementInDollars}
          </p>
        </div>
      </div>
    </>
  )
})
