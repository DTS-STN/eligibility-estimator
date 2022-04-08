import {
  EntitlementResultType,
  EstimationSummaryState,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import { ResponseSuccess } from '../../../utils/api/definitions/types'
import { MockResponseObject } from './factory'

export function expectAlwAfsTooOld(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  expect(res.body.results.afs.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.AGE)
}

export function expectOasGisTooYoung(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.oas.eligibility.reason).toEqual(
    ResultReason.AGE_YOUNG
  )
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
}

export function expectAllIneligible(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.summary.state).toEqual(
    EstimationSummaryState.AVAILABLE_INELIGIBLE
  )
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.afs.eligibility.result).toEqual(ResultKey.INELIGIBLE)
}

export function expectOasEligible(
  res: MockResponseObject<ResponseSuccess>,
  oasType: EntitlementResultType = EntitlementResultType.FULL
) {
  expect(res.body.summary.state).toEqual(
    EstimationSummaryState.AVAILABLE_ELIGIBLE
  )
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(res.body.results.oas.entitlement.type).toEqual(oasType)
}

export function expectOasGisEligible(
  res: MockResponseObject<ResponseSuccess>,
  oasType: EntitlementResultType = EntitlementResultType.FULL
) {
  expectOasEligible(res, oasType)
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
}
