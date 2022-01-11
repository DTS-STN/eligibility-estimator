import { observer } from 'mobx-react'
import { ResultKey } from '../../utils/api/definitions/enums'
import { useStore } from '../Hooks'

export const ResultsTable = observer(() => {
  const root = useStore()
  return (
    <table className=" text-left">
      <thead className="font-semibold text-content border-b border-content">
        <tr className=" ">
          <th>Sample Benefits</th>
          <th>Eligibility</th>
          <th>Estimated Monthly Amount (CAD)</th>
        </tr>
      </thead>
      <tbody className="align-top">
        <tr className="">
          <td>Old Age Security (OAS)</td>
          <td>
            <>
              {root.oas.detail.split('\n').map((str, i) => (
                <p key={i}>{str}</p>
              ))}
            </>
          </td>
          <td>${root.oas.entitlementResult}</td>
        </tr>
        <tr className="bg-[#E8F2F4]">
          <td>Guaranteed Income Supplement (GIS)</td>
          <td>
            <>
              {root.gis.detail.split('\n').map((str, i) => (
                <p key={i}>{str}</p>
              ))}
            </>
          </td>
          <td>${root.gis.entitlementResult}</td>
        </tr>
        <tr>
          <td>Allowance</td>
          <td>
            <>
              {root.allowance.detail.split('\n').map((str, i) => (
                <p key={i}>{str}</p>
              ))}
            </>
          </td>
          <td>${root.allowance && root.allowance.entitlementResult}</td>
        </tr>
        <tr className="bg-[#E8F2F4]">
          <td>Allowance for Survivor</td>
          <td>
            <>
              {root.afs.detail.split('\n').map((str, i) => (
                <p key={i}>{str}</p>
              ))}
            </>
          </td>
          <td>${root.afs && root.afs.entitlementResult}</td>
        </tr>
        <tr className="border-t border-content font-semibold ">
          <td colSpan={2}>Total Monthly Benefit Amount</td>
          <td>
            $
            {root.oas.entitlementResult +
              root.gis.entitlementResult +
              root.allowance?.entitlementResult +
              root.afs?.entitlementResult}
          </td>
        </tr>
      </tbody>
    </table>
  )
})
