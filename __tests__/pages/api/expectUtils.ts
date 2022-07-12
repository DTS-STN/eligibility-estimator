import {
  EntitlementResultType,
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import { ResponseSuccess } from '../../../utils/api/definitions/types'
import legalValues from '../../../utils/api/scrapers/output'
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

export function expectOasGisUnavailable(
  res: MockResponseObject<ResponseSuccess>
) {
  expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.UNAVAILABLE)
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.UNAVAILABLE)
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
  oasType: EntitlementResultType = EntitlementResultType.FULL,
  entitlement?: number
) {
  expect(res.body.summary.state).toEqual(
    EstimationSummaryState.AVAILABLE_ELIGIBLE
  )
  expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.NONE)
  expect(res.body.results.oas.entitlement.type).toEqual(oasType)
  if (oasType === EntitlementResultType.FULL && !entitlement)
    entitlement = legalValues.oas.amount
  if (entitlement)
    expect(res.body.results.oas.entitlement.result).toEqual(entitlement)
}

export function expectGisEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number
) {
  expect(res.body.summary.state).toEqual(
    EstimationSummaryState.AVAILABLE_ELIGIBLE
  )
  expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement)
    expect(res.body.results.gis.entitlement.result).toEqual(entitlement)
}

export function expectAlwEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number
) {
  expect(res.body.summary.state).toEqual(
    EstimationSummaryState.AVAILABLE_ELIGIBLE
  )
  expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.NONE)
  if (entitlement)
    expect(res.body.results.alw.entitlement.result).toEqual(entitlement)
}

export function expectAfsEligible(
  res: MockResponseObject<ResponseSuccess>,
  entitlement?: number
) {
  expect(res.body.summary.state).toEqual(
    EstimationSummaryState.AVAILABLE_ELIGIBLE
  )
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
  partnerBirthMonth: undefined,
  partnerBirthYear: undefined,
  partnerLivingCountry: undefined,
  partnerLegalStatus: undefined,
  partnerLivedOutsideCanada: undefined,
  partnerYearsInCanadaSince18: undefined,
  partnerEverLivedSocialCountry: undefined,
}

export const partnerNoHelpNeeded = {
  partnerAge: undefined,
  partnerBirthMonth: undefined,
  partnerBirthYear: undefined,
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
  legalStatus: LegalStatus.CANADIAN_CITIZEN,
}
