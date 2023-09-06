import { List } from 'lodash'
import {
  EntitlementResultType,
  LegalStatus,
  LivingCountry,
  ResultKey,
  ResultReason,
  SummaryState,
} from '../../../utils/api/definitions/enums'
import {
  ResponseSuccess,
  TableData,
} from '../../../utils/api/definitions/types'
import legalValues from '../../../utils/api/scrapers/output'
import { consoleDev } from '../../../utils/web/helpers/utils'
import { MockResponseObject } from './factory'

export function expectAlwsMarital(
  res: MockResponseObject<ResponseSuccess>,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults
  expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
}

export function expectAlwTooOld(
  res: MockResponseObject<ResponseSuccess>,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults
  expect(results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(results.alw.eligibility.reason).toEqual(ResultReason.AGE)
}
export function expectAlwTooYoung(
  res: MockResponseObject<ResponseSuccess>,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults
  expect(results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(results.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
}

export function expectAlwAlwsTooOld(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
}

export function expectOasGisTooYoung(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  // expect(res.body.results.oas.eligibility.reason).toEqual(
  //   ResultReason.AGE_YOUNG
  // )
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
}

export function expectOasGisUnavailable(
  res: MockResponseObject<ResponseSuccess>
) {
  expect(res.body.summary.state).toEqual(SummaryState.UNAVAILABLE)
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.UNAVAILABLE)
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.UNAVAILABLE)
}

export function expectAllIneligible(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.missingFields).toEqual([])
  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_INELIGIBLE)
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
}

export function expectOasEligible(
  res: MockResponseObject<ResponseSuccess>,
  oasType: EntitlementResultType = EntitlementResultType.FULL,
  entitlement?: number,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults

  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.NONE)
  expect(results.oas.entitlement.type).toEqual(oasType)
  if (oasType === EntitlementResultType.FULL && !entitlement)
    entitlement = legalValues.oas.amount
  if (entitlement)
    expect(results.oas.entitlement.result).toEqual(
      //entitlement - results.oas.entitlement.clawback //with clawback #114098
      entitlement //without clawback #114098
    )
}

export function expectOasNotEligible(
  res: MockResponseObject<ResponseSuccess>,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults

  expect(results.oas.eligibility.result).not.toEqual(ResultKey.ELIGIBLE)
  expect(results.oas.entitlement.result).toEqual(0)
}

export function expectGisEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults
  const state = !partner
    ? res.body.summary.state
    : res.body.summary.partnerState

  // expect(state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  // expect(results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement) expect(results.gis.entitlement.result).toEqual(entitlement)
}

export function expectGisNotEligible(
  res: MockResponseObject<ResponseSuccess>,
  reason?: string,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults
  if (reason) expect(res.body.results.gis.eligibility.reason).toEqual(reason)
  expect(results.gis.eligibility.result).not.toEqual(ResultKey.ELIGIBLE)
  expect(results.gis.entitlement.result).toEqual(0)
}

export function expectDeferralTable(
  res: MockResponseObject<ResponseSuccess>,
  expectedDeferralTable: TableData[],
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults

  const deferralTable = results.oas.cardDetail.meta?.tableData

  expect(expectedDeferralTable.length).toEqual(deferralTable.length)
  expect(
    expectedDeferralTable.every((item1) =>
      deferralTable.some(
        (item2) => JSON.stringify(item1) === JSON.stringify(item2)
      )
    )
  )
}

export function expectFutureBenefitEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlementOas?: number,
  entitlementGis?: number,
  partner?: boolean
) {
  const results = !partner
    ? res.body.futureClientResults
    : res.body.futurePartnerResults


  consoleDev('**** future details' + results.oas.eligibility.detail)
  consoleDev('**** future reason' + results.oas.eligibility.reason)
  consoleDev('**** future result' + results.oas.eligibility.result)
  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(results.oas.eligibility.reason).toEqual(ResultReason.NONE)
  expect(results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlementOas)
    expect(results.oas.entitlement.result).toEqual(entitlementOas)
  if (entitlementGis)
    expect(results.gis.entitlement.result).toEqual(entitlementGis)
}

export function expectAlwEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults

  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
 // expect(results.alw.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement) expect(results.alw.entitlement.result).toEqual(entitlement)
}

export function expectAlwsEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults

  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement)
    expect(res.body.results.alws.entitlement.result).toEqual(entitlement)
}

export function expectOasGisEligible(
  res: MockResponseObject<ResponseSuccess>,
  oasType: EntitlementResultType = EntitlementResultType.FULL,
  oasEntitlement?: number,
  gisEntitlement?: number
) {
  expectOasEligible(res, oasType, oasEntitlement)
  expectGisEligible(res, gisEntitlement)
}

export const partnerUndefined = {
  partnerBenefitStatus: undefined,
  partnerIncomeAvailable: undefined,
  partnerIncome: undefined,
  partnerAge: undefined,
  partnerLivingCountry: undefined,
  partnerLegalStatus: undefined,
  partnerLivedOnlyInCanada: undefined,
  partnerYearsInCanadaSince18: undefined,
}

export const partnerNoHelpNeeded = {
  partnerLivingCountry: undefined,
  partnerLegalStatus: undefined,
  partnerLivedOnlyInCanada: undefined,
  partnerYearsInCanadaSince18: undefined,
}

export const partnerIncomeZero = {
  partnerIncomeAvailable: true,
  partnerIncome: 0,
}

export const incomeZero = {
  incomeAvailable: true,
  income: 0,
}

export const income10k = {
  incomeAvailable: undefined,
  income: 10000,
}

export const age65NoDefer = {
  age: 65,
  oasDefer: false,
  oasAge: undefined,
  receiveOAS: false,
  oasDeferDuration: undefined,
}

export const age75NoDefer = {
  age: 75,
  oasDefer: false,
  oasAge: undefined,
  receiveOAS: false,
  oasDeferDuration: undefined,
}

export const age60NoDefer = {
  age: 60,
  oasDefer: false,
  oasAge: undefined,
  receiveOAS: false,
  oasDeferDuration: undefined,
}

export const canadaWholeLife = {
  livedOnlyInCanada: true,
  yearsInCanadaSince18: undefined,
  everLivedSocialCountry: undefined,
}

export const canadian = {
  livingCountry: LivingCountry.CANADA,
  legalStatus: LegalStatus.YES,
}

export const getErrorDetails = (res) => {
  const missingFields: Array<string> = res.body.missingFields
  const visibleFields: Array<string> = res.body.visibleFields
  const arrOfErrors = res.body.detail.details.filter(
    (err) =>
      !missingFields.includes(err.context.key) &&
      visibleFields.includes(err.context.key)
  )
  return arrOfErrors
}
