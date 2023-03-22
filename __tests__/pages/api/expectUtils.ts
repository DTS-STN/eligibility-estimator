import {
  EntitlementResultType,
  LegalStatus,
  LivingCountry,
  ResultKey,
  ResultReason,
  SummaryState,
} from '../../../utils/api/definitions/enums'
import { ResponseSuccess } from '../../../utils/api/definitions/types'
import legalValues from '../../../utils/api/scrapers/output'
import { MockResponseObject } from './factory'

export function expectAfsMarital(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.results.afs.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.MARITAL)
}

export function expectAlwTooOld(
  res: MockResponseObject<ResponseSuccess>,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults
  expect(results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(results.alw.eligibility.reason).toEqual(ResultReason.AGE)
}

export function expectAlwAfsTooOld(res: MockResponseObject<ResponseSuccess>) {
  expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  expect(res.body.results.afs.eligibility.result).toEqual(ResultKey.INELIGIBLE)
  expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.AGE)
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
  expect(res.body.results.afs.eligibility.result).toEqual(ResultKey.INELIGIBLE)
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
      entitlement - results.oas.entitlement.clawback
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

  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement) expect(results.gis.entitlement.result).toEqual(entitlement)
}

export function expectGisNotEligible(
  res: MockResponseObject<ResponseSuccess>,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults

  expect(results.gis.eligibility.result).not.toEqual(ResultKey.ELIGIBLE)
  expect(results.gis.entitlement.result).toEqual(0)
}

export function expectAlwEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number,
  partner?: boolean
) {
  const results = !partner ? res.body.results : res.body.partnerResults

  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(results.alw.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement) expect(results.alw.entitlement.result).toEqual(entitlement)
}

export function expectAfsEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number
) {
  expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
  expect(res.body.results.afs.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement)
    expect(res.body.results.afs.entitlement.result).toEqual(entitlement)
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
  partnerLivedOutsideCanada: undefined,
  partnerYearsInCanadaSince18: undefined,
  partnerEverLivedSocialCountry: undefined,
}

export const partnerNoHelpNeeded = {
  partnerLivingCountry: undefined,
  partnerLegalStatus: undefined,
  partnerLivedOutsideCanada: undefined,
  partnerYearsInCanadaSince18: undefined,
  partnerEverLivedSocialCountry: undefined,
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
  incomeAvailable: true,
  income: 10000,
}

export const age65NoDefer = {
  age: 65,
  oasDefer: false,
  oasAge: undefined,
}

export const age75NoDefer = {
  age: 75,
  oasDefer: false,
  oasAge: undefined,
}

export const age60NoDefer = {
  age: 60,
  oasDefer: false,
  oasAge: undefined,
}

export const canadaWholeLife = {
  livedOutsideCanada: false,
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
